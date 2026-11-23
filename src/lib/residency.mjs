// Counts behind the residency-vs-sovereignty article, computed from the vendor data at build time.

/**
 * @param {{ slug: string, regions: string[], sovereign_for?: string[],
 *   sovereignty: { data_residency_guarantee: string, parent_jurisdiction: string } }[]} vendors
 */
export const residencySummary = (vendors) => {
  const level = (l) =>
    vendors.filter((v) => v.sovereignty.data_residency_guarantee === l);
  const sovereignFor = (code) =>
    vendors
      .filter((v) => (v.sovereign_for ?? []).includes(code))
      .map((v) => v.slug);
  return {
    total: vendors.length,
    contractual: level('contractual').length,
    contractualUsParent: level('contractual').filter(
      (v) => v.sovereignty.parent_jurisdiction === 'US',
    ).length,
    stated: level('stated').length,
    unknown: level('unknown').length,
    usParent: vendors.filter((v) => v.sovereignty.parent_jurisdiction === 'US')
      .length,
    gbRegion: vendors.filter((v) => v.regions.includes('GB')).length,
    sovereignFor: { GB: sovereignFor('GB'), EU: sovereignFor('EU') },
  };
};
