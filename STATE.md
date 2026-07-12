# singletenant.ai — STATE

**Goal**: An evidence-linked reference database for dedicated/single-tenant LLM hosting, aimed at compliance and procurement buyers in regulated industries (legal, healthcare, regulated finance, public sector). Credibility first; monetisation (affiliate partnerships + consulting CTA conversions into Incubate Labs engagements) is secondary to it. Newsletter sponsorships are **no longer a revenue line** (decision 7, DECISIONS.md 2026-07-06).
**Phase**: **Shipped, iterating**. v2 is live on `main` (15-vendor bench, legal pages, 105 compare pages, sitemap). Current work is the v2.1 audit-fix and analysis-layer sprint on branch `feat/v2.1-analysis`, pending review before merge to `main`.
**Status**: v2 serves on `singletenant.ai` via Cloudflare Workers static assets. A read-only post-ship integrity audit (`docs/example_runs/v2-launch/audit-report.md`) found two medium issues, both fixed in v2.1. Pieces A1 to G of v2.1 are complete on `feat/v2.1-analysis`.
**Last touched**: 2026-07-12.

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

## What's next (spec pieces, in order)

1. **Piece 8** — legal pages: `/privacy/` (UK GDPR Art 13 / ICO), `/terms/`, `/disclosure/` (ASA CAP + FTC, visible on every page an affiliate link renders); correction process on `/methodology/`; must land **before** any affiliate link renders (RunPod).
2. **Piece 9** — 105 compare pages + `-vs-` slug ADR + data-derived differences summary per page (thin-page SEO mitigation).
3. **Piece 10** — integrity copy audit (claims match data; "Simon Wilson" attribution check).
4. **Piece 11** — SEO/meta, sitemap, `_redirects`.
5. **Piece 12** — validate + ship: Lighthouse ≥ 90, security-review pass, **explicit go from Simon**, merge `v2 → main`.
6. **Pieces 13–14** — skill capture + lessons; weekly report-only evidence drift watch (Telegram summary, token outside repo).

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
- **Compare-table empty-array parity**: empty tag fields render `-` in the compare table while other unknowns render "Not verified"; make them consistent (audit section 3, low; not triggered by current data).

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
- Never pipe gate commands (`npm run validate`, `git commit`) through `tail`/`head` — the pipe masks the exit code and caused two silent commit failures on 2026-07-07. Run the command bare, check `$?` directly, and verify commits landed via `git log`.
- Research agents can leave valid uncommitted work when a session dies — check `git status` for orphaned YAMLs before relaunching agents, and validate + commit them first (recovered 4 vendors that way on 2026-07-08).
- Spot-check that each evidence_url actually contains the claim, not just that it returns 200 — the Databricks HIPAA_BAA cert initially cited a page saying only "HIPAA compliance options"; the fix was pointing at the published BAA (`databricks.com/legal/baa`).
- A live evidence link can still be the wrong source. The Databricks SOC 2 evidence_url returned HTTP 200 but pointed at the HIPAA page, not a SOC 2 page, so a link-health check passed while the citation was wrong. Only reading the page for the specific claim catches it. Caught by the v2.1 post-ship audit, fixed in piece A1.
