// Schema v2 invariants (SPEC §5): evidence_url required wherever a fact is
// populated; 'unknown' permitted only without an evidence_url; dates ISO.
// Also validates every YAML in src/content/vendors/ against the real schema.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { parse } from 'yaml';
import { vendorSchema } from '../src/schemas/vendor.mjs';

const valid = {
  slug: 'example-vendor',
  name: 'Example Vendor',
  url: 'https://example.com',
  category: 'dedicated-gpu',
  tagline: 'Dedicated GPU inference for example workloads',
  deployment_models: ['dedicated-endpoint'],
  regions: ['us'],
  compliance: [
    {
      cert: 'SOC2_TYPE2',
      evidence_url: 'https://trust.example.com',
      verified: '2026-07-07',
    },
  ],
  pricing: {
    model: 'per-GPU-hour',
    public: true,
    evidence_url: 'https://example.com/pricing',
    verified: '2026-07-07',
  },
  sovereignty: {
    data_residency_guarantee: true,
    parent_jurisdiction: 'US',
    evidence_url: 'https://example.com/terms',
    verified: '2026-07-07',
  },
  notes: 'Example analyst note.',
};

const withPatch = (patch) => ({ ...structuredClone(valid), ...patch });

test('a fully-evidenced vendor validates', () => {
  assert.ok(vendorSchema.safeParse(valid).success);
});

test('uk is an accepted region bucket', () => {
  assert.ok(vendorSchema.safeParse(withPatch({ regions: ['uk'] })).success);
});

test('a region outside the bucket enum is rejected', () => {
  assert.equal(
    vendorSchema.safeParse(withPatch({ regions: ['emea'] })).success,
    false,
  );
});

test('populated pricing without evidence_url is rejected', () => {
  const res = vendorSchema.safeParse(
    withPatch({ pricing: { model: 'per-GPU-hour', public: true } }),
  );
  assert.equal(res.success, false);
});

test('populated pricing without verified date is rejected', () => {
  const res = vendorSchema.safeParse(
    withPatch({
      pricing: {
        model: 'per-GPU-hour',
        public: true,
        evidence_url: 'https://example.com/pricing',
      },
    }),
  );
  assert.equal(res.success, false);
});

test("fully 'unknown' pricing is permitted without evidence", () => {
  const res = vendorSchema.safeParse(
    withPatch({ pricing: { model: 'unknown' } }),
  );
  assert.ok(res.success);
});

test("'unknown' pricing carrying an evidence_url is rejected", () => {
  const res = vendorSchema.safeParse(
    withPatch({
      pricing: { model: 'unknown', evidence_url: 'https://example.com' },
    }),
  );
  assert.equal(res.success, false);
});

test("sovereignty: 'unknown' fields need no evidence, populated fields do", () => {
  assert.ok(
    vendorSchema.safeParse(withPatch({ sovereignty: {} })).success,
    'all-unknown sovereignty should pass',
  );
  assert.equal(
    vendorSchema.safeParse(
      withPatch({ sovereignty: { parent_jurisdiction: 'US' } }),
    ).success,
    false,
    'populated jurisdiction without evidence should fail',
  );
});

test('compliance entries require cert enum + evidence + ISO date', () => {
  for (const bad of [
    { cert: 'SOC2_TYPE2', verified: '2026-07-07' }, // no evidence_url
    { cert: 'SOC2_TYPE2', evidence_url: 'https://t.example.com' }, // no date
    {
      cert: 'MADE_UP_CERT',
      evidence_url: 'https://t.example.com',
      verified: '2026-07-07',
    },
    {
      cert: 'SOC2_TYPE2',
      evidence_url: 'https://t.example.com',
      verified: '07/07/2026', // not ISO
    },
  ]) {
    const res = vendorSchema.safeParse(withPatch({ compliance: [bad] }));
    assert.equal(res.success, false, JSON.stringify(bad));
  }
});

test('verified dates must be real ISO dates', () => {
  const res = vendorSchema.safeParse(
    withPatch({
      pricing: {
        model: 'per-GPU-hour',
        evidence_url: 'https://example.com/pricing',
        verified: '2026-13-45',
      },
    }),
  );
  assert.equal(res.success, false);
});

test("slug containing '-vs-' is rejected (compare-route footgun)", () => {
  const res = vendorSchema.safeParse(withPatch({ slug: 'acme-vs-hosting' }));
  assert.equal(res.success, false);
});

test('leftover v1 fields are rejected (strict schema)', () => {
  const res = vendorSchema.safeParse(withPatch({ sweet_spot: 'legacy field' }));
  assert.equal(res.success, false);
});

test('tagline over 12 words is rejected', () => {
  const res = vendorSchema.safeParse(
    withPatch({
      tagline:
        'one two three four five six seven eight nine ten eleven twelve thirteen',
    }),
  );
  assert.equal(res.success, false);
});

test('every vendor YAML in the repo validates against schema v2', () => {
  const dir = 'src/content/vendors';
  const files = readdirSync(dir).filter((f) => f.endsWith('.yaml'));
  assert.ok(
    files.length >= 4,
    `expected >= 4 vendor files, got ${files.length}`,
  );
  for (const file of files) {
    const data = parse(readFileSync(join(dir, file), 'utf8'));
    const res = vendorSchema.safeParse(data);
    assert.ok(
      res.success,
      `${file}: ${res.success ? '' : JSON.stringify(res.error.issues, null, 2)}`,
    );
  }
});
