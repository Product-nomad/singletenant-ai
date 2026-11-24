// npm run source-check -- <base-ref>
// For every vendor YAML changed since <base-ref> (default origin/main), fail if
// a field changed without a new or re-dated source for it. Used by CI on PRs.
import { execFileSync } from 'node:child_process';
import { parse } from 'yaml';
import { unsourcedChanges } from '../src/lib/source-check.mjs';

const baseRef = process.argv[2] || 'origin/main';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });

const changed = git(
  'diff',
  '--name-only',
  `${baseRef}...HEAD`,
  '--',
  'src/content/vendors/',
)
  .split('\n')
  .filter((p) => p.endsWith('.yaml'));

const show = (ref, path) => {
  try {
    return parse(git('show', `${ref}:${path}`));
  } catch {
    return null;
  }
};

let failed = 0;
for (const path of changed) {
  const head = show('HEAD', path);
  if (!head) continue; // vendor removed: covered by review, not by sourcing
  const base = show(git('merge-base', baseRef, 'HEAD').trim(), path);
  const findings = unsourcedChanges(base, head);
  if (findings.length) {
    failed++;
    console.error(
      `✗ ${path}: changed without a new or re-dated source: ${findings.join(', ')}`,
    );
  } else {
    console.log(`✓ ${path}`);
  }
}
console.log(`${changed.length} changed vendor file(s), ${failed} failing`);
process.exit(failed ? 1 : 0);
