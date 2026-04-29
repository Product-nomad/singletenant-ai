import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* ─────────────────────────────────────────────────────────────
   Vendor collection — the core directory database.
   Each vendor is one YAML file in src/content/vendors/.
   ───────────────────────────────────────────────────────────── */

const deploymentOption = z.enum([
  'shared-api',
  'dedicated-endpoint',
  'single-tenant',
  'vpc',
  'self-hosted',
  'on-prem',
  'air-gapped',
]);

const complianceCert = z.enum([
  'SOC 2 Type I',
  'SOC 2 Type II',
  'ISO 27001',
  'ISO 27018',
  'HIPAA-eligible',
  'HIPAA BAA',
  'GDPR',
  'PCI DSS',
  'FedRAMP Moderate',
  'FedRAMP High',
  'IRAP',
  'Cyber Essentials',
  'Cyber Essentials Plus',
]);

const vendors = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/vendors' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    url: z.string().url(),
    tagline: z.string().describe('One-line positioning statement'),

    // Company facts
    founded: z.number().int().min(1990).max(2030).optional(),
    headquartered: z.string().optional(),
    funding_stage: z.string().optional(),
    employees: z.string().optional(),

    // Product capabilities — the heart of comparisons
    deployment_options: z.array(deploymentOption),
    hardware: z.array(z.string()).optional(),
    supported_models: z.array(z.string()).optional(),
    compliance: z.array(complianceCert).optional(),
    data_residency: z.array(z.string()).optional()
      .describe('Regions where data can be pinned'),

    // Commercial
    pricing_model: z.string().optional(),
    starts_from: z.string().optional()
      .describe('Headline price for entry tier'),
    minimum_commitment: z.string().optional(),

    // Editorial fields — the human take
    sweet_spot: z.string()
      .describe('When this vendor is the right answer'),
    weakness: z.string()
      .describe('Where it falls short'),
    description_short: z.string().max(280)
      .describe('Card-level summary, ~50 words'),
    description_long: z.string()
      .describe('Vendor page intro, ~200-400 words'),

    // Social proof
    notable_customers: z.array(z.string()).optional(),
    investors: z.array(z.string()).optional(),

    // Partnership
    referral_url: z.string().url().optional(),
    referral_terms: z.string().optional(),
    partnership_status: z.enum(['none', 'affiliate', 'lead-gen', 'sponsor']).default('none'),

    // Meta
    last_reviewed: z.string()
      .describe('YYYY-MM-DD — when we last verified this data'),
    featured: z.boolean().default(false),
  }),
});

/* ─────────────────────────────────────────────────────────────
   Articles collection — long-form content (MDX with body).
   ───────────────────────────────────────────────────────────── */

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(180)
      .describe('Meta description, used in search results and social cards'),
    pub_date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().default('Simon Wilson'),
    category: z.enum([
      'guide',
      'comparison',
      'analysis',
      'vertical',
      'news',
    ]),
    target_keyword: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { vendors, articles };
