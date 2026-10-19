// Changelog invariants (SPEC piece 7): entries are typed, dated ISO,
// ordered newest-first, and every referenced vendor slug has a vendor file.
// Also validates the real data/changelog.yaml.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { parse } from 'yaml';
import { changelogSchema } from '../src/schemas/changelog.mjs';

const entry = (patch = {}) => ({
  date: '2026-07-08',
  type: 'added',
  vendors: ['example-vendor'],
  summary: 'Example vendor added.',
  ...patch,
});

test('a well-formed changelog validates', () => {
  assert.ok(
    changelogSchema.safeParse([entry(), entry({ date: '2026-07-07' })]).success,
  );
});

test('entry sources must be URLs', () => {
  assert.ok(
    changelogSchema.safeParse([
      entry({ sources: ['https://vendor.example/docs'] }),
    ]).success,
  );
  assert.equal(
    changelogSchema.safeParse([entry({ sources: ['not a url'] })]).success,
    false,
  );
});

test('an unknown change type is rejected', () => {
  const res = changelogSchema.safeParse([entry({ type: 'improved' })]);
  assert.equal(res.success, false);
});

test('entries out of newest-first order are rejected', () => {
  const res = changelogSchema.safeParse([
    entry({ date: '2026-07-07' }),
    entry({ date: '2026-07-08' }),
  ]);
  assert.equal(res.success, false);
});

test('a non-ISO date is rejected', () => {
  const res = changelogSchema.safeParse([entry({ date: '8 July 2026' })]);
  assert.equal(res.success, false);
});

test('data/changelog.yaml validates and references only real vendors', () => {
  const entries = changelogSchema.parse(
    parse(readFileSync('data/changelog.yaml', 'utf8')),
  );
  const slugs = new Set(
    readdirSync('src/content/vendors')
      .filter((f) => f.endsWith('.yaml'))
      .map((f) => f.replace(/\.yaml$/, '')),
  );
  for (const e of entries) {
    for (const slug of e.vendors) {
      assert.ok(slugs.has(slug), `changelog references unknown vendor ${slug}`);
    }
  }
});
