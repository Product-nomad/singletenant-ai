# singletenant.ai — STATE

**Goal**: An evidence-linked reference database for dedicated/single-tenant LLM hosting, aimed at compliance and procurement buyers in regulated industries (legal, healthcare, regulated finance, public sector). Credibility first; monetisation (affiliate partnerships + consulting CTA conversions into Incubate Labs engagements) is secondary to it. Newsletter sponsorships are **no longer a revenue line** (decision 7, DECISIONS.md 2026-07-06).
**Phase**: **Build** — v2 reposition per `SPEC_singletenant_v2.md`, on branch `v2`. Validate begins at spec piece 12; merging `v2 → main` is the ship action and needs an explicit go from Simon.
**Status**: private repo; live v1 still serving on `singletenant.ai` (Cloudflare Workers static assets) untouched until piece 12. Pieces 0–1 complete (governance + tooling baseline; schema v2 + evidence-linked vendor data).
**Last touched**: 2026-07-07.

## Vendor data (v1 baseline, enumerated at piece 0)

`src/content/vendors/` holds exactly four YAMLs: `baseten.yaml`, `modal.yaml`, `runpod.yaml`, `together-ai.yaml`. These migrate to schema v2 in piece 1, then the bench extends to 15 vendors (~6/3/3/3 across dedicated-gpu / hyperscaler-dedicated / managed-selfhost / eu-sovereign) in pieces 6a–6k. RunPod is an existing affiliate — its affiliate link must not render in v2 before the piece 8 disclosure pages land.

## What's done

- v1 (May 2026): Astro 5 + Tailwind 4 + MDX scaffold, 4 vendor profiles, 12 comparison pages, 1 article, editorial "Buyer's Brief" design. Live on Cloudflare.
- Branches reconciled: `fix/cloudflare-deploy` and the 2026-05-20 audit merged to `main`; `v2` branched from `main` (4eca61c).
- **Piece 0 (2026-07-07)**: governance scaffold closed — `THREAT_MODEL.md`, `CONTEXT.md` created; `DECISIONS.md` records the spec §2 locked-decision table; `CHANGELOG.md` started; README phase marker moved Frame → Build. Tooling wired: Biome (lint+format), lefthook pre-commit (typecheck + tests + lint), `node --test` (`npm test` green; lint, `astro check`, and build all clean). Baseline evidence in `docs/example_runs/v2-baseline/`: `wget` mirror of live v1 (`site/`) + full-page screenshots of home, vendors, vendor detail, compare index, compare pair, about (`screenshots/`).
- **Piece 1 (2026-07-07)**: vendor schema v2 in `src/schemas/vendor.mjs` (shared by `content.config.ts` and the test suite) — evidence_url + verified date required per populated fact, `unknown` only without evidence, strict against v1 leftovers, `-vs-` slugs rejected. All 4 vendor YAMLs migrated with facts re-verified against primary sources fetched 2026-07-07; unsourced v1 editorial content dropped. Templates render v2 facts ("Not verified" for unknowns) pending the piece 4–5 rebuild; homepage stats computed from data. 14 tests green.

## What's next (spec pieces, in order)

1. **Piece 2** — design tokens: Inter + JetBrains Mono self-hosted, Fraunces/Source Serif removed.
2. **Piece 3** — shell restyle; kill "Issue 01"/newsletter framing everywhere; newsletter route → `/changelog/`.
3. **Pieces 4–5** — VendorMatrix (filterable, JS-optional) + evidence-linked vendor detail template.
4. **Pieces 6a–6k** — research 11 new vendors from primary sources only (parallelisable, `npm run validate` as merge gate; piece 6a adds the validate script).
5. **Pieces 7–11** — changelog system, legal pages (privacy/terms/disclosure — before any affiliate link renders), 105 compare pages + `-vs-` ADR, integrity copy audit (incl. "Simon Wilson" attribution check), SEO/meta/redirects.
6. **Piece 12** — validate + ship: Lighthouse ≥ 90, security-review pass, **explicit go from Simon**, merge `v2 → main`.
7. **Pieces 13–14** — skill capture + lessons; weekly report-only evidence drift watch (Telegram summary, token outside repo).

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

- (accumulates during the v2 build; captured into the evidence-linked-directory skill at piece 13)
