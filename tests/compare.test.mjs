// Compare helpers (piece 9): canonical pair routing and the data-derived
// differences summary that keeps 105 programmatic pages from being thin.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { comparePath, differencesSummary } from '../src/lib/compare.mjs';

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
    vendor({ name: 'B', category: 'eu-sovereign' }),
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
