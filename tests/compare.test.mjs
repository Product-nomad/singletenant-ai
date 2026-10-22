// Compare helpers (piece 9): canonical pair routing and the data-derived
// differences summary that keeps 105 programmatic pages from being thin.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  comparePath,
  differencesSummary,
  INDEX_MIN_SCORE,
  pairDistinctiveness,
  pairIsIndexable,
} from '../src/lib/compare.mjs';

test('comparePath is canonical regardless of argument order', () => {
  assert.equal(comparePath('runpod', 'baseten'), '/compare/baseten-vs-runpod/');
  assert.equal(comparePath('baseten', 'runpod'), '/compare/baseten-vs-runpod/');
});

const vendor = (over = {}) => ({
  name: 'A',
  category: 'dedicated-gpu',
  compliance: [{ cert: 'SOC2_TYPE2' }, { cert: 'HIPAA_BAA' }],
  sovereignty: {
    data_residency_guarantee: 'unknown',
    parent_jurisdiction: 'US',
  },
  pricing: { model: 'Per GPU-hour', public: true },
  ...over,
});

test('summary covers category, compliance, residency, jurisdiction, pricing', () => {
  const lines = differencesSummary(
    vendor(),
    vendor({ name: 'B', category: 'managed-selfhost' }),
  );
  assert.deepEqual(
    lines.map((l) => l.topic),
    ['Category', 'Compliance', 'Data residency', 'Jurisdiction', 'Pricing'],
  );
});

test('shared and exclusive certs are attributed correctly', () => {
  const lines = differencesSummary(
    vendor(),
    vendor({ name: 'B', compliance: [{ cert: 'SOC2_TYPE2' }, { cert: 'C5' }] }),
  );
  const compliance = lines.find((l) => l.topic === 'Compliance').text;
  assert.match(compliance, /Both document SOC 2 Type II/);
  assert.match(compliance, /Only A documents HIPAA BAA/);
  assert.match(compliance, /Only B documents C5/);
});

test('unknowns render as not verified, never as a claim', () => {
  const lines = differencesSummary(
    vendor({
      sovereignty: {
        data_residency_guarantee: 'unknown',
        parent_jurisdiction: 'unknown',
      },
      pricing: { model: 'unknown', public: 'unknown' },
    }),
    vendor({ name: 'B' }),
  );
  const text = lines.map((l) => l.text).join(' ');
  assert.match(text, /not verified/);
  assert.doesNotMatch(text, /undefined|unknown/);
});

test('no summary line leaks empty or undefined text', () => {
  const lines = differencesSummary(
    vendor({ compliance: [] }),
    vendor({ name: 'B', compliance: [] }),
  );
  for (const line of lines) {
    assert.ok(line.text.length > 0, `${line.topic} is empty`);
    assert.doesNotMatch(line.text, /undefined/);
  }
});

// Indexability scoring (reposition 2026-10, AUDIT.md section 2).
test('pairDistinctiveness rewards verified differences only', () => {
  const same = pairDistinctiveness(
    { ...vendor(), slug: 'a', regions: ['US'] },
    { ...vendor({ name: 'B' }), slug: 'b', regions: ['US'] },
  );
  assert.equal(same.score, 0);

  const apart = pairDistinctiveness(
    {
      ...vendor({
        sovereignty: {
          data_residency_guarantee: 'contractual',
          parent_jurisdiction: 'US',
        },
        pricing: { model: 'x', public: false },
      }),
      slug: 'a',
      regions: ['US'],
    },
    {
      ...vendor({
        name: 'B',
        category: 'managed-selfhost',
        compliance: [{ cert: 'ISO27001' }],
        sovereignty: {
          data_residency_guarantee: 'stated',
          parent_jurisdiction: 'GB',
        },
      }),
      slug: 'b',
      regions: ['GB'],
    },
  );
  assert.equal(apart.score, 100);
});

test('unknown jurisdiction never counts as a difference', () => {
  const r = pairDistinctiveness(
    { ...vendor(), slug: 'a', regions: [] },
    {
      ...vendor({
        name: 'B',
        sovereignty: {
          data_residency_guarantee: 'unknown',
          parent_jurisdiction: 'unknown',
        },
      }),
      slug: 'b',
      regions: [],
    },
  );
  assert.equal(r.parts.jurisdiction, 0);
  assert.equal(r.parts.regions, 0);
});

test('jurisdiction scores once for a differing parent or sovereign_for', () => {
  const pair = (a, b) =>
    pairDistinctiveness(
      { ...vendor(a), slug: 'a', regions: [] },
      { ...vendor({ name: 'B', ...b }), slug: 'b', regions: [] },
    ).parts.jurisdiction;
  const parent = (j) => ({
    sovereignty: {
      data_residency_guarantee: 'unknown',
      parent_jurisdiction: j,
    },
  });
  // Same parent, same (empty) sovereign_for: no difference.
  assert.equal(pair({}, {}), 0);
  // Same parent, sovereign_for differs: counts.
  assert.equal(pair({ sovereign_for: ['US'] }, {}), 1);
  // Parent differs only: counts.
  assert.equal(pair({}, parent('GB')), 1);
  // Both differ: still counts once, not twice.
  assert.equal(pair({}, { ...parent('GB'), sovereign_for: ['GB'] }), 1);
  // Same sovereign_for in a different order is not a difference.
  assert.equal(
    pair({ sovereign_for: ['EU', 'GB'] }, { sovereign_for: ['GB', 'EU'] }),
    0,
  );
});

test('pairIsIndexable honours the threshold and overrides', () => {
  const a = { ...vendor(), slug: 'a', regions: ['US'] };
  const b = { ...vendor({ name: 'B' }), slug: 'b', regions: ['US'] };
  assert.ok(INDEX_MIN_SCORE > 0);
  assert.equal(pairIsIndexable(a, b, { index: [], noindex: [] }), false);
  assert.equal(pairIsIndexable(b, a, { index: ['a-vs-b'], noindex: [] }), true);
});
