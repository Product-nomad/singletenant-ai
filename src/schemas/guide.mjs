// Guide and glossary schemas (reposition 2026-10). Plain ESM like vendor.mjs so
// content.config.ts, the sitemap helper and the node --test suite share them.
//
// A guide or glossary term is either a 'stub' (an outline the editor has not
// written yet) or 'published'. Stubs build as noindex pages, stay out of the
// sitemap and are not linked from navigation; a published guide must carry its
// publish date and the date its facts were last verified.
import { z } from 'astro/zod';
import { isJurisdiction } from './jurisdictions.mjs';
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
    jurisdiction: z
      .array(z.string().refine(isJurisdiction, 'not in jurisdictions.mjs'))
      .default([])
      .describe('Jurisdictions the guide is specific to; empty means global'),
    vendors: z
      .array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
      .default([])
      .describe('Vendor slugs whose profiles link back to this guide'),
    sources: z
      .array(z.object({ url: z.string().url(), verified: isoDate }).strict())
      .default([])
      .describe('Primary sources, each with the date it was checked'),
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
    // Same evidence rule as vendor data: a published guide lists its sources,
    // and its "Last verified" date is the oldest of them.
    if (val.sources.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['sources'],
        message: 'a published guide needs sources',
      });
    } else {
      const oldest = val.sources.map((x) => x.verified).sort()[0];
      if (val.last_verified !== oldest) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['last_verified'],
          message: `last_verified must equal the oldest source date ${oldest}`,
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
