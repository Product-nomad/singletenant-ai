// JSON-LD builders for the vendor, compare, and article templates
// (src/lib/schema.mjs). These guard the integrity rule in code: the structured
// data must assert only facts the pages render, never a rating, review, or
// price the site does not stand behind.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  articleSchema,
  breadcrumbSchema,
  latestVerified,
  ORGANIZATION_ID,
  softwareApplication,
  vendorComparisonSchema,
  vendorDirectorySchema,
  vendorProfileSchema,
  websiteSchema,
} from '../src/lib/schema.mjs';

const vendor = (over = {}) => ({
  data: {
    slug: 'acme',
    name: 'Acme',
    url: 'https://acme.example',
    category: 'dedicated-gpu',
    tagline: 'Single-tenant GPU nodes',
    compliance: [
      { cert: 'SOC2_TYPE2', verified: '2026-07-05' },
      { cert: 'GDPR_DPA', verified: '2026-07-09' },
    ],
    pricing: { model: 'Per GPU-hour', public: true, verified: '2026-07-07' },
    sovereignty: {
      data_residency_guarantee: 'unknown',
      parent_jurisdiction: 'US',
      verified: '2026-07-06',
    },
    ...over,
  },
});

// The integrity guard: no key anywhere in a graph asserts a rating, review, or
// price. Applied to every builder's output.
const FORBIDDEN = [
  'aggregateRating',
  'ratingValue',
  'review',
  'reviewRating',
  'offers',
  'price',
  'priceCurrency',
];
const assertNoForbiddenKeys = (node) => {
  const walk = (v) => {
    if (Array.isArray(v)) {
      for (const x of v) walk(x);
    } else if (v && typeof v === 'object') {
      for (const [k, val] of Object.entries(v)) {
        assert.ok(!FORBIDDEN.includes(k), `forbidden key present: ${k}`);
        walk(val);
      }
    }
  };
  walk(node);
};

test('latestVerified returns the newest date across all fact blocks', () => {
  assert.equal(latestVerified(vendor().data), '2026-07-09');
});

test('latestVerified is undefined when nothing is verified', () => {
  const bare = {
    compliance: [],
    pricing: { model: 'unknown', public: 'unknown' },
    sovereignty: {
      data_residency_guarantee: 'unknown',
      parent_jurisdiction: 'unknown',
    },
  };
  assert.equal(latestVerified(bare), undefined);
});

test('softwareApplication carries provider and dateModified, no price', () => {
  const app = softwareApplication(vendor().data);
  assert.equal(app['@type'], 'SoftwareApplication');
  assert.equal(app.provider['@type'], 'Organization');
  assert.equal(app.provider.url, 'https://acme.example');
  assert.equal(app.dateModified, '2026-07-09');
  assertNoForbiddenKeys(app);
});

test('softwareApplication omits dateModified when unverified', () => {
  const app = softwareApplication(
    vendor({
      compliance: [],
      pricing: { model: 'unknown', public: 'unknown' },
      sovereignty: {
        data_residency_guarantee: 'unknown',
        parent_jurisdiction: 'unknown',
      },
    }).data,
  );
  assert.ok(!('dateModified' in app));
});

test('vendorProfileSchema is a graph of SoftwareApplication + BreadcrumbList', () => {
  const g = vendorProfileSchema(vendor().data);
  assert.equal(g['@context'], 'https://schema.org');
  const topTypes = g['@graph'].map((n) => n['@type']).sort();
  assert.deepEqual(topTypes, ['BreadcrumbList', 'SoftwareApplication']);
  assertNoForbiddenKeys(g);
});

test('breadcrumb positions are sequential and items are absolute URLs', () => {
  const g = vendorProfileSchema(vendor().data);
  const crumb = g['@graph'].find((n) => n['@type'] === 'BreadcrumbList');
  crumb.itemListElement.forEach((el, i) => {
    assert.equal(el.position, i + 1);
    assert.match(el.item, /^https:\/\/singletenant\.ai\//);
  });
  assert.equal(crumb.itemListElement.at(-1).name, 'Acme');
});

test('vendorDirectorySchema enumerates every vendor in an ItemList', () => {
  const vendors = [vendor(), vendor({ slug: 'beta', name: 'Beta' })];
  const g = vendorDirectorySchema({
    vendors,
    description: 'dir',
    dateModified: '2026-07-13',
  });
  const dataset = g['@graph'].find((n) => n['@type'] === 'Dataset');
  const list = g['@graph'].find((n) => n['@type'] === 'ItemList');
  assert.equal(dataset.dateModified, '2026-07-13');
  assert.equal(dataset.license, 'https://creativecommons.org/licenses/by/4.0/');
  assert.ok(Array.isArray(dataset.variableMeasured));
  assert.equal(list.numberOfItems, 2);
  assert.equal(list.itemListElement.length, 2);
  assert.equal(
    list.itemListElement[1].url,
    'https://singletenant.ai/vendors/beta/',
  );
  assertNoForbiddenKeys(g);
});

test('vendorDirectorySchema omits dateModified when none is passed', () => {
  const g = vendorDirectorySchema({ vendors: [vendor()], description: 'dir' });
  const dataset = g['@graph'].find((n) => n['@type'] === 'Dataset');
  assert.ok(!('dateModified' in dataset));
});

test('vendorComparisonSchema is a Dataset about both vendors, canonically ordered', () => {
  const a = vendor({ slug: 'zebra', name: 'Zebra' });
  const b = vendor({ slug: 'acme', name: 'Acme' });
  const g = vendorComparisonSchema({ a, b, description: 'compare' });
  const dataset = g['@graph'].find((n) => n['@type'] === 'Dataset');
  // URL is canonical (alphabetical by slug) regardless of argument order.
  assert.equal(dataset.url, 'https://singletenant.ai/compare/acme-vs-zebra/');
  assert.equal(dataset.license, 'https://creativecommons.org/licenses/by/4.0/');
  assert.equal(dataset.about.length, 2);
  assert.deepEqual(
    dataset.about.map((x) => x['@type']),
    ['SoftwareApplication', 'SoftwareApplication'],
  );
  assertNoForbiddenKeys(g);
});

const article = (over = {}) => ({
  title: 'Why an EU region is not EU sovereign',
  description: 'The jurisdiction problem, worked through.',
  author: 'Simon Newton',
  slug: 'jurisdiction-eu-region-not-sovereign',
  pubDate: new Date('2026-07-12T00:00:00Z'),
  ...over,
});

test('articleSchema carries headline, author, and ISO dates, no price', () => {
  const g = articleSchema(article());
  assert.equal(g['@context'], 'https://schema.org');
  const node = g['@graph'].find((n) => n['@type'] === 'Article');
  assert.equal(node.headline, 'Why an EU region is not EU sovereign');
  assert.equal(node.author['@type'], 'Person');
  assert.equal(node.author.name, 'Simon Newton');
  assert.equal(node.datePublished, '2026-07-12T00:00:00.000Z');
  assert.match(node['@id'], /\/blog\/[a-z-]+\/#article$/);
  assert.equal(node.publisher.name, 'singletenant.ai');
  assert.equal(node.publisher.url, 'https://singletenant.ai/');
  assertNoForbiddenKeys(g);
});

test('articleSchema dateModified falls back to publish date, or uses updated', () => {
  const unmodified = articleSchema(article());
  const a = unmodified['@graph'].find((n) => n['@type'] === 'Article');
  assert.equal(a.dateModified, a.datePublished);

  const modified = articleSchema(
    article({ updated: new Date('2026-07-13T00:00:00Z') }),
  );
  const m = modified['@graph'].find((n) => n['@type'] === 'Article');
  assert.equal(m.dateModified, '2026-07-13T00:00:00.000Z');
  assert.notEqual(m.dateModified, m.datePublished);
});

test('articleSchema breadcrumb is Home > Blog > title with absolute URLs', () => {
  const g = articleSchema(article());
  const crumb = g['@graph'].find((n) => n['@type'] === 'BreadcrumbList');
  assert.deepEqual(
    crumb.itemListElement.map((e) => e.name),
    ['Home', 'Blog', 'Why an EU region is not EU sovereign'],
  );
  crumb.itemListElement.forEach((el, i) => {
    assert.equal(el.position, i + 1);
    assert.match(el.item, /^https:\/\/singletenant\.ai\//);
  });
});

test('websiteSchema emits WebSite and Organization linked by @id', () => {
  const graph = websiteSchema({ description: 'd' });
  assertNoForbiddenKeys(graph);
  const [site, org] = graph['@graph'];
  assert.equal(site['@type'], 'WebSite');
  assert.equal(org['@type'], 'Organization');
  assert.equal(org['@id'], ORGANIZATION_ID);
  assert.deepEqual(site.publisher, { '@id': ORGANIZATION_ID });
});

test('breadcrumbSchema is a single BreadcrumbList with absolute URLs', () => {
  const graph = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Disclosure', path: '/disclosure/' },
  ]);
  const [crumbs] = graph['@graph'];
  assert.equal(crumbs['@type'], 'BreadcrumbList');
  assert.equal(
    crumbs.itemListElement[1].item,
    'https://singletenant.ai/disclosure/',
  );
});
