// /corrections/ lists every changelog entry of type "corrected", so the log
// and the changelog can never disagree.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadChangelog } from '../src/lib/changelog.mjs';
import { corrections } from '../src/lib/corrections.mjs';

const entries = [
  {
    date: '2026-11-20',
    type: 'updated',
    vendors: ['a'],
    summary: 'x',
    sources: [],
  },
  {
    date: '2026-11-19',
    type: 'corrected',
    vendors: ['a'],
    summary: 'y',
    sources: [],
  },
  {
    date: '2026-10-01',
    type: 'corrected',
    vendors: [],
    summary: 'z',
    sources: [],
  },
];

test('only corrected entries are listed, newest first', () => {
  assert.deepEqual(
    corrections(entries).map((e) => e.summary),
    ['y', 'z'],
  );
});

test('the real changelog yields every corrected entry', () => {
  const all = loadChangelog();
  const listed = corrections(all);
  assert.equal(listed.length, all.filter((e) => e.type === 'corrected').length);
  assert.ok(listed.length > 0);
});
