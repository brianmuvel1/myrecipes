import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import node from '@astrojs/node';

import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  adapter: vercel(),
  vite: {
    build: {
      rollupOptions: {
        external: ['sharp'],
      },
    },
  },
});