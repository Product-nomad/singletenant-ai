// npm run validate — schema check for every vendor YAML without a full
// Astro build (SPEC §5, piece 6a). The Zod schema in src/schemas/vendor.mjs
// is the single source of truth; this script only loads and applies it.
// Used as the merge gate for vendor research (pieces 6a–6k).
import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { parse } from 'yaml';
import { vendorSchema } from '../src/schemas/vendor.mjs';

const dir = new URL('../src/content/vendors/', import.meta.url).pathname;
const files = readdirSync(dir).filter((f) => f.endsWith('.yaml'));

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
if (failed > 0) process.exit(1);
