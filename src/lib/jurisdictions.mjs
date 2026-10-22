// Groups vendors and articles by jurisdiction for /jurisdictions/. A
// jurisdiction gets a section only when verified data puts something in it:
// a vendor parented there (or in a member state, for a bloc), a vendor
// sovereign for it, or an article written for it. Regions alone never create
// a section; they only list who has capacity in a jurisdiction that exists.
import {
  BLOCS,
  COUNTRIES,
  covers,
  jurisdictionName,
} from '../schemas/jurisdictions.mjs';

// A bloc region (EU) says nothing about which member state, so it counts
// toward the bloc only, never toward one of its countries.
const hasRegionIn = (code, v) => v.regions.some((r) => covers(code, r));

/**
 * @param {any[]} vendors vendor data (schema v2)
 * @template {{ data: { jurisdiction?: string[] } }} A
 * @param {A[]} articles
 */
export const groupByJurisdiction = (vendors, articles) => {
  const byName = (a, b) => a.name.localeCompare(b.name);
  return [...Object.keys(COUNTRIES), ...Object.keys(BLOCS)]
    .map((code) => {
      const parented = vendors
        .filter((v) => covers(code, v.sovereignty.parent_jurisdiction))
        .sort(byName);
      const sovereign = vendors
        .filter((v) => (v.sovereign_for ?? []).includes(code))
        .sort(byName);
      const writing = articles.filter((a) =>
        (a.data.jurisdiction ?? []).includes(code),
      );
      const capacity = vendors.filter((v) => hasRegionIn(code, v)).sort(byName);
      return {
        code,
        name: jurisdictionName(code),
        isBloc: Object.hasOwn(BLOCS, code),
        parented,
        sovereign,
        capacity,
        articles: writing,
      };
    })
    .filter(
      (g) => g.parented.length + g.sovereign.length + g.articles.length > 0,
    )
    .sort((a, b) => a.name.localeCompare(b.name));
};
