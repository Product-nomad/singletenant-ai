// Link check over the built site (dist/). Every internal href/src must resolve
// to a built file, a public/ asset, or a _redirects rule; fragment links must
// hit an id on the target page. With --external, every distinct outbound URL
// is also fetched (HEAD, falling back to GET) and anything other than a 2xx or
// 3xx is reported. Exit code 1 on any broken link, so it can gate a release.
//
// Run after a build: node scripts/linkcheck.mjs [--external]
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const SITE = 'https://singletenant.ai';
const external = process.argv.includes('--external');

if (!existsSync(dist)) {
  console.error('dist/ not found: run npm run build first');
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const pages = walk(dist).filter((p) => p.endsWith('.html'));
const redirects = new Set(
  existsSync(join(dist, '_redirects'))
    ? readFileSync(join(dist, '_redirects'), 'utf8')
        .split('\n')
        .map((l) => l.trim().split(/\s+/)[0])
        .filter((l) => l?.startsWith('/'))
    : [],
);

// Resolve a site path to the file Workers static assets would serve.
const resolvePath = (pathname) => {
  const clean = decodeURIComponent(pathname);
  const candidates = [
    join(dist, clean),
    join(dist, clean, 'index.html'),
    join(dist, `${clean}.html`),
  ];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
};

const idsCache = new Map();
const idsOf = (file) => {
  if (!idsCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    idsCache.set(
      file,
      new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])),
    );
  }
  return idsCache.get(file);
};

const broken = [];
const warnings = [];
const outbound = new Map();

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const pagePath = `/${relative(dist, page).replace(/index\.html$/, '')}`;
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const raw = m[1].replaceAll('&amp;', '&');
    if (/^(mailto:|tel:|data:|javascript:)/.test(raw)) continue;
    const url = new URL(raw, `${SITE}${pagePath}`);
    if (url.origin !== SITE) {
      if (!outbound.has(url.href)) outbound.set(url.href, pagePath);
      continue;
    }
    if (redirects.has(url.pathname)) continue;
    const target = resolvePath(url.pathname);
    if (!target) {
      broken.push(`${pagePath} -> ${url.pathname} (no such page)`);
      continue;
    }
    if (url.hash && target.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (id && !idsOf(target).has(id))
        broken.push(`${pagePath} -> ${url.pathname}${url.hash} (no such id)`);
    }
  }
}

console.log(
  `${pages.length} pages, ${outbound.size} distinct outbound URLs, internal broken: ${broken.length}`,
);

if (external) {
  const check = async (href) => {
    for (const method of ['HEAD', 'GET']) {
      try {
        const res = await fetch(href, {
          method,
          redirect: 'follow',
          signal: AbortSignal.timeout(15000),
          headers: { 'user-agent': 'singletenant.ai link check' },
        });
        if (res.ok) return null;
        // LinkedIn answers automated requests with a non-standard 999; that
        // is bot blocking, not a dead page, so it is reported as a warning.
        if (res.status === 999) {
          warnings.push(`${href} (HTTP 999, bot-blocked; check by hand)`);
          return null;
        }
        if (method === 'GET') return `HTTP ${res.status}`;
      } catch (err) {
        if (method === 'GET') return err.cause?.code ?? err.name;
      }
    }
    return null;
  };
  const hrefs = [...outbound.keys()];
  const queue = [...hrefs];
  const workers = Array.from({ length: 8 }, async () => {
    while (queue.length > 0) {
      const href = queue.shift();
      const problem = await check(href);
      if (problem) broken.push(`${outbound.get(href)} -> ${href} (${problem})`);
    }
  });
  await Promise.all(workers);
  console.log(`external checked: ${hrefs.length}`);
}

for (const line of warnings) console.warn(`! ${line}`);
for (const line of broken) console.error(`✗ ${line}`);
process.exit(broken.length > 0 ? 1 : 0);
