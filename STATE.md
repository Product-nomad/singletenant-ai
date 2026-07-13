# singletenant.ai — STATE

**Goal**: An evidence-linked reference database for dedicated/single-tenant LLM hosting, aimed at compliance and procurement buyers in regulated industries (legal, healthcare, regulated finance, public sector). Credibility first; monetisation (affiliate partnerships + consulting CTA conversions into Incubate Labs engagements) is secondary to it. Newsletter sponsorships are **no longer a revenue line** (decision 7, DECISIONS.md 2026-07-06).
**Phase**: **Shipped, iterating**. v2 plus the v2.1 audit-fix/analysis layer and a 2026-07-13 polish pass are live on `main` (15-vendor bench, legal pages, 105 compare pages, sitemap, three articles, RSS). Auto-deploys to `singletenant.ai` from `main`.
**Status**: v2 serves on `singletenant.ai` via Cloudflare Workers static assets. A read-only post-ship integrity audit (`docs/example_runs/v2-launch/audit-report.md`) found two medium issues, both fixed in v2.1; pieces A1–G merged from `feat/v2.1-analysis` into `main` via PR #3 on 2026-07-13. Pieces 0–13 (v2) plus A1–G (v2.1) complete; a 2026-07-13 polish pass (P1–P6) followed. **Still owed** (browser-gated, deferred to Simon): Lighthouse ≥ 90 perf/SEO/a11y and screenshots against live — the two Lighthouse findings that were code-fixable (a11y heading order, perf font CLS + render-blocking) were addressed in the polish pass and now need a live re-measure to confirm the scores. Piece 14 (drift watch) still open.
**Last touched**: 2026-07-13.

## Vendor data (15/15, pieces 6a–6k complete)

`src/content/vendors/` holds all 15 vendors at the planned 6/3/3/3 balance — **dedicated-gpu**: baseten, modal, runpod, together-ai, fireworks-ai, coreweave; **hyperscaler-dedicated**: aws-bedrock-provisioned, azure-openai-ptu, vertex-ai-provisioned; **managed-selfhost**: huggingface-inference-endpoints, nvidia-nim, databricks-model-serving (Databricks qualified as the third candidate from primary sources — no 6/3/2/4 rebalance needed); **eu-sovereign**: ovhcloud, scaleway, nebius. Every populated fact carries evidence_url + verified date (2026-07-07/08); `npm run validate` green. RunPod is an existing affiliate — its affiliate link must not render before the piece 8 disclosure pages land (no `affiliate_url` is set in any YAML yet, so nothing renders today).

## What's done

- v1 (May 2026): Astro 5 + Tailwind 4 + MDX scaffold, 4 vendor profiles, 12 comparison pages, 1 article, editorial "Buyer's Brief" design. Live on Cloudflare.
- Branches reconciled: `fix/cloudflare-deploy` and the 2026-05-20 audit merged to `main`; `v2` branched from `main` (4eca61c).
- **Piece 0 (2026-07-07)**: governance scaffold closed — `THREAT_MODEL.md`, `CONTEXT.md` created; `DECISIONS.md` records the spec §2 locked-decision table; `CHANGELOG.md` started; README phase marker moved Frame → Build. Tooling wired: Biome (lint+format), lefthook pre-commit (typecheck + tests + lint), `node --test` (`npm test` green; lint, `astro check`, and build all clean). Baseline evidence in `docs/example_runs/v2-baseline/`: `wget` mirror of live v1 (`site/`) + full-page screenshots of home, vendors, vendor detail, compare index, compare pair, about (`screenshots/`).
- **Piece 1 (2026-07-07)**: vendor schema v2 in `src/schemas/vendor.mjs` (shared by `content.config.ts` and the test suite) — evidence_url + verified date required per populated fact, `unknown` only without evidence, strict against v1 leftovers, `-vs-` slugs rejected. All 4 vendor YAMLs migrated with facts re-verified against primary sources fetched 2026-07-07; unsourced v1 editorial content dropped. Templates render v2 facts ("Not verified" for unknowns) pending the piece 4–5 rebuild; homepage stats computed from data. 14 tests green.
- **Pieces 2–5 (2026-07-07)**: design tokens (Inter + JetBrains Mono self-hosted, serif fonts removed); shell restyle (Issue/newsletter framing killed — no `/newsletter/` route ever existed, so nothing to redirect); VendorMatrix (filterable, JS-optional, homepage hero + `/vendors/`); evidence-linked vendor detail template (EvidenceLink + LastVerified per section, "Not verified" for unknowns). See CHANGELOG.md for detail.
- **Pieces 6a–6k (2026-07-07/08)**: bench extended 4 → 15 via parallel research agents, one commit per vendor, `npm run validate` as merge gate; all facts primary-sourced; spot-checked evidence URLs (HTTP 200 + claim-on-page) before each commit batch. Databricks Model Serving qualified as the third managed-selfhost candidate (published BAA at databricks.com/legal/baa; ISO 27001 incl. AWS single-tenant; FedRAMP), so the 6/3/2/4 rebalance fallback wasn't needed. Notable per-vendor caveats (unknowns and scope limits) recorded in each YAML's notes.
- **Piece 7 (2026-07-08)**: changelog system — `data/changelog.yaml` (Zod schema `src/schemas/changelog.mjs`: typed entries, ISO dates, newest-first enforced, vendor slugs cross-checked) drives `/changelog/` and the homepage "Last data change" stat; static review stamp removed; validate + tests cover it; CHANGELOG.md cross-references the site changelog.
- **Piece 8 (2026-07-08)**: legal/compliance pages — `/privacy/`, `/terms/`, `/disclosure/` and the `/methodology/` correction process; affiliate disclosure gating wired so a `affiliate_url` only renders once `/disclosure/` exists (tested).
- **Piece 9 (2026-07-08)**: all 105 compare pages regenerated for the 15-vendor set; `-vs-` slug ADR (`DECISIONS.md`); per-page data-derived differences summary (`src/lib/compare.mjs`, `differencesSummary`) as the thin-page SEO mitigation — every line computed from the two YAML records, `unknown` → "not verified".
- **Piece 10 (2026-07-09)**: integrity copy audit — overclaim greps (`comprehensive|all major|read by`, plus a broader marketing-phrase sweep) returned no substantive hits; the strongest data-backed claim (methodology's "a populated fact always carries a URL and a date") is enforced by the schema and 28 passing tests. The one open sub-item — the "Edited by Simon Wilson" editorial attribution, an unverified placeholder — was **resolved 2026-07-09 (`0b3f524`)**: Simon confirmed his name is **Simon Newton** (LinkedIn vanity slug is the reversed `/in/newton-simon/`, chosen because `simon-newton` was taken). `fix(copy)` corrected all six instances across about/privacy/contact/article/config/README and wired the contact-page LinkedIn placeholder to the live profile.
- **Piece 11 (2026-07-09, `bb12dcc`)**: SEO/meta — generated `public/_redirects` (`/compare/` index → `/vendors/`; every reverse-ordered compare pair → its canonical alphabetical page; 6 reverse URLs were live in v1); hand-rolled `/rss.xml` endpoint and a real 1200×630 `og-default.png` (sharp) to fix BaseLayout references that pointed at nonexistent targets; homepage WebSite/Organization JSON-LD; sitemap regenerated (105 canonical compares only, no reverse/index leakage). `gen:redirects` + `gen:og` npm scripts. `feat(seo): v2 meta, sitemap, redirects`.
- **Piece 13 (2026-07-09)**: `.claude/skills/evidence-linked-directory/SKILL.md` captures the method (evidence invariant, unknown-not-guess, canonical routing, thin-page mitigation) and the three gotchas below; lessons appended here.

## v2.1 sprint (2026-07-12, branch `feat/v2.1-analysis`)

Post-ship audit fixes plus an analysis layer. One commit per piece, gates green before each (lint, `node --test`, `astro check`, `npm run validate`), pushed per piece.

- **Post-ship audit**: read-only integrity audit of the launched v2, report at `docs/example_runs/v2-launch/audit-report.md`. All 62 evidence URLs returned 200. Two medium findings fixed (A1, A2); low findings deferred to v3.
- **A1, Databricks SOC 2 evidence**: the `SOC2_TYPE2` evidence_url pointed at the HIPAA page. Repointed to `https://www.databricks.com/trust/compliance/soc`, which names the SOC 2 Type II report (verified 2026-07-12). Public changelog entry added.
- **A2, `_redirects`**: `compare/[slug].astro` promised reverse-pair 301s via `_redirects` but none existed. Added `scripts/gen-redirects.mjs`, wired into `npm run build`, emitting `public/_redirects` with 105 reverse-to-canonical rules (gitignored as generated). Cloudflare Workers static assets honour `_redirects` up to 2,000 rules.
- **B, region verification**: the 8 empty-region vendors researched from primary sources. Populated: modal, runpod, databricks-model-serving (US, Europe, Asia-Pacific) and huggingface-inference-endpoints (US, Europe). Recorded not verified with provenance comments: baseten, together-ai, nvidia-nim, vertex-ai-provisioned. One commit per vendor, changelog entry per populated vendor. Regions still carry no schema evidence field (v3 candidate).
- **C, editor identity**: `/about/` gains a "Who runs this" section naming Simon Newton (military intelligence, delivery at Ocado Technology, independent applied AI builder, LinkedIn). The prior "Simon Wilson" attribution is replaced site-wide (about, privacy operator, article author default and existing byline, README).
- **D, article**: "The jurisdiction problem: why an EU region is not EU sovereign" (`/blog/jurisdiction-eu-region-not-sovereign/`). Residency versus sovereignty, CLOUD Act (18 U.S.C. 2713) cited, all 15 vendors walked and linked to their profiles.
- **E, article**: "Why this site says Not verified so often" (`/blog/why-not-verified/`). The methodology as a piece, using the A1 bug as the worked example.
- **RSS**: dependency-free `/rss.xml` endpoint (`src/pages/rss.xml.ts`). BaseLayout linked it but no feed existed. All three articles appear.
- **F, monthly dispatch template**: `src/content/templates/monthly-dispatch.md`, excluded from the build (not a configured collection; verified absent from `dist/`).
- **G, close-out**: this STATE update and the CHANGELOG entry; deferred audit items logged to v3.

Article writing rules held throughout: analyst tone, UK English, no em dashes, every vendor claim linked to its profile or a primary source.

## Polish pass (2026-07-13, on `main`)

Six small pieces, one commit each, gates checked directly (exit codes) before every commit.

- **P1 — em dashes + gate** (`b8e219d`): rewrote every em dash (U+2014) under `src/` (reader copy, page titles, the `X | singletenant.ai` title separator, and code/CSS comments) as commas/colons/full stops. `npm run validate` now walks `src/` and fails with file:line on any U+2014, so the no-em-dash house rule (already an article-writing rule) can't regress. Also switched the compare-table empty-tags cell from a bare dash to "Not verified" (see resolved v3 item below).
- **P2 — CoreWeave ISO 27001 note** (`7699f99`): the note already explained the ISO 27001 exclusion but cited nothing; attached the primary source (CoreWeave's security page uses "aligns … to industry-standard SOC2 and ISO 27001 frameworks", verified live 2026-07-13 at `https://www.coreweave.com/security`). Changelog entry added. The task premise ("profile doesn't explain it") was outdated — the fix was the missing citation, not a new sentence.
- **P3 — homepage og:title** (`600813e`): added an optional `ogTitle` prop to BaseLayout (og:title/twitter:title fall back to the branded `<title>` but can be overridden); homepage social title is now "singletenant.ai | evidence-linked single-tenant LLM hosting data" while `<title>` stays the bare brand. Subpages already had descriptive og:titles and were left alone.
- **P4 — category vs residency** (`e48684f`): one-sentence footnote under the matrix table (in VendorMatrix, so it appears on both the homepage and `/vendors/`) explaining that category reflects parent jurisdiction while a residency guarantee is a separate per-vendor verified fact, so an EU-sovereign vendor (e.g. Nebius) can still read "Not verified". Links to the jurisdiction article.
- **P5 — heading hierarchy** (`34e8aaa`): fixed two h1→h3 skips Lighthouse flagged — ConsultingCTA's h3 (rendered directly under the hero h1 on the homepage) and the compare page's "quick verdict" vendor-card h3s, all promoted to h2. Semantics only; every promoted heading already carried an inline `font-size`, so rendering is unchanged. A script over all 133 built pages confirms zero heading-level skips.
- **P6 — font CLS/preload** (`b82c5a9`): preload the two latin woff2 the site paints with (Inter body, JetBrains Mono) in BaseLayout, hrefs imported via `?url` so they match the `@fontsource` `@font-face` src (no double-download). `font-display: swap` was already set by `@fontsource` (verified in built CSS). Browser Lighthouse/screenshots remain gated out of this sandbox — Simon to confirm CLS < 0.1 live.

## Structured-data pass (2026-07-13, on `main`, shipped live)

JSON-LD audit + extension across the programmatic templates, two commits, gates checked directly (exit codes) before each, pushed and verified live on `singletenant.ai`. All markup emits only facts the pages already render (SPEC §5 integrity): no `aggregateRating`, `review`, `offers`/`price`, and no `FAQPage` (the compare pages have no visible Q&A to back it). Shared builders live in `src/lib/schema.mjs` (same pattern as `labels.mjs`/`compare.mjs`); `tests/jsonld.test.mjs` guards the integrity rule with a recursive forbidden-keys assertion applied to every graph.

- **S1 — vendor + compare templates** (`dfb7412`): `/vendors/` directory now emits a `Dataset` (`variableMeasured` = the 5 tracked dimensions, `keywords`, `dateModified` from the changelog) plus an `ItemList` enumerating all 15 vendors, plus a `BreadcrumbList` — it previously had no structured data. Vendor profiles: the bare `SoftwareApplication` gained a `provider` Organization and a `dateModified` from the vendor's latest verified fact, plus a breadcrumb. The 105 compare pages: a `Dataset` whose `about` is the two vendors' `SoftwareApplication`s, plus a breadcrumb — also previously bare. 11 new tests (37 total after S1).
- **S2 — article templates** (`add8f5c`): `ArticleLayout` moved off its inline object onto the shared `articleSchema` builder — `Article` (headline, `author` Person = Simon Newton, `datePublished`/`dateModified`) plus a Home > Blog > title breadcrumb. The `publisher` Organization now carries the site `url` + `logo` the inline object was missing (it emitted `name` only). Added 3 article tests (40/40 total), including the same forbidden-keys guard.
- **Gates each commit**: `npm test` 40/40, `lint` clean, `typecheck` 0/0, `validate` clean, `build` 133 pages; emitted `ld+json` extracted and JSON-parsed from a built page of each type.
- **Live verification (post-push)**: deploy went live ~30s after push. Spot-checked all four page types on production — every block is well-formed JSON, URLs absolute, dates from real data, ItemList lists 15 vendors, compare `Dataset.about` carries both apps, and a live forbidden-keys scan found none.
- **Still owed** (browser-gated, deferred to Simon): Google Rich Results Test / Search Console against a live directory / profile / compare / article URL, to confirm Google itself reports `Dataset`/`Article`/breadcrumb eligibility. Markup is confirmed valid and serving. Sits alongside the piece-12 Lighthouse/screenshot items.

## What's next (spec pieces, in order)

1. ~~**Piece 12** — validate + ship~~ **SHIPPED 2026-07-09** (`main` @ `1cd24c3`): security-review clean, lint/tests/typecheck green, live HTTP spot-check passed (301s + copy verified). **Still owed** (browser-gated, deferred to Simon): Lighthouse ≥ 90 perf/SEO/a11y, screenshots, and a `docs/example_runs/v2-launch/` snapshot — run against the live site and log when done.
2. **Piece 14** — weekly report-only evidence drift watch (`~/bin/singletenant-review.sh` + user timer; HTTP-checks every `evidence_url`; Telegram summary, token from `~/.hermes/.env`; never edits data — decision 4).

## Open items

- ~~Value checkpoints~~ — confirmed by Simon 2026-07-07 (DECISIONS.md decision 6): ≥10 referring domains; ≥15% returning-visitor share; ≥1 unsolicited consulting enquiry, at 90 days post-launch.
- **Consulting CTA target**: which Incubate Labs engagement the CTA pitches (Local-LLM Pilot vs VPC/sovereignty advisory) — wire during shell restyle.
- **Editorial cadence**: monthly manual review, tracked in the public `/changelog/` — formalise on `/methodology/` at piece 8.

## v3 candidates (explicitly out of scope for v2 — decision 4, spec §9)

- Automated data collectors (data-platform pattern). v2 freshness = manual review + visible changelog + report-only drift watch.
- Dark mode.
- Any API over the vendor data.
- **Region evidence**: give `regions` the same value plus evidence_url plus verified structure as compliance, pricing and sovereignty (surfaced in v2.1 piece B; regions currently carry no in-product evidence, only a YAML provenance comment).
- **OVHcloud certifications URL** is a 2-hop redirect to `/en/compliance/`; point the four OVHcloud cert evidence_urls at the final URL (audit section 2, low).
- **Shared trust-centre evidence**: baseten, runpod, nebius, fireworks-ai and ovhcloud cite one landing URL for several certs rather than per-cert pages; deep-link where the trust centre allows (audit section 2, low).
- ~~**Compare-table empty-array parity**: empty tag fields render `-` in the compare table while other unknowns render "Not verified"; make them consistent (audit section 3, low; not triggered by current data).~~ **Resolved 2026-07-13 (P1, `b8e219d`)**: empty tags now render "Not verified" to match the sibling branch.

## Key files

- `SPEC_singletenant_v2.md` — the v2 build spec; piece table is the plan of record.
- `DECISIONS.md` / `CHANGELOG.md` / `THREAT_MODEL.md` / `CONTEXT.md` — governance set.
- `src/content.config.ts` — Zod schemas; single source of truth for vendor data validation (schema v2 lands here in piece 1).
- `src/content/vendors/*.yaml` — the database, one file per vendor.
- `src/pages/vendors/[slug].astro`, `src/pages/compare/[slug].astro` — programmatic page generation.
- `docs/example_runs/v2-baseline/` — frozen v1 evidence (mirror + screenshots).
- `tests/wiring.test.mjs`, `biome.json`, `lefthook.yml` — quality gates run by lefthook pre-commit.

## Lessons

- Captured into `.claude/skills/evidence-linked-directory/SKILL.md` (piece 13). The three gotchas below are the skill's Gotchas section.
- Never pipe gate commands (`npm run validate`, `git commit`) through `tail`/`head` — the pipe masks the exit code and caused two silent commit failures on 2026-07-07. Run the command bare, check `$?` directly, and verify commits landed via `git log`.
- Pass multi-line commit messages via `git commit -F <file>`, not a here-doc. Running git as `vpc` from a root shell means the here-doc is nested inside `sudo -u vpc bash -c '…'`; the delimiter got mangled on 2026-07-13 and a commit body truncated to one word. Write the message to a temp file in the repo, `chown vpc`, `commit -F`, then remove it — and read the committed body back with `git log -1 --format=%B` to confirm.
- Research agents can leave valid uncommitted work when a session dies — check `git status` for orphaned YAMLs before relaunching agents, and validate + commit them first (recovered 4 vendors that way on 2026-07-08).
- Spot-check that each evidence_url actually contains the claim, not just that it returns 200 — the Databricks HIPAA_BAA cert initially cited a page saying only "HIPAA compliance options"; the fix was pointing at the published BAA (`databricks.com/legal/baa`).
- Record `unknown` when the primary source doesn't clearly support the claim; don't infer from a launch blog or a rebrand. Vertex AI Provisioned Throughput's public GSU price list and regional availability weren't verifiable, so `pricing.public` and `data_residency_guarantee` stayed `unknown` and `regions` empty rather than being back-filled from marketing copy (2026-07-08).
- A schema-enforced evidence invariant pays off downstream: the piece 10 integrity copy audit found nothing to fix because unsourced claims were already impossible to commit. Enforce integrity in code, not in a late review pass.
- Meta references must resolve — the v2 BaseLayout shipped a `rel=alternate` to `/rss.xml` and an `og:image` at `/og-default.png`, neither of which ever existed (both inherited unnoticed from v1). Every `<link>`/`og:*`/feed reference needs a real target: build it or drop the tag (piece 11).
- A live evidence link can still be the wrong source. The Databricks SOC 2 evidence_url returned HTTP 200 but pointed at the HIPAA page, not a SOC 2 page, so a link-health check passed while the citation was wrong. Only reading the page for the specific claim catches it. Caught by the v2.1 post-ship audit, fixed in piece A1.
