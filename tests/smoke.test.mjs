// Post-deploy smoke checks: each live page must answer 200, carry parseable
// JSON-LD of the expected types and, for matrix pages, render every vendor row.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { pageProblems } from '../src/lib/smoke.mjs';

const ld = (o) =>
  `<script type="application/ld+json">${JSON.stringify(o)}</script>`;
const page = (rows, ...blocks) =>
  `<html><body>${'<tr data-matrix-row>'.repeat(rows)}${blocks.join('')}</body></html>`;

test('a healthy matrix page passes', () => {
  const html = page(
    16,
    ld({ '@graph': [{ '@type': 'Dataset' }, { '@type': 'ItemList' }] }),
  );
  assert.deepEqual(
    pageProblems(200, html, { types: ['Dataset'], matrixRows: 16 }),
    [],
  );
});

test('a non-200 status is a problem', () => {
  assert.deepEqual(pageProblems(404, '', {}), ['status 404']);
});

test('missing matrix rows are reported', () => {
  const html = page(3, ld({ '@type': 'Dataset' }));
  assert.deepEqual(
    pageProblems(200, html, { types: ['Dataset'], matrixRows: 16 }),
    ['matrix rows 3, expected 16'],
  );
});

test('broken or missing JSON-LD is reported', () => {
  const bad = '<script type="application/ld+json">{nope</script>';
  assert.deepEqual(pageProblems(200, page(0, bad), { types: ['Article'] }), [
    'unparseable JSON-LD block',
    'no JSON-LD of type Article',
  ]);
});

test('types are found inside @graph and arrays', () => {
  const html = page(0, ld([{ '@type': ['SoftwareApplication'] }]));
  assert.deepEqual(
    pageProblems(200, html, { types: ['SoftwareApplication'] }),
    [],
  );
});
