// npm run smoke -- [base-url]   (default https://singletenant.ai)
// Post-deploy smoke test: key pages answer 200, the matrix renders every vendor,
// and structured data parses with the expected types. Exit 1 on any problem;
// the autopilot wrapper reverts the merge when this fails.
import { readdirSync } from 'node:fs';
import { pageProblems } from '../src/lib/smoke.mjs';

const base = (process.argv[2] || 'https://singletenant.ai').replace(/\/$/, '');
const vendors = readdirSync(
  new URL('../src/content/vendors/', import.meta.url),
).filter((f) => f.endsWith('.yaml')).length;

const checks = [
  ['/', { types: ['WebSite'], matrixRows: vendors }],
  ['/vendors/', { types: ['Dataset', 'ItemList'], matrixRows: vendors }],
  ['/vendors/baseten/', { types: ['SoftwareApplication', 'BreadcrumbList'] }],
  ['/compare/baseten-vs-coreweave/', { types: ['Dataset', 'BreadcrumbList'] }],
  ['/blog/residency-vs-sovereignty/', { types: ['Article'] }],
  ['/methodology/', {}],
  ['/editorial-policy/', {}],
  ['/changelog/', {}],
  ['/robots.txt', {}],
  ['/sitemap-index.xml', {}],
];

let failed = 0;
for (const [path, expect] of checks) {
  let status = 0;
  let html = '';
  try {
    const res = await fetch(base + path, {
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    });
    status = res.status;
    html = await res.text();
  } catch (e) {
    status = `error ${e.name}`;
  }
  const problems = pageProblems(status, html, expect);
  if (problems.length) failed++;
  console.log(
    `${problems.length ? '✗' : '✓'} ${path}${problems.length ? `: ${problems.join('; ')}` : ''}`,
  );
}
console.log(
  `${checks.length - failed}/${checks.length} pages healthy on ${base}`,
);
process.exit(failed ? 1 : 0);
