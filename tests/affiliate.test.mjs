// Affiliate disclosure guard (SPEC §5, piece 8): affiliate_url renders only
// if /disclosure/ exists. resolveVendorLink is the single decision point the
// templates use; these tests pin its behaviour in both worlds.

import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import {
  disclosurePageExists,
  resolveVendorLink,
} from '../src/lib/affiliate.mjs';

const vendor = {
  name: 'Example',
  url: 'https://vendor.example',
  affiliate_url: 'https://vendor.example/?ref=singletenant',
};

test('no affiliate_url → plain vendor URL regardless of disclosure', () => {
  const { affiliate_url: _drop, ...plain } = vendor;
  for (const disclosureExists of [true, false]) {
    const link = resolveVendorLink(plain, disclosureExists);
    assert.equal(link.href, vendor.url);
    assert.equal(link.isAffiliate, false);
  }
});

test('affiliate_url without /disclosure/ falls back to plain URL', () => {
  const link = resolveVendorLink(vendor, false);
  assert.equal(link.href, vendor.url);
  assert.equal(link.isAffiliate, false);
});

test('affiliate_url with /disclosure/ present renders as affiliate', () => {
  const link = resolveVendorLink(vendor, true);
  assert.equal(link.href, vendor.affiliate_url);
  assert.equal(link.isAffiliate, true);
});

test('disclosurePageExists reflects the actual page file', () => {
  const page = new URL('../src/pages/disclosure.astro', import.meta.url)
    .pathname;
  assert.equal(disclosurePageExists(), existsSync(page));
  // Piece 8 onwards the page must exist — the guard is live, not vacuous.
  assert.equal(disclosurePageExists(), true);
});
