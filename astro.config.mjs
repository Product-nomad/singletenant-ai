// @ts-check

import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { sitemapLastmod } from './src/lib/sitemap.mjs';

// Data-backed lastmod per URL (vendor last_verified and fact dates, article
// dates); see src/lib/sitemap.mjs.
const lastmod = sitemapLastmod(fileURLToPath(new URL('.', import.meta.url)));

// https://astro.build/config
export default defineConfig({
  site: 'https://singletenant.ai',
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        const date = lastmod.get(item.url);
        if (date) item.lastmod = date;
        return item;
      },
    }),
  ],
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
