# singletenant.ai

The independent buyer's resource for single-tenant LLM hosting.

Built with **Astro 5** + **Tailwind 4** + **MDX**, deployed on **Cloudflare Workers** (Static Assets model — see `wrangler.jsonc`).

---

> **Phase: Build** (v2 reposition, branch `v2` — see `SPEC_singletenant_v2.md`).
> Frame governance gap closed 2026-07-07: `THREAT_MODEL.md`, `DECISIONS.md`,
> `CHANGELOG.md`, `CONTEXT.md` all present. Remaining v1 exposure: legal pages
> (`/privacy/`, `/terms/`, `/disclosure/`) 404 on live — closed by spec piece 8
> before any affiliate link renders in v2. **Validate begins at spec piece 12.**

---

## Quick start

```bash
npm install
npm run dev
```

Site runs at http://localhost:4321.

```bash
npm run build      # production build to ./dist
npm run preview    # preview production build locally
```

## Project structure

```
src/
├── content.config.ts          # Content collection schemas (vendors + articles)
├── content/
│   ├── vendors/               # ⭐ THE DATABASE — one YAML per vendor
│   │   ├── baseten.yaml
│   │   ├── together-ai.yaml
│   │   ├── runpod.yaml
│   │   └── modal.yaml
│   └── articles/              # MDX blog posts
│       └── what-is-single-tenant-llm-hosting.mdx
├── layouts/
│   ├── BaseLayout.astro       # HTML head, nav, footer wrapper
│   └── ArticleLayout.astro    # Wrapper for blog posts (drop caps, prose styles)
├── components/
│   ├── Header.astro           # Editorial masthead with date strap
│   ├── Footer.astro           # Newsletter signup + colophon
│   ├── NewsletterSignup.astro # Buttondown-ready form
│   ├── ConsultingCTA.astro    # Inline + block versions of the consult pitch
│   ├── VendorCard.astro       # Used in directory and homepage
│   └── ComparisonTable.astro  # Side-by-side data table
├── pages/
│   ├── index.astro            # Homepage
│   ├── about.astro
│   ├── contact.astro
│   ├── vendors/
│   │   ├── index.astro        # Directory of all vendors
│   │   └── [slug].astro       # ⭐ Auto-generates one page per vendor
│   ├── compare/
│   │   ├── index.astro        # All comparison pairs
│   │   └── [slug].astro       # ⭐ Auto-generates compare/X-vs-Y for every pair
│   └── blog/
│       ├── index.astro
│       └── [slug].astro       # MDX article rendering
└── styles/
    └── global.css             # Tailwind + design tokens + editorial typography
```

## The killer feature: programmatic page generation

Every YAML file in `src/content/vendors/` automatically generates:

- **One vendor profile page** at `/vendors/{slug}/`
- **N-1 comparison pages** at `/compare/{slug}-vs-{other}/` (one for every other vendor)

With 4 vendors, you have **4 vendor pages + 12 comparison pages = 16 pages** from data alone.
Add your 5th vendor: that becomes **5 + 20 = 25 pages**, no extra code.
Reach 15 vendors and you have **15 + 210 = 225 pages** in your sitemap.

This is the SEO surface area that lets you compete with G2 and TrustRadius on the long tail.

## Adding a new vendor

1. Copy `src/content/vendors/baseten.yaml` to a new file (e.g. `cerebrium.yaml`)
2. Fill in every field. Required fields are enforced by the Zod schema in `src/content.config.ts` — Astro will refuse to build if anything is missing.
3. Save. Dev server hot-reloads. Vendor page appears at `/vendors/cerebrium/`. New comparison pages appear automatically.

Schema highlights:
- `deployment_options` is an enum — must be one of: `shared-api`, `dedicated-endpoint`, `single-tenant`, `vpc`, `self-hosted`, `on-prem`, `air-gapped`
- `compliance` is also an enum — see `src/content.config.ts` for the full list. Add new ones there as needed.
- `partnership_status` controls the "Partner" badge — set to `affiliate` only when you have an actual partnership in place
- `last_reviewed` is mandatory — keeps you honest about data freshness
- `description_long` is **plain text only** — the field is rendered via paragraph-split, not a Markdown renderer. Markdown syntax (`**bold**`, `[links]()`, bullet lists) will appear as raw characters on the published page. Use double newlines (`\n\n`) for paragraph breaks; no other formatting is supported.

## Adding a new article

Create `src/content/articles/your-slug.mdx` with frontmatter:

```yaml
---
title: "Your title"
description: "180-char meta description"
pub_date: 2026-04-29
author: "Simon Newton"
category: "guide"  # one of: guide, comparison, analysis, vertical, news
target_keyword: "the keyword you're chasing"
tags: ["compliance", "uk"]
featured: false
draft: false
---

Body here in Markdown / MDX.
```

Articles appear automatically on the blog index and homepage (latest 3).

## Setup checklist before launching

### 1. Cloudflare Workers (Static Assets)

```bash
# In your local repo:
git init
git add .
git commit -m "Initial scaffold"
git remote add origin git@github.com:yourusername/singletenant-ai.git
git push -u origin main
```

Then in the Cloudflare dashboard:
1. Workers & Pages → Create → **Workers** → Connect to Git (use Workers, not Pages — Pages is the legacy product; new sites use Workers Static Assets)
2. Pick your repo, branch `main`
3. Build command: `npm run build`
4. Deploy command: `npx wrangler versions upload` (default — picks up `wrangler.jsonc` automatically)
5. Environment variable: `NODE_VERSION` = `20` (or higher)
6. Custom domain: add `singletenant.ai`

`wrangler.jsonc` declares `name: singletenant-ai`, `assets.directory: ./dist`, and `assets.not_found_handling: 404-page`. Cloudflare's build pipeline calls `npm run build` → produces `./dist/` → `wrangler versions upload` ships those assets. Auto-deploy on every push to `main` from then on.

### 2. Buttondown newsletter

1. Create account at buttondown.email
2. Pick username (suggest `singletenant`)
3. Update `BUTTONDOWN_USERNAME` constant in `src/components/NewsletterSignup.astro` (line 4) if different
4. Set up newsletter from-address to `simon@singletenant.ai` once email forwarding is configured

### 3. Cloudflare Web Analytics

1. In Cloudflare: Analytics & Logs → Web Analytics → Add a site
2. Copy the token
3. Uncomment the script tag in `src/layouts/BaseLayout.astro` (around line 50) and paste your token

### 4. Email forwarding

1. Cloudflare: Email → Email Routing → Routes
2. Forward `simon@singletenant.ai` → your personal inbox

### 5. Search Console

1. Google Search Console: Add property `https://singletenant.ai`
2. Verify via DNS TXT record (Cloudflare makes this easy)
3. Submit sitemap: `https://singletenant.ai/sitemap-index.xml`
4. Repeat for Bing Webmaster Tools

### 6. Social handles

- X / Twitter: `@singletenantai`
- GitHub: organisation `singletenant-ai`

### 7. Legal pages — LIVE 404s (urgent, site is already deployed)

The footer links to `/privacy/`, `/terms/`, and `/disclosure/` on every page of
the live site. All three currently return **HTTP 404**. These are active regulatory
gaps, not pre-launch TODOs:

- `/privacy/` — required by UK GDPR Article 13 before any newsletter email is
  collected. Must name data controller, Buttondown as sub-processor, lawful basis.
- `/disclosure/` — required by UK ASA CAP Code and US FTC before any affiliate link
  is live. The RunPod vendor page currently shows an affiliate badge; `/disclosure/`
  must exist to back it up (or the badge must be removed immediately).
- `/terms/` — minimum-viable ToS for editorial site.

Generate stubs with a service like Termly or write your own. **Do not collect
newsletter emails or serve affiliate links until `/privacy/` and `/disclosure/` are
live with correct content.**

## Design system

- **Display font:** Fraunces (variable serif, modern, distinctive)
- **Body font:** Source Serif 4 (technical credibility, readable at length)
- **Mono:** JetBrains Mono (data tables, code, eyebrows)
- **Colours:**
  - Paper `#f7f4ed` — warm off-white background
  - Ink `#0f1419` — deep navy-black for text
  - Accent `#9b1b30` — heraldic red for emphasis and links on hover
  - Mute `#6b6660` — warm gray for secondary text
  - Rule `#d6cfc1` — hairline borders
- **Fonts loaded from Google Fonts** in `src/styles/global.css`

To customise: edit the `@theme` block at the top of `src/styles/global.css`.

## What's next

Sequence I'd suggest from here:

1. **Run it locally**, click around, get a feel for the editorial tone
2. **Add 6 more vendors** — Cerebrium, PremAI, Anyscale, Lambda Labs, Fireworks, AWS Bedrock — to push the comparison surface up to 56 pages
3. **Push to GitHub + Cloudflare Workers**
4. **Wire up Buttondown** and the analytics token
5. **Write 4 more cornerstone articles** (see the article briefs in your 30-day plan)
6. **Send the first 5 partnership outreach emails**
7. **Submit sitemap to Search Console** and check indexation a week later

## Caveats

- The Buttondown form action will only work after you've created a real Buttondown account and updated the username in `NewsletterSignup.astro`. Until then, submissions will 404.
- The Cloudflare Web Analytics script is commented out — uncomment after you've got the token.
- Schema.org markup is in place for vendors and articles, but you may want to add `Organization` schema with your own details to the homepage when you have time.
- The compare URL pattern is `{a}-vs-{b}` — if a vendor slug ever contains `-vs-` literally, it'll break. None of the current four do; if you add one that does, switch to a different separator (e.g. `~vs~`).

---

Edited by Simon Newton.
Last scaffolded: 29 April 2026.
