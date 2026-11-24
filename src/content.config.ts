import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { glossaryTermSchema, guideSchema } from './schemas/guide.mjs';
import { isJurisdiction } from './schemas/jurisdictions.mjs';
import { pairSchema } from './schemas/pair.mjs';
import { isoDate, vendorSchema } from './schemas/vendor.mjs';

/* ─────────────────────────────────────────────────────────────
   Vendor collection: the core directory database.
   Each vendor is one YAML file in src/content/vendors/.
   Schema v2 lives in src/schemas/vendor.mjs so the node --test
   suite validates against the exact same object (SPEC §5).
   ───────────────────────────────────────────────────────────── */

const vendors = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/vendors' }),
  schema: vendorSchema,
});

/* ─────────────────────────────────────────────────────────────
   Articles collection: long-form content (MDX with body).
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
    last_verified: isoDate
      .optional()
      .describe(
        'Date every factual claim was last checked against its source; renders "Last verified"',
      ),
    category: z.enum(['guide', 'comparison', 'analysis', 'vertical', 'news']),
    target_keyword: z.string().optional(),
    keywords: z
      .array(z.string())
      .default([])
      .describe('Target query cluster this piece is written for'),
    tags: z.array(z.string()).default([]),
    jurisdiction: z
      .array(
        z
          .string()
          .refine(isJurisdiction, 'not in src/schemas/jurisdictions.mjs'),
      )
      .default([])
      .describe(
        'Jurisdictions the piece is specific to; lists it on /jurisdictions/',
      ),
    sponsor: z
      .string()
      .optional()
      .describe('Sponsor name; ArticleLayout then labels the piece Sponsored'),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/* ─────────────────────────────────────────────────────────────
   Guides: evergreen buyer guides under /guides/. Stubs are outlines
   awaiting the editor; see src/schemas/guide.mjs for the rules.
   ───────────────────────────────────────────────────────────── */

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: guideSchema,
});

/* ─────────────────────────────────────────────────────────────
   Glossary: one YAML list of terms, rendered on /glossary/.
   ───────────────────────────────────────────────────────────── */

const glossary = defineCollection({
  loader: file('src/content/glossary.yaml'),
  schema: glossaryTermSchema,
});

/* ─────────────────────────────────────────────────────────────
   Pairs: written analysis for individual compare pages, keyed by
   the canonical <a>-vs-<b> slug. See src/schemas/pair.mjs.
   ───────────────────────────────────────────────────────────── */

const pairs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pairs' }),
  schema: pairSchema,
});

export const collections = { vendors, articles, guides, glossary, pairs };
