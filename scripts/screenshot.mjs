#!/usr/bin/env node
// Screenshot a set of site URLs into an output dir (baseline + launch evidence).
// Usage: node scripts/screenshot.mjs <base-url> <out-dir>
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const [base, outDir] = process.argv.slice(2);
if (!base || !outDir) {
  console.error('usage: node scripts/screenshot.mjs <base-url> <out-dir>');
  process.exit(1);
}

const pages = [
  ['home', '/'],
  ['vendors', '/vendors/'],
  ['vendor-detail', '/vendors/baseten/'],
  ['compare-index', '/compare/'],
  ['compare-pair', '/compare/baseten-vs-modal/'],
  ['about', '/about/'],
];

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const [name, path] of pages) {
  const url = new URL(path, base).href;
  const res = await page.goto(url, { waitUntil: 'networkidle' });
  if (!res?.ok()) {
    console.warn(
      `skip ${name}: ${url} -> ${res ? res.status() : 'no response'}`,
    );
    continue;
  }
  await page.screenshot({ path: join(outDir, `${name}.png`), fullPage: true });
  console.log(`shot ${name}: ${url}`);
}
await browser.close();
