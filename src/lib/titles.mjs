// Search titles and meta descriptions for vendor and compare pages, built
// from the vendor data. Titles aim for the ~60 characters a results page
// shows; descriptions lead with the biggest verified difference in a pair.
import { pairDistinctiveness } from './compare.mjs';
import { CERT_LABELS, jurisdictionName } from './labels.mjs';

export const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;
const BRAND = ' | singletenant.ai';

/** @param {{ name: string, short_name?: string }} d */
export const shortName = (d) => d.short_name ?? d.name;

// The first candidate that fits wins; the last is used even if it is long.
const firstFitting = (candidates) =>
  candidates.find((t) => t.length <= TITLE_LIMIT) ?? candidates.at(-1);

/** @param {any} a @param {any} b */
export const compareTitle = (a, b) => {
  const pair = `${shortName(a)} vs ${shortName(b)}`;
  return firstFitting([
    `${pair}: dedicated hosting, pricing & compliance compared`,
    `${pair}: pricing & compliance compared`,
    `${pair}: pricing & compliance`,
  ]);
};

// The deployment type, for vendors whose name does not already say it
// (hyperscaler products are named for their provisioned unit).
const TYPE_PHRASE = {
  'dedicated-gpu': 'dedicated GPU',
  'managed-selfhost': 'managed self-host',
};

/** @param {any} d */
export const vendorTitle = (d) => {
  const type = TYPE_PHRASE[d.category];
  return firstFitting([
    ...(type ? [`${shortName(d)}: ${type} pricing, regions & compliance`] : []),
    `${shortName(d)}: pricing, regions & compliance`,
  ]);
};

/** @param {string} title */
export const withBrand = (title) => ({
  title,
  brand: title.length + BRAND.length <= TITLE_LIMIT,
});

const listJoin = (xs) =>
  xs.length <= 1
    ? (xs[0] ?? '')
    : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`;
const certNames = (certs) =>
  listJoin(certs.slice(0, 3).map((c) => CERT_LABELS[c] ?? c));

// One sentence per kind of difference; only verified differences qualify,
// because pairDistinctiveness scores unknowns as 0.
const leads = (a, b, parts) => {
  const A = shortName(a);
  const B = shortName(b);
  const out = [];
  if (parts.jurisdiction > 0) {
    const pa = a.sovereignty.parent_jurisdiction;
    const pb = b.sovereignty.parent_jurisdiction;
    if (pa !== pb && pa !== 'unknown' && pb !== 'unknown') {
      out.push([
        parts.jurisdiction,
        `${A}'s parent is in the ${jurisdictionName(pa)}; ${B}'s is in the ${jurisdictionName(pb)}.`,
      ]);
    } else {
      const [who, codes] =
        (a.sovereign_for ?? []).length > 0
          ? [A, a.sovereign_for]
          : [B, b.sovereign_for];
      out.push([
        parts.jurisdiction,
        `Only ${who} is recorded as sovereign for ${listJoin(codes.map(jurisdictionName))}.`,
      ]);
    }
  }
  if (parts.pricing > 0) {
    const [pub, not] = a.pricing.public === true ? [A, B] : [B, A];
    out.push([
      parts.pricing,
      `${pub} publishes its prices; ${not} has no full public price list.`,
    ]);
  }
  if (parts.compliance > 0) {
    const ca = a.compliance.map((c) => c.cert);
    const cb = b.compliance.map((c) => c.cert);
    const onlyA = ca.filter((c) => !cb.includes(c));
    const onlyB = cb.filter((c) => !ca.includes(c));
    const bits = [
      onlyA.length > 0 && `only ${A} documents ${certNames(onlyA)}`,
      onlyB.length > 0 && `only ${B} documents ${certNames(onlyB)}`,
    ].filter(Boolean);
    const text = bits.join('; ');
    out.push([parts.compliance, `${text[0].toUpperCase()}${text.slice(1)}.`]);
  }
  // Highest score first; ties keep the order jurisdiction, pricing, compliance.
  return out.sort((x, y) => y[0] - x[0]).map(([, text]) => text);
};

/** @param {any} a @param {any} b */
export const compareDescription = (a, b) => {
  const { parts } = pairDistinctiveness(a, b);
  const [lead] = leads(a, b, parts);
  const tails = [
    ' Pricing, compliance, regions and residency compared, every fact sourced and dated.',
    ' Pricing, compliance and residency compared, with sources.',
    ' Compared with sources.',
  ];
  if (!lead) {
    return `${shortName(a)} vs ${shortName(b)}: pricing models, compliance, regions and data residency side by side, every fact sourced and dated.`;
  }
  for (const tail of tails) {
    if (lead.length + tail.length <= DESCRIPTION_LIMIT) return lead + tail;
  }
  return lead;
};
