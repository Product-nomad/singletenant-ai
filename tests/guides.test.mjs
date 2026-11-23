// Guide and glossary schemas (reposition 2026-10): stubs need nothing, a
// published guide needs its dates, a published term needs a definition.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { parse } from 'yaml';
import { glossaryTermSchema, guideSchema } from '../src/schemas/guide.mjs';

const stub = {
  title: 'T',
  description: 'D',
  audience: 'A',
  status: 'stub',
};

test('a stub guide validates without dates', () => {
  assert.ok(guideSchema.safeParse(stub).success);
});

test('a published guide needs pub_date and last_verified', () => {
  const res = guideSchema.safeParse({ ...stub, status: 'published' });
  assert.equal(res.success, false);
  assert.ok(
    guideSchema.safeParse({
      ...stub,
      status: 'published',
      pub_date: '2026-11-01',
      last_verified: '2026-11-01',
      sources: [{ url: 'https://example.com', verified: '2026-11-01' }],
    }).success,
  );
});

test('a published guide needs sources, dated no later than last_verified', () => {
  const published = {
    ...stub,
    status: 'published',
    pub_date: '2026-11-01',
    last_verified: '2026-11-01',
  };
  assert.equal(guideSchema.safeParse(published).success, false, 'no sources');
  assert.equal(
    guideSchema.safeParse({
      ...published,
      sources: [{ url: 'https://example.com', verified: '2026-10-01' }],
    }).success,
    false,
    'last_verified newer than the oldest source',
  );
});

// Published guides: every source is cited in the text, every listed vendor
// exists and is linked, so the profile's back-link is honest.
const vendorSlugs = new Set(
  readdirSync('src/content/vendors').map((f) => f.replace(/\.yaml$/, '')),
);
test('published guides cite their sources and link their vendors', () => {
  for (const f of readdirSync('src/content/guides')) {
    const m = readFileSync(`src/content/guides/${f}`, 'utf8').match(
      /^---\n([\s\S]*?)\n---\n([\s\S]*)$/,
    );
    const data = parse(m[1]);
    if (data.status !== 'published') continue;
    for (const src of data.sources) {
      assert.ok(m[2].includes(src.url), `${f} cites ${src.url}`);
    }
    for (const v of data.vendors ?? []) {
      assert.ok(vendorSlugs.has(v), `${f}: unknown vendor ${v}`);
      assert.ok(m[2].includes(`/vendors/${v}/`), `${f} links ${v}`);
    }
  }
});

test('a published glossary term needs a definition', () => {
  const term = { id: 'ptu', term: 'PTU', status: 'published' };
  assert.equal(glossaryTermSchema.safeParse(term).success, false);
  assert.ok(
    glossaryTermSchema.safeParse({ ...term, definition: 'A unit.' }).success,
  );
});

test('repo guides and glossary validate', () => {
  for (const f of readdirSync('src/content/guides')) {
    const fm = readFileSync(`src/content/guides/${f}`, 'utf8').match(
      /^---\n([\s\S]*?)\n---/,
    );
    assert.ok(guideSchema.safeParse(parse(fm[1])).success, f);
  }
  for (const t of parse(readFileSync('src/content/glossary.yaml', 'utf8'))) {
    assert.ok(glossaryTermSchema.safeParse(t).success, t.id);
  }
});

// Compare and vendor pages link the published guides that cover their vendors,
// so a guide collects the internal links for its topic instead of competing
// with a dozen compare pages for it.
import { guidesCovering } from '../src/lib/guides.mjs';

const g = (id, vendors, status = 'published', order = 0) => ({
  id,
  data: { vendors, status, order },
});

test('guidesCovering returns published guides for any of the vendors, in guide order', () => {
  const all = [
    g('bedrock', ['aws-bedrock-provisioned'], 'published', 20),
    g('ptu', ['azure-openai-ptu'], 'published', 10),
    g('both', ['azure-openai-ptu', 'aws-bedrock-provisioned'], 'published', 30),
    g('draft', ['aws-bedrock-provisioned'], 'stub', 5),
  ];
  assert.deepEqual(
    guidesCovering(all, ['aws-bedrock-provisioned', 'modal']).map((x) => x.id),
    ['bedrock', 'both'],
  );
  assert.deepEqual(guidesCovering(all, ['modal']), []);
});
