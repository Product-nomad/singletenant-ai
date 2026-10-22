# Decisions

One paragraph per decision, dated, chronological. Migrate to `docs/adr/` if this crosses ~10 active decisions (WoW §9).

## 2026-04-29 — Astro 5 + Tailwind 4 + MDX, YAML-driven programmatic pages
Initial scaffold choice: content collections (Zod-validated YAML) generate vendor and comparison pages programmatically. Kept for v2 — reskin, not rebuild.

## 2026-07-06 — v2 repositioning: decisions locked for the build
Recorded from `SPEC_singletenant_v2.md` §2; do not reopen during the build.

1. **Product identity: data product.** Filterable vendor matrix is the hero; articles support the data.
2. **Scope: four deployment categories** — dedicated GPU/inference clouds; hyperscaler dedicated capacity; managed self-host platforms; EU sovereign clouds. Sovereignty is the differentiator.
3. **Primary reader: compliance/procurement**; engineering secondary. Analyst tone, evidence-first.
4. **Freshness: phased.** v2 = manual review + visible changelog. Automated collectors out of scope (v3 candidate). A report-only weekly drift watch is in scope — it checks evidence links, never writes data.
5. **Stack: keep** Astro 5 + Tailwind 4 + YAML→pages.
6. **Success metric: backlinks + returning visitors at 90 days.** Value checkpoints (confirmed by Simon, 2026-07-07): ≥10 referring domains; ≥15% returning-visitor share; ≥1 unsolicited consulting enquiry — all at 90 days post-launch.
7. **Newsletter: killed.** All signup UI, copy, cadence promises removed; newsletter route redirects to `/changelog/`. Newsletter sponsorships removed from the revenue model.
8. **Vendor count: 15 at v2 launch**, category balance ~6/3/3/3.

## 2026-07-06 — Validation single source of truth: Zod in content.config.ts
Vendor schema v2 is enforced by the existing Zod content-collection schema plus a `node --test` suite; no parallel validator in another language. `npm run validate` wraps a schema-only check for the vendor-research merge gate.

## 2026-07-06 — Branch/deploy model for v2
All v2 work on the `v2` branch; Cloudflare preview deployments are the review surface. Merging `v2 → main` is the production ship action and requires an explicit go from Simon (WoW §5, §8).

## 2026-07-08 — ADR: compare-page slugs, `-vs-` separator, canonical pair ordering
**Context.** `/compare/[a]-vs-[b]/` embeds two vendor slugs in one route param, separated by `-vs-`. Two footguns: (1) a vendor slug that itself contains `-vs-` would make the route ambiguous; (2) generating both orderings of every pair doubles the page count (210 for 15 vendors) and creates duplicate content.
**Decision.** The `-vs-` separator stays (it is the search phrase buyers use). Mitigations: the vendor schema rejects any slug containing `-vs-` (tested, so the ambiguity cannot enter the data); each unordered pair gets exactly one page, canonically ordered **alphabetically by slug** — 15 vendors → 105 pages; `src/lib/compare.mjs#comparePath` is the single place canonical URLs are built, used by every internal link; the reverse ordering 301s to the canonical URL via `_redirects` (piece 11). The `/compare/` hub index is removed — the spec IA (§3) never included it, vendor profiles link all 14 of their comparisons (each compare page is reachable from both its profiles), and the sitemap carries the rest of discovery.

## 2026-10-17: ADR: reposition as an independent reference site (supersedes decision 7; amends decision 6)
**Context.** The site carried a consulting funnel on every template ("Book a 30-min call", a paid "Vendor selection" engagement on /contact/), which undercut the independence the data depends on. Simon asked for it to become an independent reference site, with ads, sponsorship and a newsletter as the future revenue lines instead of consulting.
**Decision.** (1) All consulting and services copy is removed. Conflicts are governed by `/editorial-policy/#conflicts`: the editor sells no services through the site, and any financial relationship with a covered vendor is disclosed. (2) **Decision 7 (newsletter killed) is superseded.** A newsletter signup returns on guides and the changelog behind `FEATURES.newsletter`, default off, posting to a separately deployed Worker. (3) Ads and sponsorship are allowed only under `/disclosure/`: never inside the matrix, comparison tables or facts; always labelled; no influence on data, ordering or inclusion. Both ship behind `FEATURES.ads` and `SponsoredLabel`. (4) Compare pairs are indexed only when `pairDistinctiveness` is at least 40 (or they are listed in `INDEX_OVERRIDES`), otherwise `noindex, follow`.
**Consequences.** Decision 6's third value checkpoint ("at least 1 unsolicited consulting enquiry") no longer measures anything; a replacement is open for Simon (see STATE.md open items). Turning either flag on is a reviewed code change; the newsletter also needs the Worker deployed and the privacy page re-dated first (`workers/newsletter/README.md`).

## 2026-07-18 — ADR: `/compare/` returns as a two-vendor picker (supersedes the 2026-07-08 hub removal)
**Context.** The 2026-07-08 ADR removed the `/compare/` hub because a v1-style index that lists all 105 pairs is thin, duplicative content. The v2.2 orientation work (SPEC v2.2, O2) still needs a guided entry for the "two-vendor comparer" intent, and a chip pointing at a page that 301s to the directory is a mild bait-and-switch.
**Decision.** `/compare/` comes back, but as a **picker, not a hub**: two vendor selects and a Compare button that routes to the canonical pair page. It never renders the 105 pairs, so the thin-content objection that motivated the removal does not apply. Consequences: (1) the picker is JS-driven and progressively enhanced — with JS off it shows a single line pointing at `/vendors/`, not a link wall, so no-JS readers still have a path; (2) the client builds the target URL with the same slug-sorted ordering as `compare.mjs#comparePath`, so it always lands on a real page, never a reverse-ordered 301; (3) `scripts/gen-redirects.mjs` no longer emits the `/compare/ → /vendors/` 301, because a static page and a redirect for the same path conflict (the redirect would shadow the page). The `-vs-` separator, canonical ordering, and reverse-pair 301s from the 2026-07-08 ADR are unchanged.

## 2026-10-22: ADR: jurisdiction-neutral data model (supersedes the v2.3 uk-sovereign and v2 eu-sovereign categories)
**Context.** The site aims to be the single place to find out what single-tenant LLM hosting exists anywhere, but two of its five categories were geographic (`eu-sovereign`, `uk-sovereign`), which mixed delivery model with jurisdiction and could not scale past two jurisdictions.
**Decision.** `category` is functional only (dedicated-gpu, hyperscaler-dedicated, managed-selfhost). Geography is three separate sourced fields on one hand-extended vocabulary (`src/schemas/jurisdictions.mjs`): `sovereignty.parent_jurisdiction` (ISO 3166-1 alpha-2), `regions` (country, bloc or area codes), and a new optional `sovereign_for`. `sovereign_for` needs a per-code source and the schema requires the parent to be in the jurisdiction (or a member of the bloc), a region there, and verified residency; the per-code source carries the vendor's own sovereignty claim. Mapping: Civo, Nebius, Scaleway to dedicated-gpu; OVHcloud to managed-selfhost. Sovereign for: Civo GB; OVHcloud and Scaleway EU; Nebius none (no claim found; EU parentage alone is not sufficient). Old `?category=eu-sovereign|uk-sovereign` links are rewritten client-side to `?sovereign=EU|GB`. One `/jurisdictions/` index, no per-jurisdiction pages until verified data warrants them.
**Consequences.** `pairDistinctiveness` is unchanged, so seven compare pairs that scored on the geographic category drop below 40 (indexed 75 to 68); jurisdiction differences still score via the jurisdiction dimension. Nebius no longer appears under the old EU sovereignty deep link. A new jurisdiction means adding a line to the vocabulary map; the build fails until it is added.

## 2026-10-22: ADR: overridden compare pairs need written analysis; titles and meta from data
**Context.** Search Console (21 Jul to 20 Oct 2026) showed compare pages carry most impressions and clicks, but at 0.7% CTR, and several threshold-excluded pairs had real demand.
**Decision.** (1) A pair enters `INDEX_OVERRIDES.index` only with a `src/content/pairs/<pair>.md` analysis whose sources are dated (test-enforced both ways). (2) Search titles and meta descriptions are generated from vendor data (`src/lib/titles.mjs`): titles name pricing; descriptions lead with the biggest verified difference and never with an unknown. (3) Pricing is the first data block on vendor and compare pages. (4) Published guides must list dated sources and may declare vendors for profile back-links.
**Consequences.** Indexed compare pages 68 to 83. Re-check CTR, PTU-cluster clicks and the two restored pages after four weeks (2026-11-19).
