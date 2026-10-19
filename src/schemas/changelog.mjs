// Changelog schema: validates data/changelog.yaml (SPEC piece 7).
// The public /changelog/ page and the homepage stat strip both render from
// that file; this schema is shared by the page loader, npm run validate,
// and the node --test suite, same pattern as vendor.mjs.
import { z } from 'astro/zod';
import { isoDate, maxWords } from './vendor.mjs';

export const CHANGE_TYPES = ['added', 'updated', 'removed', 'corrected'];

export const changelogEntrySchema = z
  .object({
    date: isoDate,
    type: z.enum(CHANGE_TYPES),
    vendors: z
      .array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
      .default([])
      .describe('Slugs of the vendor files this change touched'),
    summary: maxWords(60, 'summary').describe('Factual, no hype'),
    sources: z
      .array(z.string().url())
      .default([])
      .describe('Primary sources for the change, linked under the entry'),
  })
  .strict();

export const changelogSchema = z
  .array(changelogEntrySchema)
  .min(1)
  .refine(
    (entries) =>
      entries.every((e, i) => i === 0 || e.date <= entries[i - 1].date),
    'entries must be ordered newest-first',
  );
