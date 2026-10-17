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
    }).success,
  );
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
