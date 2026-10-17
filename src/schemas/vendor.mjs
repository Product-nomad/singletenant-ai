// Vendor schema v2: the single source of truth for vendor data validation
// (SPEC_singletenant_v2.md §5). Lives in plain ESM so both Astro's content
// config and the node --test suite import the same object.
//
// Integrity gate: every populated fact carries an evidence_url and a verified
// date; 'unknown' is the only value allowed without evidence. The UI renders
// 'unknown' as "Not verified", never as an unsourced claim.
import { z } from 'astro/zod';

export const CATEGORIES = [
  'dedicated-gpu',
  'hyperscaler-dedicated',
  'managed-selfhost',
  'eu-sovereign',
  'uk-sovereign',
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

// Region buckets: a small closed vocabulary of coarse geographies. 'europe'
// means the EU/EEA excluding the UK; 'uk' is tracked separately because a UK
// placement is a distinct jurisdiction question post-adequacy (see
// /methodology/ for the bucket definitions). Every value here must also have a
// display label in src/lib/labels.mjs (enforced by tests/labels.test.mjs).
export const REGIONS = ['us', 'uk', 'europe', 'apac', 'global'];

export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'verified must be YYYY-MM-DD')
  .refine((s) => !Number.isNaN(Date.parse(s)), 'verified must be a real date');

const evidenceUrl = z.string().url();

export const maxWords = (limit, label) =>
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

// Every fact block that carries its own evidence, flattened. Used by the
// profile-level invariants below and by callers that need per-fact dates.
export const factBlocks = (data) => [
  ...(data.compliance ?? []),
  data.pricing ?? {},
  data.sovereignty ?? {},
];

// Per-field provenance. Every claim-bearing field names the primary source(s)
// that support it and the date each was last checked, so a profile can show
// exactly which fields were confirmed when. Field keys:
//   category, tagline, deployment_models, regions, pricing, notes,
//   compliance.<CERT>, sovereignty.data_residency_guarantee,
//   sovereignty.parent_jurisdiction
export const SOURCE_FIELDS = [
  'category',
  'tagline',
  'deployment_models',
  'regions',
  'pricing',
  'notes',
  'sovereignty.data_residency_guarantee',
  'sovereignty.parent_jurisdiction',
  ...CERTS.map((c) => `compliance.${c}`),
];

export const sourceEntrySchema = z
  .object({
    field: z.enum(SOURCE_FIELDS),
    url: evidenceUrl,
    verified: isoDate,
  })
  .strict();

// The fields a vendor record actually claims something about. 'unknown' and
// empty values claim nothing, so they need no source.
export const claimedFields = (data) => {
  const fields = ['category', 'tagline'];
  if (data.deployment_models?.length) fields.push('deployment_models');
  if (data.regions?.length) fields.push('regions');
  if (data.notes) fields.push('notes');
  for (const c of data.compliance ?? []) fields.push(`compliance.${c.cert}`);
  const pricing = data.pricing ?? {};
  if (pricing.model !== 'unknown' || pricing.public !== 'unknown') {
    fields.push('pricing');
  }
  for (const key of ['data_residency_guarantee', 'parent_jurisdiction']) {
    if ((data.sovereignty ?? {})[key] !== 'unknown') {
      fields.push(`sovereignty.${key}`);
    }
  }
  return fields;
};

// The source fields a fact block's own evidence_url may be filed under.
const factFields = (data) => [
  ...(data.compliance ?? []).map((c) => [c, [`compliance.${c.cert}`]]),
  [data.pricing ?? {}, ['pricing']],
  [
    data.sovereignty ?? {},
    ['sovereignty.data_residency_guarantee', 'sovereignty.parent_jurisdiction'],
  ],
];

export const vendorSchema = z
  .object({
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be kebab-case')
      .refine(
        (s) => !s.includes('-vs-'),
        "slug must not contain '-vs-', it breaks /compare/[a]-vs-[b] routing",
      ),
    name: z.string().min(1),
    url: evidenceUrl.describe('Vendor homepage'),
    category: z.enum(CATEGORIES),
    tagline: maxWords(12, 'tagline').describe('Factual, no hype'),
    last_verified: isoDate.describe(
      'Oldest verified date across sources[]: the stalest confirmed field',
    ),
    sources: z
      .array(sourceEntrySchema)
      .min(1)
      .describe('Per-field primary sources, each with the date it was checked'),
    deployment_models: z.array(z.string().min(1)).default([]),
    regions: z
      .array(z.enum(REGIONS))
      .default([])
      .describe('Coarse region buckets; europe excludes the UK, which is uk'),
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
  .strict()
  .superRefine((val, ctx) => {
    const issue = (path, message) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path, message });

    const seen = new Set();
    for (const s of val.sources) {
      const key = `${s.field} ${s.url}`;
      if (seen.has(key)) issue(['sources'], `sources repeats ${key}`);
      seen.add(key);
    }

    // Every claim has a source, and no source points at a field the record
    // does not claim (catches a cert or region removed without its source).
    const claimed = claimedFields(val);
    const sourced = new Set(val.sources.map((s) => s.field));
    for (const f of claimed) {
      if (!sourced.has(f)) issue(['sources'], `no source for field ${f}`);
    }
    for (const f of sourced) {
      if (!claimed.includes(f)) {
        issue(['sources'], `source for ${f}, which the record does not claim`);
      }
    }

    // A fact's rendered evidence link must be one of its field's sources,
    // checked on the same date the fact shows.
    for (const [fact, fields] of factFields(val)) {
      if (!fact.evidence_url) continue;
      const match = val.sources.find(
        (s) => fields.includes(s.field) && s.url === fact.evidence_url,
      );
      if (!match) {
        issue(['sources'], `no ${fields[0]} source for ${fact.evidence_url}`);
      } else if (match.verified !== fact.verified) {
        issue(
          ['sources'],
          `${fact.evidence_url} is dated ${match.verified} in sources but ${fact.verified} on the fact`,
        );
      }
    }

    // Profile-level verification. last_verified is the headline "Last
    // verified" date on vendor and compare pages, so it is exactly the oldest
    // source date: one stale field holds the whole profile back.
    const oldest = val.sources.map((s) => s.verified).sort()[0];
    if (oldest && val.last_verified !== oldest) {
      issue(
        ['last_verified'],
        `last_verified ${val.last_verified} must equal the oldest source date ${oldest}`,
      );
    }
  });
