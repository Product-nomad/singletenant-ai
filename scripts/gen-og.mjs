// Generates public/og-default.png (1200x630) — the default Open Graph / Twitter
// card image referenced by BaseLayout. Rendered from an inline SVG via sharp
// (already a dependency through Astro's image service), so no new packages and
// no binary asset is hand-authored. On-brand with the site's light ground and
// ink/accent tokens (src/styles/global.css).
//
// Run: node scripts/gen-og.mjs  (also wired as `npm run gen:og`)
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const PAPER = '#fafaf8';
const INK = '#111111';
const MUTE = '#6b6b66';
const ACCENT = '#2456d6';

// font-family is generic sans-serif: librsvg resolves it via fontconfig, so the
// card renders identically regardless of whether Inter is installed system-wide.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect x="0" y="0" width="1200" height="12" fill="${ACCENT}"/>
  <text x="80" y="150" font-family="monospace" font-size="26" letter-spacing="6" fill="${MUTE}">SINGLETENANT.AI</text>
  <text x="80" y="320" font-family="sans-serif" font-size="76" font-weight="700" fill="${INK}">Dedicated &amp; single-tenant</text>
  <text x="80" y="410" font-family="sans-serif" font-size="76" font-weight="700" fill="${INK}">LLM hosting, evidence-linked.</text>
  <text x="80" y="510" font-family="sans-serif" font-size="34" fill="${MUTE}">Every fact links to a primary source with the date it was verified.</text>
  <rect x="80" y="556" width="120" height="6" fill="${ACCENT}"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(join(root, 'public/og-default.png'));
console.log('wrote public/og-default.png (1200x630)');
