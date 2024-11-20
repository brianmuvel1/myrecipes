import type { APIRoute } from 'astro';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('recipeFile') as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ message: 'No file uploaded' }), 
        { status: 400 }
      );
    }

    // Validate file is JSON
    if (!file.name.endsWith('.json')) {
      return new Response(
        JSON.stringify({ message: 'Only JSON files are allowed' }), 
        { status: 400 }
      );
    }

    // Read file content
    const content = await file.text();
    
    // Validate JSON structure
    try {
      const json = JSON.parse(content);
      if (!json.recipes || !Array.isArray(json.recipes)) {
        throw new Error('Invalid recipe file structure');
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ message: 'Invalid JSON format' }), 
        { status: 400 }
      );
    }

    // Save file to data directory
    const dataPath = join(fileURLToPath(new URL('../../data', import.meta.url)));
    const filePath = join(dataPath, file.name);
    
    await writeFile(filePath, content);

    return new Response(
      JSON.stringify({ message: 'Recipe file uploaded successfully' }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ message: 'Error uploading file' }), 
      { status: 500 }
    );
  }
}