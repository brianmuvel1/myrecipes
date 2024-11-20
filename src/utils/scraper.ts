import { load } from 'cheerio';
import crossFetch from 'cross-fetch';
import { writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import type { Recipe } from './types';
import { HttpsProxyAgent } from 'https-proxy-agent';

const RecipeSchema = z.object({
  title: z.string().min(1),
  category: z.array(z.string()),
  ingredients: z.array(z.string()).min(1),
  directions: z.array(z.string()).min(1),
});

async function fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
      };

      // Try direct fetch first
      try {
        const response = await crossFetch(url, { headers });
        if (response.ok) return response;
      } catch (directError) {
        console.warn('Direct fetch failed, trying with proxy...', directError);
      }

      // If direct fetch fails, try with proxy
      const proxyUrl = process.env.HTTP_PROXY || 'http://proxy.example.com:8080';
      const agent = new HttpsProxyAgent(proxyUrl);
      const response = await crossFetch(url, { 
        agent,
        headers,
        timeout: 10000 // 10 seconds timeout
      });

      if (response.ok) return response;
      lastError = new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      if (i === maxRetries - 1) break;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }

  throw lastError || new Error('Failed to fetch after multiple retries');
}

export async function scrapeRecipe(url: string): Promise<Recipe> {
  try {
    const response = await fetchWithRetry(url);
    const html = await response.text();
    const $ = load(html);
    
    // More specific selectors for better recipe detection
    const title = $('h1, .recipe-title, [class*="title"], .heading-title, [itemprop="name"]')
      .first()
      .text()
      .trim();

    const categorySelectors = [
      '.recipe-category', 
      '.category', 
      '[class*="category"]',
      '.tags', 
      '.recipe-tags',
      '[itemprop="recipeCategory"]'
    ];
    
    const category = $(categorySelectors.join(', '))
      .find('a, span, li')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean);

    const ingredientSelectors = [
      '.ingredients li',
      '.ingredient-list li',
      '[class*="ingredient"]',
      '[itemprop="recipeIngredient"]',
      '.recipe-ingredients li'
    ];
    
    const ingredients = $(ingredientSelectors.join(', '))
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean);

    const directionSelectors = [
      '.directions li',
      '.instructions li',
      '.steps li',
      '[class*="instruction"]',
      '[class*="direction"]',
      '[class*="step"]',
      '[itemprop="recipeInstructions"]'
    ];
    
    const directions = $(directionSelectors.join(', '))
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean);

    // Validate and clean data
    const recipe = {
      title: title || 'Untitled Recipe',
      category: category.length ? [...new Set(category)] : ['Uncategorized'],
      ingredients: [...new Set(ingredients)],
      directions: directions.filter(d => d.length > 5) // Remove very short directions
    };

    return RecipeSchema.parse(recipe);
  } catch (error) {
    console.error('Error scraping recipe:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to scrape recipe: ${error.message}`
        : 'Failed to scrape recipe'
    );
  }
}

export async function scrapeMultipleRecipes(url: string): Promise<Recipe[]> {
  try {
    const response = await fetchWithRetry(url);
    const html = await response.text();
    const $ = load(html);
    
    const recipeLinks = new Set<string>();
    
    // More comprehensive link detection
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      
      const isRecipeLink = 
        href.includes('recipe') ||
        href.includes('recipes') ||
        $(el).hasClass('recipe-card') ||
        $(el).hasClass('recipe-link') ||
        $(el).parents('.recipe-card, .recipe-list').length > 0;
        
      if (isRecipeLink) {
        try {
          const fullUrl = new URL(href, url).toString();
          recipeLinks.add(fullUrl);
        } catch (error) {
          console.warn('Invalid URL:', href);
        }
      }
    });

    if (recipeLinks.size === 0) {
      throw new Error('No recipe links found on the page');
    }

    const recipes: Recipe[] = [];
    const errors: string[] = [];
    
    // Limit to 50 recipes and process in batches
    const links = Array.from(recipeLinks).slice(0, 50);
    const batchSize = 5;
    
    for (let i = 0; i < links.length; i += batchSize) {
      const batch = links.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(link => scrapeRecipe(link))
      );
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          recipes.push(result.value);
        } else {
          errors.push(`Failed to scrape recipe from ${batch[index]}: ${result.reason}`);
        }
      });
      
      // Small delay between batches to be nice to servers
      if (i + batchSize < links.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (recipes.length === 0) {
      throw new Error('Failed to scrape any recipes. Errors: ' + errors.join('; '));
    }

    return recipes;
  } catch (error) {
    console.error('Error scraping multiple recipes:', error);
    throw error;
  }
}

export async function saveRecipes(recipes: Recipe[]) {
  const dataPath = join(fileURLToPath(new URL('..', import.meta.url)), 'data');
  const scrapedPath = join(dataPath, 'scraped.json');
  
  try {
    let existingData = { recipes: [] as Recipe[] };
    
    try {
      const existingContent = await readFile(scrapedPath, 'utf-8');
      existingData = JSON.parse(existingContent);
    } catch (error) {
      // File doesn't exist or is invalid, use empty data
    }

    // Remove duplicates based on title
    const uniqueRecipes = recipes.filter(newRecipe => 
      !existingData.recipes.some(existingRecipe => 
        existingRecipe.title.toLowerCase() === newRecipe.title.toLowerCase()
      )
    );

    existingData.recipes.push(...uniqueRecipes);
    await writeFile(scrapedPath, JSON.stringify(existingData, null, 2));
    
    return uniqueRecipes.length;
  } catch (error) {
    console.error('Error saving recipes:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to save recipes: ${error.message}`
        : 'Failed to save recipes'
    );
  }
}