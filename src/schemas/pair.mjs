// Pair-specific analysis for a compare page (src/content/pairs/<a>-vs-<b>.md).
// A low-scoring pair is only overridden to indexed once it has written,
// sourced analysis (AUDIT.md 2.3); tests/pairs.test.mjs keeps the override
// list and these files in step. Same evidence rule as vendor data: every
// source carries the date it was checked, and last_verified is the oldest.
import { z } from 'astro/zod';
import { isoDate } from './vendor.mjs';

export const pairSchema = z
  .object({
    pair: z
      .string()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*-vs-[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'pair must be the canonical <a>-vs-<b> slug',
      ),
    last_verified: isoDate,
    sources: z
      .array(z.object({ url: z.string().url(), verified: isoDate }).strict())
      .min(1),
  })
  .strict()
  .refine(
    (v) => v.last_verified === v.sources.map((s) => s.verified).sort()[0],
    'last_verified must equal the oldest source date',
  );
