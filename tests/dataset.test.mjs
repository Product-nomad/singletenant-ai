// The open dataset (/data/): CSV and JSON built from the vendor YAML, so the
// downloads can never disagree with the site, and every fact keeps its
// evidence URL and verified date.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { parse } from 'yaml';
import {
  CSV_COLUMNS,
  csvCell,
  datasetRecords,
  toCsv,
} from '../src/lib/dataset.mjs';

const vendors = readdirSync('src/content/vendors')
  .filter((f) => f.endsWith('.yaml'))
  .map((f) => ({
    data: parse(readFileSync(`src/content/vendors/${f}`, 'utf8')),
  }));

test('one record per vendor, sorted by name', () => {
  const recs = datasetRecords(vendors);
  assert.equal(recs.length, vendors.length);
  const names = recs.map((r) => r.name);
  assert.deepEqual(
    names,
    [...names].sort((a, b) => a.localeCompare(b, 'en')),
  );
});

test('every populated fact keeps its evidence URL and verified date', () => {
  for (const r of datasetRecords(vendors)) {
    for (const c of r.compliance) {
      assert.match(c.evidence_url, /^https?:\/\//, `${r.slug} ${c.cert}`);
      assert.match(c.verified, /^\d{4}-\d{2}-\d{2}$/);
    }
    if (r.pricing.public !== 'unknown')
      assert.ok(r.pricing.evidence_url, r.slug);
    assert.match(r.last_verified, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(r.sources.length > 0);
    assert.equal(r.profile_url, `https://singletenant.ai/vendors/${r.slug}/`);
  }
});

test('CSV has a stable header and one row per vendor', () => {
  const csv = toCsv(datasetRecords(vendors));
  const lines = csv.trimEnd().split('\r\n');
  assert.equal(lines[0], CSV_COLUMNS.join(','));
  assert.equal(lines.length, vendors.length + 1);
});

test('CSV cells are quoted, and formula-like cells are neutralised', () => {
  assert.equal(csvCell('plain'), 'plain');
  assert.equal(csvCell('a, b'), '"a, b"');
  assert.equal(csvCell('say "hi"'), '"say ""hi"""');
  assert.equal(csvCell('line\nbreak'), '"line\nbreak"');
  assert.equal(csvCell('=HYPERLINK("x")'), `"'=HYPERLINK(""x"")"`);
  assert.equal(csvCell('+1'), "'+1");
  assert.equal(csvCell(['SOC2_TYPE2', 'ISO27001']), 'SOC2_TYPE2; ISO27001');
  assert.equal(csvCell(undefined), '');
});
