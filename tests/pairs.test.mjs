// Written pair analysis and the index override list move together: a
// low-scoring compare page is only indexed once it has sourced, pair-specific
// content (AUDIT.md 2.3), and every analysis file belongs to an indexed pair.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { parse } from 'yaml';
import { comparePath, INDEX_OVERRIDES } from '../src/lib/compare.mjs';
import { pairSchema } from '../src/schemas/pair.mjs';

const dir = 'src/content/pairs';
const pairs = readdirSync(dir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const text = readFileSync(join(dir, f), 'utf8');
    const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    return { file: f, data: m ? parse(m[1]) : {}, body: m ? m[2] : '' };
  });
const vendorSlugs = new Set(
  readdirSync('src/content/vendors').map((f) => f.replace(/\.yaml$/, '')),
);

test('every index override has written analysis, and vice versa', () => {
  assert.deepEqual(
    pairs.map((p) => p.data.pair).sort(),
    [...INDEX_OVERRIDES.index].sort(),
  );
});

test('pair files validate, are canonical and name real vendors', () => {
  for (const { file, data } of pairs) {
    const res = pairSchema.safeParse(data);
    assert.ok(res.success, `${file}: ${JSON.stringify(res.error?.issues)}`);
    assert.equal(file, `${data.pair}.md`);
    const [a, b] = data.pair.split('-vs-');
    assert.ok(vendorSlugs.has(a) && vendorSlugs.has(b), data.pair);
    assert.equal(
      comparePath(a, b),
      `/compare/${data.pair}/`,
      'canonical order',
    );
  }
});

test('analysis links both vendor profiles and cites every listed source', () => {
  for (const { file, data, body } of pairs) {
    const [a, b] = data.pair.split('-vs-');
    assert.ok(body.includes(`/vendors/${a}/`), `${file} links ${a}`);
    assert.ok(body.includes(`/vendors/${b}/`), `${file} links ${b}`);
    for (const s of data.sources) {
      assert.ok(body.includes(s.url), `${file} cites ${s.url} in the text`);
    }
  }
});

test('pair schema rejects a stale last_verified', () => {
  const res = pairSchema.safeParse({
    pair: 'a-vs-b',
    last_verified: '2026-10-22',
    sources: [{ url: 'https://example.com', verified: '2026-10-01' }],
  });
  assert.equal(res.success, false);
});
