// JSON-LD builders shared by the vendor and compare page templates. Every node
// emits only facts the pages already render and the site stands behind (SPEC
// integrity rule, §5): identity, the dimensions the directory verifies,
// last-verified dates, and navigation. Deliberately no aggregateRating,
// review, or offers/price, none of which the pages assert.
import { comparePath } from './compare.mjs';
import { alternateNames } from './labels.mjs';

const SITE = 'https://singletenant.ai';

// Absolute URL for a site-relative path, so ItemList items and Dataset URLs
// are fully qualified (required by Google's structured-data guidance).
const abs = (path) => new URL(path, `${SITE}/`).toString();

// Publisher identity, asserted once and reused as creator/publisher. The
// stable @id lets every page's nodes refer to the one entity that the
// homepage and /about/ emit as a top-level node.
export const ORGANIZATION_ID = `${SITE}/#organization`;

export const organization = () => ({
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'singletenant.ai',
  url: `${SITE}/`,
  logo: `${SITE}/favicon.svg`,
});

// Breadcrumb-only graph for pages without a richer schema (policy pages,
// hubs). `items` are { name, path } from Home down to the current page.
export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@graph': [breadcrumbList(items)],
});

// Homepage: the WebSite plus the publisher Organization as top-level nodes.
export const websiteSchema = ({ description }) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      name: 'singletenant.ai',
      url: `${SITE}/`,
      description,
      publisher: { '@id': ORGANIZATION_ID },
    },
    organization(),
  ],
});

// The facts the directory verifies for every vendor. Drives Dataset
// variableMeasured so Dataset Search and AI engines see the schema columns.
export const MEASURED_VARIABLES = [
  'Deployment models',
  'Compliance certifications',
  'Pricing model',
  'Data residency guarantee',
  'Parent jurisdiction',
];

// Licence for the vendor dataset. Business decision (2026-07-13): the data may
// be reused with attribution, so the directory and comparison Datasets declare
// CC BY 4.0. Helps Dataset Search; only a fact because reuse-with-attribution
// was actually agreed.
export const DATA_LICENSE = 'https://creativecommons.org/licenses/by/4.0/';

// Latest verified date across a vendor's evidence-bearing fact blocks
// (compliance entries, pricing, sovereignty). ISO YYYY-MM-DD sorts lexically,
// so the string max is the newest. Returns undefined when nothing is verified,
// so callers can omit dateModified rather than emit a null.
export const latestVerified = (...datas) => {
  const dates = [];
  for (const d of datas) {
    for (const c of d.compliance ?? []) {
      if (c.verified) dates.push(c.verified);
    }
    if (d.pricing?.verified) dates.push(d.pricing.verified);
    if (d.sovereignty?.verified) dates.push(d.sovereignty.verified);
  }
  return dates.length > 0 ? dates.sort().at(-1) : undefined;
};

export const breadcrumbList = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: abs(it.path),
  })),
});

// A vendor's hosting service as a SoftwareApplication. `provider` is the
// vendor's own company/homepage; description is the factual tagline. Used
// standalone on the profile page and as `about` on comparison pages.
export const softwareApplication = (data) => {
  const node = {
    '@type': 'SoftwareApplication',
    '@id': `${abs(`/vendors/${data.slug}/`)}#software`,
    name: data.name,
    ...(alternateNames(data).length > 0 && {
      alternateName: alternateNames(data),
    }),
    url: data.url,
    description: data.tagline,
    applicationCategory: 'AI/ML Infrastructure',
    operatingSystem: 'Cloud',
    provider: {
      '@type': 'Organization',
      name: data.name,
      url: data.url,
    },
  };
  const modified = latestVerified(data);
  if (modified) node.dateModified = modified;
  return node;
};

// Vendor profile page: the product plus a Home > Vendors > {name} trail.
export const vendorProfileSchema = (data) => ({
  '@context': 'https://schema.org',
  '@graph': [
    softwareApplication(data),
    breadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Vendors', path: '/vendors/' },
      { name: data.name, path: `/vendors/${data.slug}/` },
    ]),
  ],
});

// Vendor directory page: the whole directory as a Dataset (for Dataset Search
// and AI citation) plus an ItemList enumerating every vendor, plus breadcrumbs.
// `dateModified` is the directory's last data change, passed in from the
// changelog so freshness stays sourced from real data.
export const vendorDirectorySchema = ({
  vendors,
  description,
  dateModified,
}) => {
  const dataset = {
    '@type': 'Dataset',
    '@id': `${abs('/vendors/')}#dataset`,
    name: 'Dedicated and single-tenant LLM hosting vendors',
    description,
    url: abs('/vendors/'),
    isAccessibleForFree: true,
    license: DATA_LICENSE,
    creator: organization(),
    publisher: organization(),
    keywords: [
      'single-tenant LLM hosting',
      'dedicated LLM hosting',
      'LLM compliance certifications',
      'data residency',
      'LLM inference infrastructure',
    ],
    variableMeasured: MEASURED_VARIABLES,
  };
  if (dateModified) dataset.dateModified = dateModified;

  const itemList = {
    '@type': 'ItemList',
    name: 'Dedicated and single-tenant LLM hosting vendors',
    numberOfItems: vendors.length,
    itemListElement: vendors.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: v.data.name,
      url: abs(`/vendors/${v.data.slug}/`),
    })),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      dataset,
      itemList,
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Vendors', path: '/vendors/' },
      ]),
    ],
  };
};

// Comparison page: the pairwise comparison as a Dataset whose `about` is the
// two SoftwareApplications, plus a Home > Vendors > {a} vs {b} trail.
export const vendorComparisonSchema = ({ a, b, description }) => {
  const path = comparePath(a.data.slug, b.data.slug);
  const dataset = {
    '@type': 'Dataset',
    '@id': `${abs(path)}#dataset`,
    name: `${a.data.name} vs ${b.data.name}: single-tenant LLM hosting comparison`,
    description,
    url: abs(path),
    isAccessibleForFree: true,
    license: DATA_LICENSE,
    creator: organization(),
    publisher: organization(),
    variableMeasured: MEASURED_VARIABLES,
    about: [softwareApplication(a.data), softwareApplication(b.data)],
  };
  const modified = latestVerified(a.data, b.data);
  if (modified) dataset.dateModified = modified;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      dataset,
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Vendors', path: '/vendors/' },
        {
          name: `${a.data.name} vs ${b.data.name}`,
          path: path,
        },
      ]),
    ],
  };
};

// Article page: the post as an Article (headline, author, publish/modified
// dates) plus a Home > {section} > {title} trail; section defaults to the blog
// and is /guides/ for buyer guides. Dates are ISO 8601; dateModified
// falls back to the publish date when the post has not been updated. publisher
// reuses the shared Organization, so articles carry the same url + logo the
// rest of the site emits.
export const articleSchema = ({
  title,
  description,
  author,
  pubDate,
  updated,
  slug,
  section = { name: 'Blog', path: '/blog/' },
}) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': `${abs(`${section.path}${slug}/`)}#article`,
      headline: title,
      description,
      datePublished: pubDate.toISOString(),
      dateModified: (updated ?? pubDate).toISOString(),
      author: {
        '@type': 'Person',
        name: author,
      },
      publisher: organization(),
    },
    breadcrumbList([
      { name: 'Home', path: '/' },
      section,
      { name: title, path: `${section.path}${slug}/` },
    ]),
  ],
});
