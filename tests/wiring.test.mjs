// Smoke tests: the toolchain itself is wired. Schema behaviour tests arrive
// with schema v2 (piece 1) and live next to what they cover.

import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

test('package scripts expose the WoW gate commands', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  for (const script of ['build', 'test', 'lint', 'typecheck']) {
    assert.ok(pkg.scripts[script], `missing npm script: ${script}`);
  }
});

test('vendor collection is non-empty YAML', () => {
  const files = readdirSync('src/content/vendors').filter((f) =>
    f.endsWith('.yaml'),
  );
  assert.ok(
    files.length >= 4,
    `expected >= 4 vendor files, got ${files.length}`,
  );
});
