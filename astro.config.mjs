// @ts-check

import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { sitemapExclude, sitemapLastmod } from './src/lib/sitemap.mjs';

// Data-backed lastmod per URL (vendor last_verified and fact dates, article
// dates); see src/lib/sitemap.mjs.
// noindex pages (low-value compare pairs) are left out entirely.
const root = fileURLToPath(new URL('.', import.meta.url));
const lastmod = sitemapLastmod(root);
const exclude = sitemapExclude(root);

// https://astro.build/config
export default defineConfig({
  site: 'https://singletenant.ai',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !exclude.has(page),
      serialize(item) {
        const date = lastmod.get(item.url);
        if (date) item.lastmod = date;
        return item;
      },
    }),
  ],
  vite: {
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
