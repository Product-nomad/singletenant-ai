// The jurisdiction map is extended by hand, so these tests catch a code used
// in the data (vendor YAML or article front matter) that was never added.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { parse } from 'yaml';
import {
  BLOCS,
  covers,
  isCountry,
  isJurisdiction,
  isRegionCode,
  jurisdictionName,
} from '../src/schemas/jurisdictions.mjs';

const vendorsDir = 'src/content/vendors';
const vendors = readdirSync(vendorsDir)
  .filter((f) => f.endsWith('.yaml'))
  .map((f) => parse(readFileSync(join(vendorsDir, f), 'utf8')));

const articlesDir = 'src/content/articles';
const articles = readdirSync(articlesDir)
  .filter((f) => /\.mdx?$/.test(f))
  .map((f) => {
    const m = readFileSync(join(articlesDir, f), 'utf8').match(
      /^---\n([\s\S]*?)\n---/,
    );
    return { file: f, data: m ? parse(m[1]) : {} };
  });

test('every vendor jurisdiction and region code is in the map', () => {
  const missing = new Set();
  for (const v of vendors) {
    const parent = v.sovereignty?.parent_jurisdiction;
    if (parent && parent !== 'unknown' && !isCountry(parent))
      missing.add(parent);
    for (const r of v.regions ?? []) if (!isRegionCode(r)) missing.add(r);
    for (const j of v.sovereign_for ?? []) {
      if (!isJurisdiction(j)) missing.add(j);
    }
  }
  assert.deepEqual(
    [...missing],
    [],
    'add these to src/schemas/jurisdictions.mjs',
  );
});

test('every article jurisdiction is in the map', () => {
  const missing = articles.flatMap(({ file, data }) =>
    (data.jurisdiction ?? [])
      .filter((j) => !isJurisdiction(j))
      .map((j) => `${file}: ${j}`),
  );
  assert.deepEqual(missing, []);
});

test('bloc members are mapped countries', () => {
  for (const [code, bloc] of Object.entries(BLOCS)) {
    for (const m of bloc.members)
      assert.ok(isCountry(m), `${code} member ${m}`);
  }
});

test('covers matches a country itself or a bloc containing it', () => {
  assert.ok(covers('GB', 'GB'));
  assert.ok(covers('EU', 'FR'));
  assert.equal(covers('EU', 'GB'), false);
  assert.equal(covers('GB', 'US'), false);
});

test('UK is not a code; GB is the United Kingdom', () => {
  assert.equal(isCountry('UK'), false);
  assert.equal(jurisdictionName('GB'), 'United Kingdom');
  assert.equal(jurisdictionName('EU'), 'EU/EEA');
});
