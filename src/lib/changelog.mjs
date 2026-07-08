// Loads and validates data/changelog.yaml at build time. Both /changelog/
// and the homepage stat strip render from this, so a malformed entry fails
// the build rather than shipping silently.
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { changelogSchema } from '../schemas/changelog.mjs';

const file = new URL('../../data/changelog.yaml', import.meta.url);

export function loadChangelog() {
  return changelogSchema.parse(parse(readFileSync(file, 'utf8')));
}
