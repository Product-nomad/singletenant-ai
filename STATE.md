# singletenant.ai — STATE

**Goal**: An evidence-linked reference database for dedicated/single-tenant LLM hosting, aimed at compliance and procurement buyers in regulated industries (legal, healthcare, regulated finance, public sector). Credibility first; monetisation (affiliate partnerships + consulting CTA conversions into Incubate Labs engagements) is secondary to it. Newsletter sponsorships are **no longer a revenue line** (decision 7, DECISIONS.md 2026-07-06).
**Phase**: **Shipped** — v2 reposition per `SPEC_singletenant_v2.md` is live on production (`main`). Piece 12 shipped 2026-07-09 on Simon's "ship now, verify live" go.
**Status**: private repo; **v2 is live on `singletenant.ai`** (Cloudflare Workers static assets, auto-deploy from `main`). NB: a prior session had already fast-forwarded `main` to `76be7df` (v2 through piece 11), so v2 had in fact been serving in production before this session — the earlier "v1 still serving / main untouched" note was stale. On 2026-07-09 `main` was fast-forwarded to `1cd24c3` (adds piece 11 SEO/meta, piece 13 docs, the Simon Newton copy fix, and this STATE log). Pieces 0–13 complete. **Piece 12 ship gates**: lint/tests(28)/typecheck green; focused security-review clean; live HTTP spot-check verified post-deploy (byline = "Simon Newton", zero "Simon Wilson" remnants, contact LinkedIn link live, reverse-compare + `/compare/` 301s resolve). Still **not run** (need a real browser, unavailable in sandbox): Lighthouse ≥ 90 perf/SEO/a11y and screenshots — recommend Simon run these against live. Piece 14 (drift watch) still open.
**Last touched**: 2026-07-09.

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
- Research agents can leave valid uncommitted work when a session dies — check `git status` for orphaned YAMLs before relaunching agents, and validate + commit them first (recovered 4 vendors that way on 2026-07-08).
- Spot-check that each evidence_url actually contains the claim, not just that it returns 200 — the Databricks HIPAA_BAA cert initially cited a page saying only "HIPAA compliance options"; the fix was pointing at the published BAA (`databricks.com/legal/baa`).
- Record `unknown` when the primary source doesn't clearly support the claim; don't infer from a launch blog or a rebrand. Vertex AI Provisioned Throughput's public GSU price list and regional availability weren't verifiable, so `pricing.public` and `data_residency_guarantee` stayed `unknown` and `regions` empty rather than being back-filled from marketing copy (2026-07-08).
- A schema-enforced evidence invariant pays off downstream: the piece 10 integrity copy audit found nothing to fix because unsourced claims were already impossible to commit. Enforce integrity in code, not in a late review pass.
- Meta references must resolve — the v2 BaseLayout shipped a `rel=alternate` to `/rss.xml` and an `og:image` at `/og-default.png`, neither of which ever existed (both inherited unnoticed from v1). Every `<link>`/`og:*`/feed reference needs a real target: build it or drop the tag (piece 11).
