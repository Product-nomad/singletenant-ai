// Vendor schema v2 — the single source of truth for vendor data validation
// (SPEC_singletenant_v2.md §5). Lives in plain ESM so both Astro's content
// config and the node --test suite import the same object.
//
// Integrity gate: every populated fact carries an evidence_url and a verified
// date; 'unknown' is the only value allowed without evidence. The UI renders
// 'unknown' as "Not verified" — never as an unsourced claim.
import { z } from 'astro/zod';

export const CATEGORIES = [
  'dedicated-gpu',
  'hyperscaler-dedicated',
  'managed-selfhost',
  'eu-sovereign',
];

export const CERTS = [
  'SOC2_TYPE2',
  'SOC3',
  'ISO27001',
  'HIPAA_BAA',
  'GDPR_DPA',
  'C5',
  'SecNumCloud',
  'FEDRAMP',
];

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'verified must be YYYY-MM-DD')
  .refine((s) => !Number.isNaN(Date.parse(s)), 'verified must be a real date');

const evidenceUrl = z.string().url();

const maxWords = (limit, label) =>
  z
    .string()
    .min(1)
    .refine(
      (s) => s.trim().split(/\s+/).length <= limit,
      `${label} must be ${limit} words or fewer`,
    );

export const complianceEntrySchema = z
  .object({
    cert: z.enum(CERTS),
    evidence_url: evidenceUrl,
    verified: isoDate,
  })
  .strict();

// A fact block is either fully unknown (no evidence allowed) or populated
// (evidence_url + verified both required).
const evidenceInvariant = (isPopulated) => (val, ctx) => {
  if (isPopulated(val)) {
    if (!val.evidence_url) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['evidence_url'],
        message: 'populated facts require an evidence_url',
      });
    }
    if (!val.verified) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['verified'],
        message: 'populated facts require a verified date',
      });
    }
  } else if (val.evidence_url) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['evidence_url'],
      message: "'unknown' facts must not carry an evidence_url",
    });
  }
};

export const pricingSchema = z
  .object({
    model: z.string().min(1).describe("e.g. per-GPU-hour, or 'unknown'"),
    public: z.union([z.boolean(), z.literal('unknown')]).default('unknown'),
    evidence_url: evidenceUrl.optional(),
    verified: isoDate.optional(),
  })
  .strict()
  .superRefine(
    evidenceInvariant((v) => v.model !== 'unknown' || v.public !== 'unknown'),
  );

export const sovereigntySchema = z
  .object({
    data_residency_guarantee: z
      .union([z.boolean(), z.literal('unknown')])
      .default('unknown'),
    parent_jurisdiction: z
      .string()
      .min(1)
      .default('unknown')
      .describe("ISO country code of the parent company, or 'unknown'"),
    evidence_url: evidenceUrl.optional(),
    verified: isoDate.optional(),
  })
  .strict()
  .superRefine(
    evidenceInvariant(
      (v) =>
        v.data_residency_guarantee !== 'unknown' ||
        v.parent_jurisdiction !== 'unknown',
    ),
  );

export const vendorSchema = z
  .object({
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be kebab-case')
      .refine(
        (s) => !s.includes('-vs-'),
        "slug must not contain '-vs-' — it breaks /compare/[a]-vs-[b] routing",
      ),
    name: z.string().min(1),
    url: evidenceUrl.describe('Vendor homepage'),
    category: z.enum(CATEGORIES),
    tagline: maxWords(12, 'tagline').describe('Factual, no hype'),
    deployment_models: z.array(z.string().min(1)).default([]),
    regions: z
      .array(z.string().min(1))
      .default([])
      .describe('ISO region strings; note EU-only flags'),
    compliance: z.array(complianceEntrySchema).default([]),
    pricing: pricingSchema,
    sovereignty: sovereigntySchema,
    notes: maxWords(60, 'notes')
      .optional()
      .describe('Analyst note; no adjectives without evidence'),
    affiliate_url: evidenceUrl
      .optional()
      .describe('Renders only once /disclosure/ exists'),
    featured: z.boolean().default(false),
  })
  .strict();
