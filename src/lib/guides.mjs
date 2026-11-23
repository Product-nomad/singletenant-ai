// Published guides that cover any of the given vendors, in guide order. Vendor and compare pages link them, so
// each guide collects the internal links for its topic.

/**
 * @template {{ id: string, data: { vendors: string[], status: string, order: number } }} G
 * @param {G[]} guides
 * @param {string[]} vendorSlugs
 * @returns {G[]}
 */
export const guidesCovering = (guides, vendorSlugs) =>
  guides
    .filter(
      (g) =>
        g.data.status === 'published' &&
        g.data.vendors.some((v) => vendorSlugs.includes(v)),
    )
    .sort((x, y) => x.data.order - y.data.order);
