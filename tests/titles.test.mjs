// Search titles and meta descriptions for vendor and compare pages
// (src/lib/titles.mjs). Built from data, kept near the ~60-character title
// limit, and led by a verified difference rather than boilerplate.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  compareDescription,
  compareTitle,
  shortName,
  TITLE_LIMIT,
  vendorTitle,
  withBrand,
} from '../src/lib/titles.mjs';

const v = (over = {}) => ({
  slug: 'a',
  name: 'Alpha',
  category: 'dedicated-gpu',
  compliance: [{ cert: 'SOC2_TYPE2' }],
  regions: [],
  sovereign_for: [],
  sovereignty: {
    data_residency_guarantee: 'unknown',
    parent_jurisdiction: 'US',
  },
  pricing: { model: 'Per GPU-hour', public: true },
  ...over,
});

test('shortName prefers short_name, else name', () => {
  assert.equal(shortName({ name: 'Long Name', short_name: 'LN' }), 'LN');
  assert.equal(shortName({ name: 'Plain' }), 'Plain');
});

test('compare title uses the full template when it fits', () => {
  assert.equal(
    compareTitle(v({ name: 'Ab' }), v({ name: 'Cd' })),
    'Ab vs Cd: dedicated hosting, pricing & compliance compared',
  );
});

test('compare title drops "dedicated hosting" first, then "compared"', () => {
  const t = compareTitle(
    v({ name: 'Hugging Face Endpoints' }),
    v({ name: 'NVIDIA NIM' }),
  );
  assert.equal(t, 'Hugging Face Endpoints vs NVIDIA NIM: pricing & compliance');
  assert.ok(t.length <= TITLE_LIMIT);
  const mid = compareTitle(v({ name: 'Fireworks AI' }), v({ name: 'Nebius' }));
  assert.equal(mid, 'Fireworks AI vs Nebius: pricing & compliance compared');
});

test('compare title keeps pricing even when names alone are long', () => {
  const t = compareTitle(
    v({ name: 'Azure OpenAI PTU' }),
    v({ name: 'Vertex AI Provisioned Throughput' }),
  );
  assert.equal(
    t,
    'Azure OpenAI PTU vs Vertex AI Provisioned Throughput: pricing & compliance',
  );
});

test('vendor title names the deployment type unless the name already does', () => {
  assert.equal(
    vendorTitle(v({ name: 'Baseten' })),
    'Baseten: dedicated GPU pricing, regions & compliance',
  );
  assert.equal(
    vendorTitle(
      v({ name: 'Azure OpenAI PTU', category: 'hyperscaler-dedicated' }),
    ),
    'Azure OpenAI PTU: pricing, regions & compliance',
  );
  const long = vendorTitle(
    v({ name: 'Hugging Face Endpoints', category: 'managed-selfhost' }),
  );
  assert.ok(long.length <= TITLE_LIMIT, long);
});

test('withBrand appends the site name only when it still fits', () => {
  assert.equal(withBrand('Short').brand, true);
  assert.equal(withBrand('x'.repeat(50)).brand, false);
});

test('compare description leads with a jurisdiction difference', () => {
  const d = compareDescription(
    v({ name: 'Fireworks AI' }),
    v({
      name: 'Nebius',
      sovereignty: {
        data_residency_guarantee: 'contractual',
        parent_jurisdiction: 'NL',
      },
    }),
  );
  assert.match(
    d,
    /^Fireworks AI's parent is in the United States; Nebius's is in the Netherlands\./,
  );
  assert.ok(d.length <= 160, `${d.length}`);
});

test('compare description leads with pricing when only pricing differs', () => {
  const d = compareDescription(
    v({ name: 'A', compliance: [{ cert: 'SOC2_TYPE2' }] }),
    v({ name: 'B', pricing: { model: 'x', public: false } }),
  );
  assert.match(d, /^A publishes its prices; B has no full public price list\./);
});

test('compare description leads with compliance when that is the difference', () => {
  const d = compareDescription(
    v({ name: 'A', compliance: [{ cert: 'SOC2_TYPE2' }, { cert: 'FEDRAMP' }] }),
    v({ name: 'B', compliance: [{ cert: 'SOC2_TYPE2' }, { cert: 'C5' }] }),
  );
  assert.match(d, /^Only A documents FedRAMP; only B documents C5\./);
});

test('compare description never leads with an unverified difference', () => {
  const d = compareDescription(
    v({ name: 'A' }),
    v({
      name: 'B',
      sovereignty: {
        data_residency_guarantee: 'unknown',
        parent_jurisdiction: 'unknown',
      },
      pricing: { model: 'unknown', public: 'unknown' },
    }),
  );
  assert.doesNotMatch(d, /parent is in|publishes its prices/);
  assert.ok(d.length <= 160);
});
