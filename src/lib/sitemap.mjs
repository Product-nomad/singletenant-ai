// Sitemap metadata, computed from the source data at config time (astro.config
// runs before content collections exist, so this reads the YAML/frontmatter
// directly, like scripts/gen-redirects.mjs).
//
// lastmod per URL:
//   vendor profile  newest of last_verified and every fact's verified date
//   compare pair    the same, across both vendors
//   article         updated, else pub_date
//   /, /vendors/, /changelog/   newest public changelog entry
// Pages with no data-backed date get no lastmod rather than a build timestamp.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { comparePath, pairIsIndexable } from './compare.mjs';
import { latestVerified } from './schema.mjs';

const SITE = 'https://singletenant.ai';

const yamlDir = (dir) =>
  readdirSync(dir)
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => parse(readFileSync(join(dir, f), 'utf8')));

// Frontmatter of every .md/.mdx file in a directory, keyed by file id.
const frontmatterDir = (dir) =>
  readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => {
      const m = readFileSync(join(dir, f), 'utf8').match(
        /^---\n([\s\S]*?)\n---/,
      );
      return { id: f.replace(/\.mdx?$/, ''), data: m ? parse(m[1]) : {} };
    });

const isoDay = (d) =>
  d instanceof Date ? d.toISOString().slice(0, 10) : String(d);

const newest = (...dates) => dates.filter(Boolean).sort().at(-1);

/**
 * Absolute URLs that render noindex and so must not be in the sitemap:
 * low-distinctiveness compare pairs (same rule as compare/[slug].astro), stub
 * guides, and the glossary while none of its terms is published.
 * @param {string} root project root
 * @returns {Set<string>}
 */
export const sitemapExclude = (root) => {
  const exclude = new Set();
  const vendors = yamlDir(join(root, 'src/content/vendors'));
  for (let i = 0; i < vendors.length; i++) {
    for (let j = i + 1; j < vendors.length; j++) {
      const [a, b] = [vendors[i], vendors[j]];
      if (!pairIsIndexable(a, b))
        exclude.add(`${SITE}${comparePath(a.slug, b.slug)}`);
    }
  }
  for (const { id, data } of frontmatterDir(join(root, 'src/content/guides'))) {
    if (data.status !== 'published') exclude.add(`${SITE}/guides/${id}/`);
  }
  const terms = parse(
    readFileSync(join(root, 'src/content/glossary.yaml'), 'utf8'),
  );
  if (!terms.some((t) => t.status === 'published')) {
    exclude.add(`${SITE}/glossary/`);
  }
  return exclude;
};

/**
 * @param {string} root project root
 * @returns {Map<string, string>} absolute URL -> YYYY-MM-DD
 */
export const sitemapLastmod = (root) => {
  const lastmod = new Map();
  const vendors = yamlDir(join(root, 'src/content/vendors')).sort((a, b) =>
    a.slug.localeCompare(b.slug),
  );
  const vendorDate = (v) => newest(v.last_verified, latestVerified(v));

  for (const v of vendors) {
    lastmod.set(`${SITE}/vendors/${v.slug}/`, vendorDate(v));
  }
  for (let i = 0; i < vendors.length; i++) {
    for (let j = i + 1; j < vendors.length; j++) {
      const [a, b] = [vendors[i], vendors[j]];
      lastmod.set(
        `${SITE}${comparePath(a.slug, b.slug)}`,
        newest(vendorDate(a), vendorDate(b)),
      );
    }
  }
  for (const { id, data } of frontmatterDir(join(root, 'src/content/guides'))) {
    if (data.status === 'published')
      lastmod.set(
        `${SITE}/guides/${id}/`,
        newest(isoDay(data.updated ?? data.pub_date), data.last_verified),
      );
  }
  for (const { id, data } of frontmatterDir(
    join(root, 'src/content/articles'),
  )) {
    if (data.draft) continue;
    lastmod.set(`${SITE}/blog/${id}/`, isoDay(data.updated ?? data.pub_date));
  }
  const [latestChange] = parse(
    readFileSync(join(root, 'data/changelog.yaml'), 'utf8'),
  );
  for (const path of ['/', '/vendors/', '/changelog/']) {
    lastmod.set(`${SITE}${path}`, latestChange.date);
  }
  return lastmod;
};
