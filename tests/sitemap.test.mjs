// Sitemap lastmod (reposition 2026-10): every vendor, compare and article URL
// gets a data-backed date, never a build timestamp.
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { test } from 'node:test';
import { sitemapLastmod } from '../src/lib/sitemap.mjs';

const lastmod = sitemapLastmod(process.cwd());
const vendorCount = readdirSync('src/content/vendors').filter((f) =>
  f.endsWith('.yaml'),
).length;

test('every vendor and compare URL has a lastmod', () => {
  const urls = [...lastmod.keys()];
  assert.equal(
    urls.filter((u) => /\/vendors\/[^/]+\/$/.test(u)).length,
    vendorCount,
  );
  assert.equal(
    urls.filter((u) => u.includes('/compare/')).length,
    (vendorCount * (vendorCount - 1)) / 2,
  );
});

test('lastmod values are ISO days', () => {
  for (const [url, date] of lastmod) {
    assert.match(date, /^\d{4}-\d{2}-\d{2}$/, url);
  }
});
