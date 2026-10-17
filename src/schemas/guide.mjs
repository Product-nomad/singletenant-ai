// Guide and glossary schemas (reposition 2026-10). Plain ESM like vendor.mjs so
// content.config.ts, the sitemap helper and the node --test suite share them.
//
// A guide or glossary term is either a 'stub' (an outline the editor has not
// written yet) or 'published'. Stubs build as noindex pages, stay out of the
// sitemap and are not linked from navigation; a published guide must carry its
// publish date and the date its facts were last verified.
import { z } from 'astro/zod';
import { isoDate } from './vendor.mjs';

export const STATUSES = ['stub', 'published'];

export const guideSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().max(180),
    audience: z.string().min(1).describe('Who the guide is written for'),
    status: z.enum(STATUSES).default('stub'),
    pub_date: isoDate.optional(),
    updated: isoDate.optional(),
    last_verified: isoDate.optional(),
    order: z.number().int().default(0).describe('Position on the /guides/ hub'),
  })
  .strict()
  .superRefine((val, ctx) => {
    if (val.status !== 'published') return;
    for (const key of ['pub_date', 'last_verified']) {
      if (!val[key]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: `a published guide needs ${key}`,
        });
      }
    }
  });

export const glossaryTermSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    term: z.string().min(1),
    status: z.enum(STATUSES).default('stub'),
    definition: z.string().optional(),
    outline: z.array(z.string()).default([]),
    see_also: z
      .array(z.object({ label: z.string(), href: z.string() }).strict())
      .default([]),
  })
  .strict()
  .refine(
    (t) => t.status !== 'published' || Boolean(t.definition),
    'a published term needs a definition',
  );
