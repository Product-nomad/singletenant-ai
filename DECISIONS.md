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
