// Label coverage (SPEC v2.2, O3): every enum-like token that can reach a
// rendered table cell or prose must have a human label in src/lib/labels.mjs.
// This walks the real vendor YAML and fails the build the moment a future
// vendor introduces a deployment model, category, cert, or region that has no
// mapping, so a raw hyphenated schema token can never leak into the UI.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { parse } from 'yaml';
import {
  CATEGORY_LABELS,
  CERT_LABELS,
  DEPLOYMENT_LABELS,
  REGION_LABELS,
} from '../src/lib/labels.mjs';

const vendorsDir = 'src/content/vendors';
const vendors = readdirSync(vendorsDir)
  .filter((f) => f.endsWith('.yaml'))
  .map((f) => ({
    file: f,
    data: parse(readFileSync(join(vendorsDir, f), 'utf8')),
  }));

/**
 * Assert every value pulled from the data by `pick` exists as a key in `labels`.
 * @param {string} label
 * @param {Record<string, string>} labels
 * @param {(d: any) => string[]} pick
 */
const assertMapped = (label, labels, pick) => {
  test(`every ${label} value has a label mapping`, () => {
    const missing = new Set();
    for (const { data } of vendors) {
      for (const value of pick(data)) {
        if (!Object.hasOwn(labels, value)) missing.add(value);
      }
    }
    assert.deepEqual(
      [...missing],
      [],
      `unmapped ${label} token(s) in vendor YAML; add them to labels.mjs: ${[...missing].join(', ')}`,
    );
  });
};

assertMapped(
  'deployment model',
  DEPLOYMENT_LABELS,
  (d) => d.deployment_models ?? [],
);
assertMapped('category', CATEGORY_LABELS, (d) => [d.category]);
assertMapped('region', REGION_LABELS, (d) => d.regions ?? []);
assertMapped('compliance cert', CERT_LABELS, (d) =>
  (d.compliance ?? []).map((c) => c.cert),
);
