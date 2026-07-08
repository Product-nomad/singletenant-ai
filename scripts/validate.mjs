// npm run validate — schema check for every vendor YAML plus the public
// changelog, without a full Astro build (SPEC §5, piece 6a; changelog at
// piece 7). The Zod schemas in src/schemas/ are the single source of truth;
// this script only loads and applies them.
// Used as the merge gate for vendor research (pieces 6a–6k).
import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { parse } from 'yaml';
import { changelogSchema } from '../src/schemas/changelog.mjs';
import { vendorSchema } from '../src/schemas/vendor.mjs';

const dir = new URL('../src/content/vendors/', import.meta.url).pathname;
const files = readdirSync(dir).filter((f) => f.endsWith('.yaml'));
const slugs = new Set();

let failed = 0;
for (const file of files) {
  const raw = parse(readFileSync(join(dir, file), 'utf8'));
  const result = vendorSchema.safeParse(raw);
  if (result.success) {
    const slug = basename(file, '.yaml');
    if (result.data.slug !== slug) {
      failed++;
      console.error(`✗ ${file}: slug '${result.data.slug}' ≠ filename`);
      continue;
    }
    slugs.add(slug);
    console.log(`✓ ${file}`);
  } else {
    failed++;
    console.error(`✗ ${file}`);
    for (const issue of result.error.issues) {
      console.error(`    ${issue.path.join('.')}: ${issue.message}`);
    }
  }
}

console.log(`\n${files.length - failed}/${files.length} vendor files valid`);

// data/changelog.yaml — schema, newest-first order, and every referenced
// vendor slug must have a vendor file.
const changelogFile = new URL('../data/changelog.yaml', import.meta.url)
  .pathname;
const changelogResult = changelogSchema.safeParse(
  parse(readFileSync(changelogFile, 'utf8')),
);
if (changelogResult.success) {
  const unknown = changelogResult.data
    .flatMap((e) => e.vendors)
    .filter((slug) => !slugs.has(slug));
  if (unknown.length > 0) {
    failed++;
    console.error(
      `✗ changelog.yaml: unknown vendor slug(s): ${[...new Set(unknown)].join(', ')}`,
    );
  } else {
    console.log(`✓ changelog.yaml (${changelogResult.data.length} entries)`);
  }
} else {
  failed++;
  console.error('✗ changelog.yaml');
  for (const issue of changelogResult.error.issues) {
    console.error(`    ${issue.path.join('.')}: ${issue.message}`);
  }
}

if (failed > 0) process.exit(1);
