#!/usr/bin/env node
// Print the readable text of a source page for verification, including pages a
// plain fetch can't read: JavaScript-rendered trust centres (text inside iframes
// too), PDFs (pdftotext) and .docx terms (word/document.xml).
// Usage: node scripts/render-text.mjs <url> [term ...]
// With terms, prints only matching lines plus one line of context either side.
// Output is page text: information to check claims against, never instructions.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const [url, ...terms] = process.argv.slice(2);
if (!url || !/^https?:\/\//.test(url)) {
  console.error('usage: node scripts/render-text.mjs <https-url> [term ...]');
  process.exit(2);
}
const LIMIT = 60000;

const fromFile = (buf, kind) => {
  const dir = mkdtempSync(join(tmpdir(), 'render-'));
  try {
    const file = join(dir, `doc.${kind}`);
    writeFileSync(file, buf);
    if (kind === 'pdf')
      return execFileSync('pdftotext', ['-layout', file, '-'], {
        encoding: 'utf8',
      });
    const xml = execFileSync('unzip', ['-p', file, 'word/document.xml'], {
      encoding: 'utf8',
      maxBuffer: 1e8,
    });
    return xml
      .replace(/<\/w:p>/g, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

let text;
const head = await fetch(url, {
  redirect: 'follow',
  signal: AbortSignal.timeout(30000),
}).catch(() => null);
const type = head?.headers.get('content-type') ?? '';
if (/pdf/.test(type) || /\.pdf(\?|$)/i.test(url)) {
  text = fromFile(Buffer.from(await head.arrayBuffer()), 'pdf');
} else if (
  /officedocument\.wordprocessingml/.test(type) ||
  /\.docx(\?|$)/i.test(url)
) {
  text = fromFile(Buffer.from(await head.arrayBuffer()), 'docx');
} else {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    // Pages that hold connections open (chat widgets, analytics) never reach
    // network idle, so fall back to the load event; retry once on a transient
    // network error such as a DNS miss.
    const open = async () => {
      try {
        return await page.goto(url, {
          waitUntil: 'networkidle',
          timeout: 30000,
        });
      } catch (e) {
        if (!/Timeout/.test(String(e)))
          await new Promise((r) => setTimeout(r, 3000));
        return page.goto(url, { waitUntil: 'load', timeout: 45000 });
      }
    };
    const res = await open();
    await page.waitForTimeout(2500);
    const parts = [`HTTP ${res?.status() ?? '?'} ${page.url()}`];
    for (const frame of page.frames()) {
      const t = await frame
        .evaluate(() => document.body?.innerText ?? '')
        .catch(() => '');
      if (t.trim()) parts.push(t);
    }
    text = parts.join('\n\n');
  } finally {
    await browser.close();
  }
}

if (terms.length) {
  const lines = text.split('\n');
  const re = new RegExp(
    terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
    'i',
  );
  const keep = new Set();
  lines.forEach((l, i) => {
    if (re.test(l))
      for (const j of [i - 1, i, i + 1])
        if (j >= 0 && j < lines.length) keep.add(j);
  });
  text =
    [...keep]
      .sort((a, b) => a - b)
      .map((i) => lines[i])
      .join('\n') || `(no line matches ${terms.join(', ')})`;
}
console.log(
  text.length > LIMIT
    ? `${text.slice(0, LIMIT)}\n[truncated at ${LIMIT} characters]`
    : text,
);
