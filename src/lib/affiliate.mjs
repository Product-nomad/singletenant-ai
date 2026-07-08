// Affiliate link guard — SPEC §5: a vendor's affiliate_url renders only if
// the /disclosure/ page exists in this build, and every render carries a
// visible disclosure notice on the same page (UK ASA CAP Code 2.4;
// US FTC 16 CFR Part 255). Plain ESM so the node --test suite exercises the
// same logic the templates use.
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const DISCLOSURE_PATH = '/disclosure/';

// Resolved from the working directory, not import.meta.url: Astro bundles
// this module during build, which moves import.meta.url away from src/lib/
// and would make the check silently fail closed. npm scripts (build, test)
// always run from the project root.
const disclosurePage = join(process.cwd(), 'src/pages/disclosure.astro');

export const disclosurePageExists = () => existsSync(disclosurePage);

// The single decision point for vendor outbound links. The affiliate URL is
// used only when the disclosure page is present, so deleting /disclosure/
// can never leave an unmarked affiliate link in the built output — the link
// silently falls back to the plain vendor URL.
/**
 * @param {{ url: string, affiliate_url?: string }} vendor
 * @param {boolean} [disclosureExists]
 * @returns {{ href: string, isAffiliate: boolean }}
 */
export const resolveVendorLink = (
  { url, affiliate_url },
  disclosureExists = disclosurePageExists(),
) => {
  if (affiliate_url && disclosureExists) {
    return { href: affiliate_url, isAffiliate: true };
  }
  return { href: url, isAffiliate: false };
};
