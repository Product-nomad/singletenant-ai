// Jurisdiction vocabulary shared by parent_jurisdiction, sovereign_for,
// regions and article front matter. Extended by hand as vendors are added:
// a code used anywhere in the data but missing here fails the build (vendor
// schema + tests/jurisdictions.test.mjs).
//
// Countries use ISO 3166-1 alpha-2 codes (GB for the United Kingdom, not UK).
// Blocs are named groups; `members` lists only the countries in this map, so
// a bloc's membership grows with the map. Areas are region buckets that are
// not jurisdictions (no law attaches to them).

export const COUNTRIES = {
  FR: 'France',
  GB: 'United Kingdom',
  NL: 'Netherlands',
  US: 'United States',
};

// EU means the EU/EEA, the same scope as the former 'europe' region bucket.
export const BLOCS = {
  EU: { name: 'EU/EEA', members: ['FR', 'NL'] },
};

export const AREAS = {
  APAC: 'Asia-Pacific',
  GLOBAL: 'Global',
};

const has = (map, code) => Object.hasOwn(map, code);

/** @param {string} code */
export const isCountry = (code) => has(COUNTRIES, code);
/** @param {string} code a country or bloc: something law attaches to */
export const isJurisdiction = (code) => isCountry(code) || has(BLOCS, code);
/** @param {string} code anything a region list may hold */
export const isRegionCode = (code) => isJurisdiction(code) || has(AREAS, code);

/** @param {string} code */
export const jurisdictionName = (code) =>
  COUNTRIES[code] ?? BLOCS[code]?.name ?? AREAS[code] ?? code;

// True when `code` is `country` itself or a bloc that contains it.
/** @param {string} code @param {string} country */
export const covers = (code, country) =>
  code === country || (BLOCS[code]?.members.includes(country) ?? false);
