import type { APIRoute } from 'astro';
import { scrapeRecipe, scrapeMultipleRecipes, saveRecipes } from '../../utils/scraper';
import type { ScrapingResult } from '../../utils/types';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }

  try {
    const body = await request.json();
    const { url, type } = body;

    if (!url) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'URL is required' 
        } as ScrapingResult),
        { status: 400, headers }
      );
    }

    try {
      new URL(url); // Validate URL format
    } catch {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid URL format' 
        } as ScrapingResult),
        { status: 400, headers }
      );
    }

    if (type === 'single') {
      const recipe = await scrapeRecipe(url);
      const savedCount = await saveRecipes([recipe]);
      return new Response(
        JSON.stringify({ 
          success: true,
          message: savedCount ? 'Recipe scraped and saved successfully' : 'Recipe already exists',
          count: savedCount
        } as ScrapingResult),
        { status: 200, headers }
      );
    } else if (type === 'multiple') {
      const recipes = await scrapeMultipleRecipes(url);
      const savedCount = await saveRecipes(recipes);
      return new Response(
        JSON.stringify({ 
          success: true,
          message: `Successfully scraped ${recipes.length} recipes (${savedCount} new)`,
          count: savedCount
        } as ScrapingResult),
        { status: 200, headers }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Invalid scrape type' 
      } as ScrapingResult),
      { status: 400, headers }
    );
  } catch (error) {
    console.error('Scraping error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        message: error instanceof Error ? error.message : 'Failed to scrape recipe'
      } as ScrapingResult),
      { status: 500, headers }
    );
  }
}