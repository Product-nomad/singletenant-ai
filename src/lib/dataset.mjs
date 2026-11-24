// The open dataset behind /data/: one record per vendor, built from the same
// YAML the site renders, so the CSV and JSON downloads can't drift from the
// pages. Every fact keeps its evidence URL and verified date.
import { CREDIT_TEXT } from './authorship.mjs';

const SITE = 'https://singletenant.ai';
export const DATA_LICENSE_URL = 'https://creativecommons.org/licenses/by/4.0/';
export const ATTRIBUTION =
  'singletenant.ai vendor dataset (CC BY 4.0), https://singletenant.ai/data/';

export const datasetRecords = (vendors) =>
  vendors
    .map(({ data: v }) => ({
      slug: v.slug,
      name: v.name,
      ...(v.renamed && { renamed: v.renamed }),
      vendor_url: v.url,
      profile_url: `${SITE}/vendors/${v.slug}/`,
      category: v.category,
      deployment_models: v.deployment_models ?? [],
      regions: v.regions ?? [],
      parent_jurisdiction: v.sovereignty?.parent_jurisdiction ?? 'unknown',
      sovereign_for: v.sovereign_for ?? [],
      data_residency: {
        level: v.sovereignty?.data_residency_guarantee ?? 'unknown',
        evidence_url: v.sovereignty?.evidence_url ?? null,
        verified: v.sovereignty?.verified ?? null,
      },
      compliance: (v.compliance ?? []).map((c) => ({
        cert: c.cert,
        level: c.level,
        evidence_url: c.evidence_url,
        verified: c.verified,
      })),
      pricing: {
        model: v.pricing?.model ?? 'unknown',
        public: v.pricing?.public ?? 'unknown',
        evidence_url: v.pricing?.evidence_url ?? null,
        verified: v.pricing?.verified ?? null,
      },
      last_verified: v.last_verified,
      sources: v.sources ?? [],
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'));

export const datasetJson = (records, version) => ({
  name: 'Dedicated and single-tenant LLM hosting vendors',
  version,
  license: DATA_LICENSE_URL,
  attribution: ATTRIBUTION,
  credit: CREDIT_TEXT,
  documentation: `${SITE}/data/`,
  changelog: `${SITE}/changelog/`,
  notes:
    '"unknown" means the fact could not be confirmed from a primary source on the verified date; it is not a negative.',
  vendors: records,
});

export const CSV_COLUMNS = [
  'slug',
  'name',
  'category',
  'deployment_models',
  'regions',
  'parent_jurisdiction',
  'sovereign_for',
  'data_residency_level',
  'data_residency_evidence_url',
  'data_residency_verified',
  'compliance',
  'compliance_contractual',
  'pricing_model',
  'pricing_public',
  'pricing_evidence_url',
  'pricing_verified',
  'last_verified',
  'profile_url',
  'vendor_url',
];

// RFC 4180 quoting, plus a leading apostrophe on cells a spreadsheet would
// run as a formula (=, +, @, tab, CR), so opening the file is always safe.
export const csvCell = (value) => {
  if (value === undefined || value === null) return '';
  let s = Array.isArray(value) ? value.join('; ') : String(value);
  if (/^[=+@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
};

export const toCsv = (records) => {
  const rows = records.map((r) => [
    r.slug,
    r.name,
    r.category,
    r.deployment_models,
    r.regions,
    r.parent_jurisdiction,
    r.sovereign_for,
    r.data_residency.level,
    r.data_residency.evidence_url,
    r.data_residency.verified,
    r.compliance.map((c) => c.cert),
    r.compliance.filter((c) => c.level === 'contractual').map((c) => c.cert),
    r.pricing.model,
    r.pricing.public,
    r.pricing.evidence_url,
    r.pricing.verified,
    r.last_verified,
    r.profile_url,
    r.vendor_url,
  ]);
  return `${[CSV_COLUMNS, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')}\r\n`;
};
