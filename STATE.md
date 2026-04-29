# singletenant.ai — STATE

**Goal**: A monetised, editorially-credible directory site for single-tenant LLM hosting vendors. Buyer-side resource for B2B teams shopping for compliant inference infrastructure (legal, healthcare, regulated finance, public sector). Revenue from affiliate partnerships + newsletter sponsorships + consulting CTA conversions into Incubate Labs engagements.
**Phase**: Frame → Build (scaffold built, governance gaps to close before launch).
**Status**: private repo, single commit (initial scaffold). 4 vendor profiles, 1 article, theme set. No domain pointed yet, no governance docs, no monetisation infrastructure live.
**Last touched**: 2026-04-29.

## What's done
- Astro 5 + Tailwind 4 + MDX scaffold pushed as `Product-nomad/singletenant-ai` (private).
- Content collection schema (Zod-enforced) for vendors and articles in `src/content.config.ts`.
- Four vendor YAMLs: Baseten, Together AI, RunPod, Modal.
- One MDX article: *What is single-tenant LLM hosting?*
- Programmatic page generation: 4 vendor pages + 12 comparison pages from data alone.
- Editorial design system: Fraunces (display) + Source Serif 4 (body) + JetBrains Mono (data), warm-paper / deep-ink palette with heraldic-red accent.
- README documents the scaffold, build/dev commands, vendor-add workflow, and a launch checklist.

## What's next (run-blockers, in order)
1. **Governance scaffold** to match the rest of the portfolio — `THREAT_MODEL.md`, `DECISIONS.md`, `CHANGELOG.md`, `CONTEXT.md`, plus phase declaration at top of `README.md`. ~1 hour.
2. **Affiliate / privacy / disclosure pages.** UK ASA + US FTC + UK GDPR Article 13 obligations make these blocking before any affiliate link goes live. The Header currently links to `/privacy/`, `/terms/`, `/disclosure/` but the pages don't exist. ~2-3 hours to draft.
3. **Outcome metrics.** What does "monetised" mean specifically — newsletter subscribers by month X, first affiliate conversion by month Y, partnership signed by month Z. Pin numbers per WoW §11 before advancing past Frame.
4. **Vet "Edited by Simon Wilson" attribution in README.** If not the user's actual full name, fix before the repo goes public — likely a scaffold-side conflation with Simon Willison, the AI commentator.
5. **Add 6 more vendors** to push the comparison surface from 16 → 56 pages: Cerebrium, PremAI, Anyscale, Lambda Labs, Fireworks, AWS Bedrock (per the README's own roadmap).
6. **Set up Buttondown account** and update `BUTTONDOWN_USERNAME` in `NewsletterSignup.astro`. Without this the form 404s on submit.
7. **Cloudflare Pages connection + custom domain** at `singletenant.ai`. DNS to Cloudflare nameservers, Pages target build command `npm run build`, output dir `dist`, framework preset Astro.
8. **Cloudflare Email Routing** — set up `simon@singletenant.ai`, `partnerships@`, `editor@`, `hello@` aliases per the README's checklist.
9. **Cloudflare Web Analytics token** — uncomment the script tag in `BaseLayout.astro` once the token is in hand.
10. **Search Console + Bing Webmaster Tools** — verify domain, submit sitemap, schedule a re-check 7 days after first index.

## Open questions
- **Editorial cadence and review process.** `last_reviewed` is mandatory in the schema (good), but who actually re-reviews the YAML, and how often? If the answer is "Simon, when he remembers," the data drifts and the directory loses credibility. Concrete proposal: monthly cadence, tracked in `CHANGELOG.md`.
- **Correction process.** A vendor will at some point dispute a claim on their profile page. What's the documented turnaround? `disclosure` page should mention it, plus an `editor@singletenant.ai` channel.
- **Affiliate disclosure placement.** UK ASA wants disclosure on every page where an affiliate link appears, not just buried in a footer. Per-vendor-page banner, or per-link inline marker, or both?
- **Programmatic-SEO risk vs editorial depth.** Google manual-actions are real for thin programmatic pages. The 12-and-growing comparison pages need genuine editorial value (signed paragraphs, opinion, not just data tables side-by-side) or they're a downside risk to the brand.
- **Relationship to `incubatelabs.ai`.** singletenant.ai's `ConsultingCTA` block is presumably pointing at Incubate Labs engagements. Need to wire that through and decide which engagement(s) the CTA pitches — probably the Local-LLM Pilot is the natural fit, but VPC / sovereignty advisory could also slot in.
- **`compare/{a}-vs-{b}` URL pattern footgun.** README acknowledges that a vendor slug containing `-vs-` would break the comparison routing. Worth recording as an ADR with the chosen mitigation (rename slug, or change separator, or both).

## Key files
- `README.md` — comprehensive scaffold doc + launch checklist.
- `src/content.config.ts` — Zod schemas for vendors and articles. Authoritative list of allowed `deployment_options` and `compliance` values.
- `src/content/vendors/*.yaml` — the database. One file per vendor.
- `src/pages/vendors/[slug].astro` — generates one vendor profile page per YAML.
- `src/pages/compare/[slug].astro` — generates one comparison page per pair.
- `src/components/ConsultingCTA.astro` — inline + block versions of the consulting pitch (target: Incubate Labs).

## Phase against WAYS_OF_WORKING

Currently **Frame → Build**. Frame artefacts (threat model, outcome metrics, decision log) are incomplete; Build artefacts (scaffold, schema, content) are partially shipped. The right discipline is to **finish Frame before pushing further on Build** — without metrics, the project has no honest test for "is the monetisation working?"
