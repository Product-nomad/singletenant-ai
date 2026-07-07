// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://singletenant.ai',
  integrations: [mdx(), sitemap()],
  vite: {
    // @ts-expect-error plugin type identity clash between astro's bundled
    // vite and @tailwindcss/vite's peer — runtime is fine
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
