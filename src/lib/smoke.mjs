// Checks one fetched page for the post-deploy smoke test (scripts/smoke.mjs).
// Returns a list of problems; empty means the page is healthy.
const LD = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

const typesIn = (node, out = new Set()) => {
  if (Array.isArray(node)) {
    for (const n of node) typesIn(n, out);
  } else if (node && typeof node === 'object') {
    for (const t of [node['@type']].flat()) if (t) out.add(t);
    if (node['@graph']) typesIn(node['@graph'], out);
  }
  return out;
};

export function pageProblems(status, html, { types = [], matrixRows } = {}) {
  if (status !== 200) return [`status ${status}`];
  const problems = [];
  if (matrixRows !== undefined) {
    const rows = html.split('<tr data-matrix-row').length - 1;
    if (rows !== matrixRows)
      problems.push(`matrix rows ${rows}, expected ${matrixRows}`);
  }
  const found = new Set();
  for (const [, body] of html.matchAll(LD)) {
    try {
      typesIn(JSON.parse(body), found);
    } catch {
      problems.push('unparseable JSON-LD block');
    }
  }
  for (const t of types)
    if (!found.has(t)) problems.push(`no JSON-LD of type ${t}`);
  return problems;
}
