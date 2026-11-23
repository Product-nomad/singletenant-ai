// The residency-vs-sovereignty article states its counts from the vendor data at build time, so they can't go stale.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { residencySummary } from '../src/lib/residency.mjs';

const v = (slug, residency, parent, regions = [], sovereign_for = []) => ({
  slug,
  regions,
  sovereign_for,
  sovereignty: {
    data_residency_guarantee: residency,
    parent_jurisdiction: parent,
  },
});

test('residencySummary counts residency levels, foreign parents and UK/EU sovereignty', () => {
  const s = residencySummary([
    v('a', 'contractual', 'US', ['GB', 'EU']),
    v('b', 'contractual', 'FR', ['EU'], ['EU']),
    v('c', 'stated', 'GB', ['GB'], ['GB']),
    v('d', 'unknown', 'US', []),
    v('e', 'contractual', 'US', ['US']),
  ]);
  assert.deepEqual(s, {
    total: 5,
    contractual: 3,
    contractualUsParent: 2,
    stated: 1,
    unknown: 1,
    usParent: 3,
    gbRegion: 2,
    sovereignFor: { GB: ['c'], EU: ['b'] },
  });
});
