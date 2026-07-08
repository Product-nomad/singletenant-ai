# Changelog

User-visible and governance changes, newest first. Site data changes (vendor facts, verification dates) live in the public `/changelog/` page from v2; this file tracks the project itself.

## Unreleased (v2 build, branch `v2`)

- 2026-07-08 — Changelog system (piece 7): `data/changelog.yaml` (Zod-validated, newest-first, vendor slugs cross-checked against the vendor files) now drives the public `/changelog/` page and the homepage "Last data change" stat; the stat computed from verification dates is removed. `npm run validate` covers the changelog alongside the vendor YAMLs. Data changes are recorded there from now on — this file keeps tracking the project itself.

- 2026-07-08 — Vendor bench complete at 15 (pieces 6b–6k): CoreWeave (dedicated GPU); OVHcloud, Scaleway, Nebius (EU sovereign); Hugging Face Inference Endpoints, NVIDIA NIM, Databricks Model Serving (managed self-host — Databricks qualified as the third candidate from primary sources, so no 6/3/2/4 rebalance needed); Amazon Bedrock Provisioned Throughput, Azure OpenAI PTU, Vertex AI Provisioned Throughput (hyperscaler dedicated, compliance scope checked per service). All facts from primary sources fetched 2026-07-07/08; unverifiable facts recorded `unknown`.

- 2026-07-07 — Vendor bench extension started (pieces 6a–6k): `npm run validate` added (schema check over every vendor YAML without a full build — the merge gate for vendor research). Fireworks AI added as the first new vendor, all facts from primary sources fetched 2026-07-07 (docs security page, pricing page, privacy policy); data-residency guarantee recorded `unknown` — none found at review.

- 2026-07-07 — Vendor detail template (piece 5): profile pages rebuilt as evidence-linked facts tables — Deployment, Compliance, Pricing, Sovereignty sections, each with an `EvidenceLink` (primary-source link showing its domain) and a `LastVerified` per-section date chip; `CertBadge` renders each certification with its source and verification date; unverified fields render "Not verified". Editorial sidebar layout replaced by full-width tables.

- 2026-07-07 — VendorMatrix (piece 4): filterable vendor comparison matrix is now the homepage hero and the `/vendors/` directory (same component). Dense table, sticky header, mono values; category buttons + compliance-cert checkboxes filter rows, keyboard-operable, with an aria-live result count. Progressive enhancement: the filter bar ships `hidden` and is revealed by script — with JS disabled the full table renders. `CategoryTag` (text label + muted hue, colour never load-bearing) and `src/lib/labels.mjs` (shared enum display labels) added. VendorCard grids replaced on home + directory; homepage editorial intro removed.

- 2026-07-07 — Shell restyle (piece 3): newspaper masthead/date strap replaced with a compact single-row header (wordmark + nav); footer newsletter block removed and `NewsletterSignup.astro` (Buttondown) deleted along with its CSS; dead v1 footer links dropped (`/for/financial-services/`, `/blog/category/guide/`, `/rss.xml`); "Issue 01 · The Buyer's Brief" framing removed from homepage and header. No `/newsletter/` route ever existed in v1 (verified against the baseline mirror), so no redirect was needed; `_redirects` lands at piece 11.

- 2026-07-07 — Design tokens v2 (piece 2): Fraunces + Source Serif 4 removed (Google Fonts imports gone; no remote font requests remain). Inter + JetBrains Mono self-hosted via `@fontsource-variable`, imported in `BaseLayout.astro`. Tailwind `@theme` tokens moved to the data-product palette: `#111` ink on `#FAFAF8` off-white, `#2456D6` accent, plus 4 muted category-tag hues (dedicated-gpu / hyperscaler-dedicated / managed-selfhost / eu-sovereign, each with a soft background variant). `--font-display`/`--font-body` kept as aliases to Inter until the piece 3–5 template rebuild removes their usages.

- 2026-07-07 — Vendor schema v2 (piece 1): every populated fact now carries an evidence_url + verified date, enforced by Zod (`src/schemas/vendor.mjs`, shared by Astro and the test suite). All 4 v1 vendor YAMLs migrated with facts re-verified against primary sources (trust centres, pricing pages, terms); unverifiable facts recorded as `unknown` and rendered "Not verified". Unsourced v1 editorial fields (descriptions, sweet spots, company facts) removed from the data set; templates render schema v2 facts pending the piece 4–5 rebuild.

- 2026-07-07 — v2 build started per `SPEC_singletenant_v2.md` (piece 0). Governance scaffold added (this file, `DECISIONS.md`, `THREAT_MODEL.md`, `CONTEXT.md`); README phase marker updated Frame → Build; STATE.md rewritten (newsletter removed from revenue framing, v1 vendor YAMLs enumerated). Tooling: Biome (lint+format), lefthook pre-commit (typecheck + tests + lint), `node --test`. Baseline evidence of live v1 in `docs/example_runs/v2-baseline/` (wget mirror + full-page screenshots).

## 1.0 (2026-05, "Buyer's Brief" editorial v1)

- Initial scaffold: 4 vendors (Baseten, Modal, RunPod, Together AI), 1 article, 12 comparison pages, editorial design (Fraunces/Source Serif). Deployed on Cloudflare Workers static assets.
