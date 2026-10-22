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
  last_verified: '2026-07-07',
  sources: [
    { field: 'category', url: 'https://example.com', verified: '2026-07-07' },
    { field: 'tagline', url: 'https://example.com', verified: '2026-07-07' },
    {
      field: 'deployment_models',
      url: 'https://example.com/docs',
      verified: '2026-07-07',
    },
    {
      field: 'regions',
      url: 'https://example.com/docs',
      verified: '2026-07-07',
    },
    {
      field: 'compliance.SOC2_TYPE2',
      url: 'https://trust.example.com',
      verified: '2026-07-07',
    },
    {
      field: 'pricing',
      url: 'https://example.com/pricing',
      verified: '2026-07-07',
    },
    {
      field: 'sovereignty.data_residency_guarantee',
      url: 'https://example.com/terms',
      verified: '2026-07-07',
    },
    {
      field: 'sovereignty.parent_jurisdiction',
      url: 'https://example.com/terms',
      verified: '2026-07-07',
    },
    { field: 'notes', url: 'https://example.com', verified: '2026-07-07' },
  ],
  deployment_models: ['dedicated-endpoint'],
  regions: ['US'],
  compliance: [
    {
      cert: 'SOC2_TYPE2',
      level: 'contractual',
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
    data_residency_guarantee: 'contractual',
    parent_jurisdiction: 'US',
    evidence_url: 'https://example.com/terms',
    verified: '2026-07-07',
  },
  notes: 'Example analyst note.',
};

const withPatch = (patch) => ({ ...structuredClone(valid), ...patch });

// Drop the sources for fields a patch turns 'unknown', as a real edit would.
const withoutSources = (...fields) =>
  valid.sources.filter((s) => !fields.includes(s.field));

test('a fully-evidenced vendor validates', () => {
  assert.ok(vendorSchema.safeParse(valid).success);
});

test('country, bloc and area region codes are accepted', () => {
  assert.ok(
    vendorSchema.safeParse(withPatch({ regions: ['GB', 'EU', 'APAC'] }))
      .success,
  );
});

test('a region code missing from the jurisdiction map is rejected', () => {
  for (const bad of ['uk', 'UK', 'europe', 'DE']) {
    assert.equal(
      vendorSchema.safeParse(withPatch({ regions: [bad] })).success,
      false,
      bad,
    );
  }
});

test('parent_jurisdiction must be a mapped ISO 3166 code', () => {
  const parent = (code) =>
    vendorSchema.safeParse(
      withPatch({
        sovereignty: { ...valid.sovereignty, parent_jurisdiction: code },
      }),
    ).success;
  assert.ok(parent('GB'));
  assert.equal(parent('UK'), false, 'UK is not ISO 3166-1; use GB');
  assert.equal(parent('EU'), false, 'a parent company is in a country');
  assert.equal(parent('ZZ'), false);
});

// A vendor sovereign for `code`, with the per-code source the record needs.
const sovereign = (code, patch = {}) =>
  vendorSchema.safeParse(
    withPatch({
      sovereign_for: [code],
      sources: [
        ...valid.sources,
        {
          field: `sovereign_for.${code}`,
          url: 'https://example.com/sovereign',
          verified: '2026-07-07',
        },
      ],
      ...patch,
    }),
  );

test('sovereign_for is accepted when parent, region and residency line up', () => {
  assert.ok(sovereign('US').success);
});

test('sovereign_for needs its own source', () => {
  assert.equal(
    vendorSchema.safeParse(withPatch({ sovereign_for: ['US'] })).success,
    false,
  );
});

test('sovereign_for is rejected when the parent is elsewhere', () => {
  assert.equal(sovereign('GB', { regions: ['GB'] }).success, false);
});

test('sovereign_for a bloc covers a member-state parent', () => {
  const res = sovereign('EU', {
    regions: ['EU'],
    sovereignty: { ...valid.sovereignty, parent_jurisdiction: 'FR' },
  });
  assert.ok(res.success, JSON.stringify(res.error?.issues));
});

test('sovereign_for is rejected without capacity or residency there', () => {
  assert.equal(sovereign('US', { regions: ['EU'] }).success, false);
  assert.equal(
    sovereign('US', {
      sovereignty: {
        parent_jurisdiction: 'US',
        data_residency_guarantee: 'unknown',
        evidence_url: valid.sovereignty.evidence_url,
        verified: valid.sovereignty.verified,
      },
      sources: [
        ...withoutSources('sovereignty.data_residency_guarantee'),
        {
          field: 'sovereign_for.US',
          url: 'https://example.com/sovereign',
          verified: '2026-07-07',
        },
      ],
    }).success,
    false,
  );
});

test('a region outside the jurisdiction map is rejected (legacy)', () => {
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
    withPatch({
      pricing: { model: 'unknown' },
      sources: withoutSources('pricing'),
    }),
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
    vendorSchema.safeParse(
      withPatch({
        sovereignty: {},
        sources: withoutSources(
          'sovereignty.data_residency_guarantee',
          'sovereignty.parent_jurisdiction',
        ),
      }),
    ).success,
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

test('last_verified must equal the oldest source date', () => {
  const later = vendorSchema.safeParse(
    withPatch({ last_verified: '2026-07-08' }),
  );
  assert.equal(later.success, false);
  assert.ok(later.error.issues.some((i) => i.path[0] === 'last_verified'));

  // One field still on an old date holds the headline date back.
  const v = structuredClone(valid);
  for (const s of v.sources) {
    if (s.field !== 'regions') s.verified = '2026-10-17';
  }
  v.compliance[0].verified = '2026-10-17';
  v.pricing.verified = '2026-10-17';
  v.sovereignty.verified = '2026-10-17';
  assert.ok(
    vendorSchema.safeParse({ ...v, last_verified: '2026-07-07' }).success,
  );
  assert.equal(
    vendorSchema.safeParse({ ...v, last_verified: '2026-10-17' }).success,
    false,
  );
});

test('every claimed field needs a source', () => {
  const res = vendorSchema.safeParse(
    withPatch({
      sources: valid.sources.filter((s) => s.field !== 'regions'),
    }),
  );
  assert.equal(res.success, false);
  assert.ok(
    res.error.issues.some((i) =>
      i.message.includes('no source for field regions'),
    ),
  );
});

test('a source for a field the record does not claim is rejected', () => {
  const res = vendorSchema.safeParse(withPatch({ regions: [] }));
  assert.equal(res.success, false);
  assert.ok(res.error.issues.some((i) => i.message.includes('does not claim')));
});

test("a fact's evidence_url must be one of its own field's sources", () => {
  const res = vendorSchema.safeParse(
    withPatch({
      pricing: { ...valid.pricing, evidence_url: 'https://example.com/terms' },
    }),
  );
  assert.equal(res.success, false);
  assert.ok(res.error.issues.some((i) => i.path[0] === 'sources'));
});

test('a fact and its source must carry the same verified date', () => {
  const res = vendorSchema.safeParse(
    withPatch({ pricing: { ...valid.pricing, verified: '2026-07-09' } }),
  );
  assert.equal(res.success, false);
  assert.ok(res.error.issues.some((i) => i.message.includes('is dated')));
});

test('sources must be non-empty, well-formed and unique per field', () => {
  assert.equal(
    vendorSchema.safeParse(withPatch({ sources: [] })).success,
    false,
  );
  assert.equal(
    vendorSchema.safeParse(
      withPatch({ sources: ['https://example.com/terms'] }),
    ).success,
    false,
  );
  const dup = [...valid.sources, { ...valid.sources[0] }];
  assert.equal(
    vendorSchema.safeParse(withPatch({ sources: dup })).success,
    false,
  );
});

test('certifications need an evidence level', () => {
  const noLevel = structuredClone(valid);
  delete noLevel.compliance[0].level;
  assert.equal(vendorSchema.safeParse(noLevel).success, false);
  const badLevel = structuredClone(valid);
  badLevel.compliance[0].level = 'aligned';
  assert.equal(vendorSchema.safeParse(badLevel).success, false);
});

test('residency is an evidence level, not a yes/no', () => {
  for (const level of ['contractual', 'stated']) {
    const v = structuredClone(valid);
    v.sovereignty.data_residency_guarantee = level;
    assert.ok(vendorSchema.safeParse(v).success, level);
  }
  for (const bad of [true, false, 'guaranteed']) {
    const v = structuredClone(valid);
    v.sovereignty.data_residency_guarantee = bad;
    assert.equal(vendorSchema.safeParse(v).success, false, String(bad));
  }
});

test('a renamed product needs a source for the rename', () => {
  const renamed = { from: 'Old Product', to: 'New Product' };
  assert.equal(vendorSchema.safeParse(withPatch({ renamed })).success, false);
  assert.ok(
    vendorSchema.safeParse(
      withPatch({
        renamed,
        sources: [
          ...valid.sources,
          {
            field: 'renamed',
            url: 'https://example.com/docs',
            verified: '2026-07-07',
          },
        ],
      }),
    ).success,
  );
});
