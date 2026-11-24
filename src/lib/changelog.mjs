// Loads and validates data/changelog.yaml at build time. Both /changelog/
// and the homepage stat strip render from this, so a malformed entry fails
// the build rather than shipping silently.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { changelogSchema } from '../schemas/changelog.mjs';

// Resolved from the working directory, not import.meta.url: Astro 7 bundles
// pages into dist/.prerender/, which moves import.meta.url away from src/lib/.
// npm scripts (build, test, validate) always run from the project root.
const file = join(process.cwd(), 'data/changelog.yaml');

export function loadChangelog() {
  return changelogSchema.parse(parse(readFileSync(file, 'utf8')));
}
