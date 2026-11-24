// The PR source check: a vendor field whose value changes must come with a
// source for that field that is new or newly re-dated, so an edit can never
// ride on an old check.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { unsourcedChanges } from '../src/lib/source-check.mjs';

const base = {
  slug: 'example',
  last_verified: '2026-10-17',
  regions: ['US'],
  notes: 'Old note.',
  pricing: { model: 'Per hour', public: true },
  sources: [
    { field: 'regions', url: 'https://example.com/r', verified: '2026-10-17' },
    { field: 'notes', url: 'https://example.com/n', verified: '2026-10-17' },
    { field: 'pricing', url: 'https://example.com/p', verified: '2026-10-17' },
  ],
};
const clone = (o) => structuredClone(o);

test('no changes, no findings', () => {
  assert.deepEqual(unsourcedChanges(base, clone(base)), []);
});

test('a changed field with its source re-dated passes', () => {
  const head = clone(base);
  head.notes = 'New note.';
  head.sources[1].verified = '2026-11-24';
  assert.deepEqual(unsourcedChanges(base, head), []);
});

test('a changed field whose source date did not move is reported', () => {
  const head = clone(base);
  head.notes = 'New note.';
  assert.deepEqual(unsourcedChanges(base, head), ['notes']);
});

test('a changed field with a newly added source passes', () => {
  const head = clone(base);
  head.regions = ['US', 'EU'];
  head.sources.push({
    field: 'regions',
    url: 'https://example.com/r2',
    verified: '2026-10-17',
  });
  assert.deepEqual(unsourcedChanges(base, head), []);
});

test('nested changes count against the parent field or its sub-keys', () => {
  const head = clone(base);
  head.pricing.model = 'Per second';
  assert.deepEqual(unsourcedChanges(base, head), ['pricing']);
  head.sources.push({
    field: 'pricing',
    url: 'https://example.com/p2',
    verified: '2026-11-24',
  });
  assert.deepEqual(unsourcedChanges(base, head), []);
});

test('compliance sources are keyed per cert', () => {
  const b = clone(base);
  b.compliance = [{ cert: 'ISO27001', level: 'stated' }];
  b.sources.push({
    field: 'compliance.ISO27001',
    url: 'https://example.com/c',
    verified: '2026-10-17',
  });
  const head = clone(b);
  head.compliance[0].level = 'contractual';
  assert.deepEqual(unsourcedChanges(b, head), ['compliance']);
  head.sources[3].verified = '2026-11-24';
  assert.deepEqual(unsourcedChanges(b, head), []);
});

test('bookkeeping fields are exempt', () => {
  const head = clone(base);
  head.last_verified = '2026-11-24';
  head.featured = true;
  assert.deepEqual(unsourcedChanges(base, head), []);
});

test('a new vendor needs no diff check (the schema covers it)', () => {
  assert.deepEqual(unsourcedChanges(null, clone(base)), []);
});
