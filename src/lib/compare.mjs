// Compare-page helpers — canonical pair routing and the data-derived
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

  const residency = (v) => {
    const g = v.sovereignty.data_residency_guarantee;
    if (g === true) return `${v.name} has a verified residency guarantee`;
    if (g === false)
      return `${v.name} offers no residency guarantee (verified)`;
    return `${v.name}'s residency guarantee is not verified`;
  };
  const gA = a.sovereignty.data_residency_guarantee;
  const gB = b.sovereignty.data_residency_guarantee;
  lines.push({
    topic: 'Data residency',
    text:
      gA === gB && gA === true
        ? 'Both have a verified data residency guarantee.'
        : gA === gB && gA === 'unknown'
          ? 'Neither has a verified data residency guarantee.'
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
