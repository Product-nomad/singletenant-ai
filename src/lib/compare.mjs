// Compare-page helpers: canonical pair routing and the data-derived
// differences summary (thin-page mitigation, SPEC §9): every sentence is
// computed from the two vendor YAML records. No invented prose.
import { CATEGORY_LABELS, CERT_LABELS, NOT_VERIFIED } from './labels.mjs';

// Canonical compare URL: the pair is ordered alphabetically by slug, so each
// unordered pair has exactly one page. The reverse ordering 301s to this
// (piece 11). Vendor slugs can never contain '-vs-' (schema-enforced), so
// the separator is unambiguous.
/**
 * @param {string} slugA
 * @param {string} slugB
 * @returns {string}
 */
export const comparePath = (slugA, slugB) => {
  const [first, second] = [slugA, slugB].sort();
  return `/compare/${first}-vs-${second}/`;
};

/** @param {string[]} items */
const listJoin = (items) =>
  items.length <= 1
    ? (items[0] ?? '')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

/**
 * Key-differences summary for a compare page. Returns labelled lines, each
 * derived from the two vendors' verified data; 'unknown' surfaces as
 * "not verified", never as a guess.
 * @param {any} a vendor data (schema v2)
 * @param {any} b vendor data (schema v2)
 * @returns {Array<{ topic: string, text: string }>}
 */
export const differencesSummary = (a, b) => {
  const lines = [];

  lines.push({
    topic: 'Category',
    text:
      a.category === b.category
        ? `Both are ${CATEGORY_LABELS[a.category]} offerings.`
        : `${a.name} is a ${CATEGORY_LABELS[a.category]} offering; ${b.name} is ${CATEGORY_LABELS[b.category]}.`,
  });

  const certsA = a.compliance.map((c) => c.cert);
  const certsB = b.compliance.map((c) => c.cert);
  const label = (cert) => CERT_LABELS[cert];
  const shared = certsA.filter((c) => certsB.includes(c)).map(label);
  const onlyA = certsA.filter((c) => !certsB.includes(c)).map(label);
  const onlyB = certsB.filter((c) => !certsA.includes(c)).map(label);
  const certParts = [];
  if (shared.length > 0) certParts.push(`Both document ${listJoin(shared)}.`);
  if (onlyA.length > 0)
    certParts.push(`Only ${a.name} documents ${listJoin(onlyA)}.`);
  if (onlyB.length > 0)
    certParts.push(`Only ${b.name} documents ${listJoin(onlyB)}.`);
  for (const [certs, vendor] of [
    [certsA, a],
    [certsB, b],
  ]) {
    if (certs.length === 0)
      certParts.push(`No certifications verified for ${vendor.name}.`);
  }
  lines.push({ topic: 'Compliance', text: certParts.join(' ') });

  // Residency is an evidence level (contractual | stated | unknown), the same
  // rule as /methodology/#evidence-levels.
  const residency = (v) => {
    const g = v.sovereignty.data_residency_guarantee;
    if (g === 'contractual')
      return `${v.name} commits to data residency in its contract terms`;
    if (g === 'stated')
      return `${v.name} states data residency on its own pages (not contractual)`;
    return `${v.name}'s data residency is not verified`;
  };
  const gA = a.sovereignty.data_residency_guarantee;
  const gB = b.sovereignty.data_residency_guarantee;
  lines.push({
    topic: 'Data residency',
    text:
      gA === gB && gA === 'contractual'
        ? 'Both commit to data residency in their contract terms.'
        : gA === gB && gA === 'stated'
          ? 'Both state data residency on their own pages; neither commits to it contractually.'
          : gA === gB && gA === 'unknown'
            ? 'Neither has verified data residency evidence.'
            : `${residency(a)}; ${residency(b)}.`,
  });

  const jur = (v) =>
    v.sovereignty.parent_jurisdiction === 'unknown'
      ? NOT_VERIFIED.toLowerCase()
      : v.sovereignty.parent_jurisdiction;
  lines.push({
    topic: 'Jurisdiction',
    text:
      jur(a) === jur(b) && jur(a) !== NOT_VERIFIED.toLowerCase()
        ? `Both parent companies are under ${jur(a)} jurisdiction.`
        : `Parent jurisdiction: ${a.name} ${jur(a)}, ${b.name} ${jur(b)}.`,
  });

  const pricing = (v) => {
    if (v.pricing.model === 'unknown')
      return `${v.name}'s pricing model is not verified`;
    const pub =
      v.pricing.public === true
        ? 'published pricing'
        : v.pricing.public === false
          ? 'no published pricing'
          : 'publication not verified';
    return `${v.name}: ${v.pricing.model} (${pub})`;
  };
  lines.push({ topic: 'Pricing', text: `${pricing(a)}. ${pricing(b)}.` });

  return lines;
};

// Indexability: how distinctive a compare page is. A pair page is only worth
// a search-index slot if the two vendors differ on verified dimensions a
// buyer cares about; same-category, same-jurisdiction pairs with mostly
// unverified gaps render near-identical pages (thin/duplicate content). Free
// text (pricing model wording, deployment-model tokens) is excluded: it always
// differs between vendors, so it carries no signal. Each dimension scores 0-1;
// the total is scaled to 0-100.
//   category      1 if the categories differ
//   jurisdiction  1 if both parents are known and differ
//   residency     1 if both guarantees are known and differ; 0.5 if one is
//                 verified and the other is not
//   compliance    Jaccard distance of the two cert sets (0 if either is empty)
//   regions       Jaccard distance of the region sets (0 if either is empty)
//   pricing       1 if both public-pricing flags are known and differ
export const PAIR_DIMENSIONS = [
  'category',
  'jurisdiction',
  'residency',
  'compliance',
  'regions',
  'pricing',
];

// Pairs scoring below this are rendered noindex,follow: still reachable from
// both vendor profiles and the /compare/ picker, but kept out of the index.
// Calibrated against the 16-vendor set in AUDIT.md (2026-10-17).
export const INDEX_MIN_SCORE = 40;

// Editorial overrides by canonical pair slug ('a-vs-b'), applied after the
// score. Use `index` once a low-scoring pair has pair-specific written content
// (AUDIT.md 2.3); `noindex` to drop a pair the score keeps.
export const INDEX_OVERRIDES = { index: [], noindex: [] };

const jaccardDistance = (x, y) => {
  if (x.length === 0 || y.length === 0) return 0;
  const sx = new Set(x);
  const sy = new Set(y);
  const union = new Set([...sx, ...sy]).size;
  const shared = [...sx].filter((v) => sy.has(v)).length;
  return 1 - shared / union;
};

const knownAndDiffer = (x, y) => x !== 'unknown' && y !== 'unknown' && x !== y;

/**
 * @param {any} a vendor data (schema v2)
 * @param {any} b vendor data (schema v2)
 * @returns {{ score: number, parts: Record<string, number> }}
 */
export const pairDistinctiveness = (a, b) => {
  const resA = a.sovereignty.data_residency_guarantee;
  const resB = b.sovereignty.data_residency_guarantee;
  const parts = {
    category: a.category === b.category ? 0 : 1,
    jurisdiction: knownAndDiffer(
      a.sovereignty.parent_jurisdiction,
      b.sovereignty.parent_jurisdiction,
    )
      ? 1
      : 0,
    residency: knownAndDiffer(resA, resB)
      ? 1
      : (resA === 'unknown') !== (resB === 'unknown')
        ? 0.5
        : 0,
    compliance: jaccardDistance(
      a.compliance.map((c) => c.cert),
      b.compliance.map((c) => c.cert),
    ),
    regions: jaccardDistance(a.regions, b.regions),
    pricing: knownAndDiffer(a.pricing.public, b.pricing.public) ? 1 : 0,
  };
  const total = Object.values(parts).reduce((sum, v) => sum + v, 0);
  return {
    score: Math.round((total / PAIR_DIMENSIONS.length) * 100),
    parts,
  };
};

/**
 * @param {any} a vendor data (schema v2)
 * @param {any} b vendor data (schema v2)
 * @param {{ index: string[], noindex: string[] }} [overrides]
 * @returns {boolean}
 */
export const pairIsIndexable = (a, b, overrides = INDEX_OVERRIDES) => {
  const key = comparePath(a.slug, b.slug).slice('/compare/'.length, -1);
  if (overrides.index.includes(key)) return true;
  if (overrides.noindex.includes(key)) return false;
  return pairDistinctiveness(a, b).score >= INDEX_MIN_SCORE;
};
