import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface Recipe {
  title: string;
  category: string[];
  ingredients: string[];
  directions: string[];
  image?: string;
}

export async function loadAllRecipes(): Promise<Recipe[]> {
  const dataPath = join(fileURLToPath(new URL('..', import.meta.url)), 'data');
  const files = await readdir(dataPath);
  const jsonFiles = files.filter(file => file.endsWith('.json'));
  
  const recipes: Recipe[] = [];
  
  for (const file of jsonFiles) {
    const module = await import(`../data/${file}`);
    if (module.default?.recipes) {
      recipes.push(...module.default.recipes);
    }
  }
  
  return recipes;
}