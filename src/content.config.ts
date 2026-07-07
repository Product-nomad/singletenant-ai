import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { vendorSchema } from './schemas/vendor.mjs';

/* ─────────────────────────────────────────────────────────────
   Vendor collection — the core directory database.
   Each vendor is one YAML file in src/content/vendors/.
   Schema v2 lives in src/schemas/vendor.mjs so the node --test
   suite validates against the exact same object (SPEC §5).
   ───────────────────────────────────────────────────────────── */

const vendors = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/vendors' }),
  schema: vendorSchema,
});

/* ─────────────────────────────────────────────────────────────
   Articles collection — long-form content (MDX with body).
   ───────────────────────────────────────────────────────────── */

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z
      .string()
      .max(180)
      .describe('Meta description, used in search results and social cards'),
    pub_date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().default('Simon Wilson'),
    category: z.enum(['guide', 'comparison', 'analysis', 'vertical', 'news']),
    target_keyword: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { vendors, articles };
