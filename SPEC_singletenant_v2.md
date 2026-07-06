# SPEC_singletenant_v2 — Redesign & Repositioning

> Target executor: Claude Code, headless on VPC (Minisforum), bypassPermissions.
> Repo: `~/brain/projects/singletenant-ai` — Astro 5 + Tailwind 4 + MDX (`Product-nomad/singletenant-ai`, private).
> Governing document: **`~/WAYS_OF_WORKING.md` (WoW) wins over this spec** where they conflict — fix the spec, don't improvise.
> Updated 2026-07-06: aligned with WoW + portfolio conventions; deltas listed at the bottom.

---

## 0. Engagement rules (ways of working, applied)

- **Phases (WoW §9):** this build is Build → Validate → Operate for the v2 reposition. `README.md` declares the current phase at the top and it moves honestly. Piece 0 closes the outstanding **Frame-phase governance gap** (see piece table) before any restyle work.
- **Branch & deploy (WoW §5):** all v2 work happens on a **`v2` branch**; Cloudflare Pages preview deployments are the dev surface. `main` = production. **Merging to main is the ship action (piece 12)** — do not drip half-a-reskin onto the live domain piece by piece. Note: repo is currently checked out on `fix/cloudflare-deploy` — reconcile/merge that into `main` during piece 0 before branching `v2`.
- **Push authorisation (WoW §8):** this spec is the per-scope approval to push the `v2` branch to `Product-nomad/singletenant-ai` for the duration of the build. Merging `v2 → main` (= production deploy) needs a fresh explicit go from Simon at piece 12. No other remotes, no other repos under this authorisation.
- **Commits:** one concern per commit (WoW §6). Conventional prefixes as in the piece table. **Commit body carries the evidence** — paste the verification output (grep counts, validator output, page counts) that proves the DoD, the way the dosh repo embeds replay numbers in commit messages. Keep the standard agent trailers (Co-Authored-By + session link).
- **Tests (WoW §1, §7):** `node --test` is the runner; tests live next to what they cover. TypeScript strict. **Biome** for lint+format; **lefthook** pre-commit running typecheck + tests + lint — installed in piece 0, so no broken code enters v2 history. The Zod schema in `src/content.config.ts` is the **single source of truth** for vendor data validation — the validator extends it rather than duplicating rules in another language (no parallel Python validator).
- **Real data only (WoW §2):** every vendor fact from primary sources fetched at build time; a fact that can't be verified is `unknown`, rendered as "Not verified" — never a value from model memory. This is the same rule as spec §5/§6; WoW §2 is the reason it's non-negotiable.
- **Executor hygiene:** run file-touching work as user `vpc` (root-created files break the vpc-owned services and git). If git complains about dubious ownership when run as root, that's the signal you're the wrong user — don't add `safe.directory` exceptions.
- **Session protocol (WoW §12):** on session open, read `PROJECTS.md` + this repo's `STATE.md`/`DECISIONS.md` before acting. On session close, update `CHANGELOG.md`, `DECISIONS.md`, `PROJECTS.md`, and summarise per project.
- **Vocabulary (WoW §13):** `CONTEXT.md` (created in piece 0) is the single source of truth for domain terms (single-tenant, dedicated, sovereign, PTU, data residency…). The public `/methodology/` page states the discipline **in the site's own words — no framework branding** (WoW §10): "Six Eyes", "WoW", phase names etc. stay in private docs only.

## 1. Context & goal

singletenant.ai v1 launched May 2026 as an editorial "Buyer's Brief" (Fraunces/Source Serif, Issue 01 framing). Diagnosis (July 2026): aesthetic reads as personal blog, not reference source; 4 vendors vs "comprehensive" claim; data stamp 10 weeks stale; newsletter cadence promised but not kept.

**Goal:** reposition as a credible, evidence-linked reference database for dedicated/single-tenant LLM hosting, aimed at compliance and procurement buyers in regulated industries. Monetisation (affiliate, consulting CTA) stays but is secondary to credibility.

## 2. Decisions locked (do not reopen during build)

Record this table verbatim into `DECISIONS.md` (dated) in piece 0 — locked decisions live in the decision log, not only in a spec that may drift (WoW §9).

| # | Decision | Locked answer |
|---|---|---|
| 1 | Product identity | **Data product.** Filterable vendor matrix is the hero. Articles support the data, not vice versa. |
| 2 | Scope | Four deployment categories, tagged: dedicated GPU/inference clouds; hyperscaler dedicated capacity; managed self-host platforms; EU sovereign clouds. Sovereignty is the differentiator. |
| 3 | Primary reader | Compliance/procurement primary; engineering leads secondary. Tone: analyst, evidence-first, no hype. |
| 4 | Freshness | Phased. v2 = manual review + visible changelog. Automated collectors (data-platform pattern) are explicitly **out of scope** for v2 — note in STATE.md as v3 candidate. A **report-only drift watch** (piece 14) is in scope: it checks, it never writes data. |
| 5 | Stack | Keep Astro 5 + Tailwind 4 + YAML→programmatic page generation. Reskin + IA change, not a rebuild. |
| 6 | Success metric | Backlinks + returning visitors at 90 days. Consulting enquiries = lagging indicator. **Value checkpoint numbers (WoW §11) — proposed, Simon to confirm/amend at piece 0:** ≥10 referring domains; ≥15% returning-visitor share; ≥1 unsolicited consulting enquiry, all at 90 days post-launch. |
| 7 | Newsletter | **Killed.** Remove all signup UI, copy, and cadence promises (incl. `NewsletterSignup.astro` + Buttondown reference). Redirect/410 any newsletter route. Update STATE.md's revenue framing — "newsletter sponsorships" is no longer a revenue line. |
| 8 | Vendor count | **15 at v2 launch.** |

## 3. Information architecture

```
/                 → hero = comparison matrix (filterable) + 1-line positioning + changelog strip ("3 changes this month")
/vendors/         → full matrix (same component, expanded) + category filter tabs
/vendors/[slug]/  → vendor profile: facts table, evidence links, compliance certs, pricing model, last-verified date per section
/compare/[a]-vs-[b]/ → programmatic comparison pages (15 vendors = 105 pages)
/changelog/       → dated data-change log, newest first
/analysis/        → existing article(s) live here; no cadence promise anywhere
/methodology/     → how data is gathered, what "verified" means, inclusion criteria, correction process
/about/           → who runs it, contact, consulting CTA
/privacy/ /terms/ /disclosure/ → compliance pages (outstanding v1 blockers)
```

Kill: "Issue 01 / The Buyer's Brief" framing everywhere. Kill newsletter route and components.

## 4. Design system

**Direction:** data-product utilitarian. References: Artificial Analysis, db-engines, Vanta trust pages. NOT: magazine, NOT generic SaaS gradient-hero.

- **Type:** Inter (UI/prose) + JetBrains Mono (data values, certs, prices, dates). Self-host via fontsource. Remove Fraunces + Source Serif 4.
- **Colour:** near-black `#111` on off-white `#FAFAF8`. Single accent for interactive elements + category tags — use a restrained blue `#2456D6`. Category tag colours: 4 muted hues, defined once as Tailwind tokens. No gradients. No emoji anywhere in data UI (remove 📍).
- **Tables:** dense, bordered-bottom rows, sticky header, mono for values, sans for labels. Tables are the brand.
- **Components:** `VendorMatrix` (filterable table), `EvidenceLink` (external link + domain shown), `CertBadge` (links to source), `ChangelogEntry`, `LastVerified` (per-section date chip), `CategoryTag`.
- **Dark mode:** deferred to v3. Do not build.
- **Accessibility (WoW §10):** colour is never load-bearing — category tags carry a text label, not just a hue; matrix filters keyboard-operable; contrast per the Lighthouse a11y ≥ 90 gate in piece 12.

## 5. Data model — vendor schema v2

Every factual field carries an evidence URL and verified date. A field without evidence renders as "Not verified" — never as an unsourced claim. This is the Integrity gate in code.

**Enforcement:** schema v2 is defined **once**, as the Zod content collection schema in `src/content.config.ts` (already the repo's authoritative validation point). `astro build` therefore refuses malformed vendor YAML. A `node --test` suite covers the schema invariants (evidence_url required wherever a fact is populated; `unknown` permitted only without an evidence_url; date fields ISO). "Write the validator" in piece 6a means: extend the Zod schema + tests, and add `npm run validate` (schema check without full build) for the sub-agent merge gate.

```yaml
slug: baseten
name: Baseten
category: dedicated-gpu        # dedicated-gpu | hyperscaler-dedicated | managed-selfhost | eu-sovereign
tagline: ""                    # ≤ 12 words, factual
deployment_models: []          # e.g. [dedicated-endpoint, vpc-peering, self-hosted]
regions: []                    # ISO region strings; note EU-only flags
compliance:
  - cert: SOC2_TYPE2           # enum: SOC2_TYPE2, ISO27001, HIPAA_BAA, GDPR_DPA, C5, SecNumCloud, FEDRAMP...
    evidence_url: ""           # vendor trust centre / audit page — REQUIRED
    verified: 2026-07-XX       # date Claude/Simon last checked — REQUIRED
pricing:
  model: ""                    # e.g. per-GPU-hour, provisioned-throughput-unit, per-replica
  public: true|false
  evidence_url: ""
  verified: 2026-07-XX
sovereignty:
  data_residency_guarantee: true|false|unknown
  parent_jurisdiction: ""      # e.g. US, FR, DE
  evidence_url: ""
  verified: 2026-07-XX
notes: ""                      # analyst note, ≤ 60 words, no adjectives without evidence
affiliate_url: ""              # optional; renders only if /disclosure/ exists
```

## 6. Vendor target list (15)

Retain/migrate the existing 4 v1 vendors into schema v2 first — the repo's `src/content/vendors/` currently holds `baseten`, `modal`, `runpod`, `together-ai`; re-enumerate at piece 0 rather than trusting this spec. Then extend to 15 total from this candidate bench, keeping category balance roughly 6/3/3/3:

- **Dedicated GPU/inference:** Baseten, Modal, Fireworks AI, Together AI, Anyscale, CoreWeave, Lambda, RunPod
- **Hyperscaler dedicated:** AWS Bedrock provisioned throughput, Azure OpenAI provisioned (PTU), GCP Vertex AI provisioned
- **Managed self-host:** Hugging Face Inference Endpoints (dedicated), NVIDIA NIM / DGX Cloud — **bench is one short for a 3-slot category**: research a third candidate from primary sources during piece 6 (do not invent one from model memory); if none qualifies under the inclusion criteria, rebalance to 6/3/2/4 and say so in `/methodology/`.
- **EU sovereign:** OVHcloud AI, Scaleway, Nebius, IONOS AI

Rules: every field researched from **primary sources** (vendor docs, trust centres, pricing pages) via web fetch at build time. No field filled from model memory (WoW §2). If a fact can't be verified, mark `unknown` + omit evidence_url — the UI renders honesty, not gaps papered over.

## 7. Pieces (commit per piece; lefthook runs typecheck + tests + lint before each commit; push `v2` after each piece)

| # | Piece | Definition of done | Commit msg |
|---|---|---|---|
| 0 | Recon + governance + baseline snapshot | `main`/`fix/cloudflare-deploy` reconciled, `v2` branched; STATE.md rewritten (incl. revenue framing per decision 7); **governance scaffold closed**: `DECISIONS.md` (with §2 table recorded), `CHANGELOG.md`, `THREAT_MODEL.md`, `CONTEXT.md`, phase marker atop README; Biome + lefthook + `node --test` wired (`npm test` green); value-checkpoint numbers confirmed with Simon; `docs/example_runs/v2-baseline/` contains screenshots + `wget -r` snapshot of live v1; existing vendor YAMLs enumerated in STATE.md | `chore: v2 baseline, governance scaffold, tooling` |
| 1 | Schema v2 + migrate existing vendors | Zod schema v2 in `content.config.ts`; all 4 existing YAMLs migrated; schema tests pass; build passes | `feat(data): vendor schema v2 + migrate v1 vendors` |
| 2 | Design tokens + fonts | Fraunces/Source Serif absent from repo (`grep -ri fraunces src/ \| wc -l` = 0); Inter + JetBrains Mono self-hosted; tokens in Tailwind config | `feat(design): v2 tokens, Inter + JetBrains Mono` |
| 3 | Shell restyle + kill Issue/newsletter | `grep -ri "issue 01\|newsletter\|every tuesday\|buttondown" src/ \| wc -l` = 0; `NewsletterSignup.astro` deleted; newsletter route redirects to `/changelog/` | `feat(shell): v2 nav/footer, remove editorial framing + newsletter` |
| 4 | VendorMatrix component | Homepage renders filterable matrix from YAML; filters by category + compliance cert work with JS disabled falling back to full table | `feat(matrix): filterable vendor comparison matrix` |
| 5 | Vendor detail template | Detail page renders EvidenceLink + LastVerified per section; unverified fields render "Not verified" | `feat(vendor): evidence-linked detail template` |
| 6a–6k | Vendor research ×11 (one commit each) | Each new YAML: 100% of populated fields have evidence_url + verified date; `npm run validate` passes (6a adds the validate script + schema tests per §5) | `data(vendor): add <slug>` |
| 7 | Changelog system | `data/changelog.yaml` drives `/changelog/` + homepage strip; static "last data review" stamp removed sitewide; repo `CHANGELOG.md` cross-references site changelog for data changes | `feat(changelog): data change log replaces static stamp` |
| 8 | Compliance pages | `/privacy/` (UK GDPR Art 13 / ICO framing), `/terms/`, `/disclosure/` (UK ASA CAP Code + US FTC — disclosure visible on every page an affiliate link renders, not footer-only) live; correction process documented on `/methodology/` with `editor@singletenant.ai` contact; affiliate links render disclosure notice; footer links present | `feat(legal): privacy, terms, affiliate disclosure` |
| 9 | Regenerate comparison pages | 105 compare pages build (`find dist/compare -name index.html \| wc -l` = 105); each uses v2 matrix rows; ADR recorded for the `-vs-` slug separator footgun + chosen mitigation | `feat(compare): regenerate 15-vendor comparison pages` |
| 10 | Integrity copy audit | No claim in copy exceeds the data: `grep -ri "comprehensive\|all major\|read by" src/` returns only lines rewritten to verifiable phrasing; "Edited by Simon Wilson" attribution verified as the user's actual name or fixed (STATE.md blocker #4) | `fix(copy): claims match data (integrity pass)` |
| 11 | SEO/meta + redirects | Sitemap regenerated; meta descriptions match new positioning; old removed routes 301 via `_redirects` | `feat(seo): v2 meta, sitemap, redirects` |
| 12 | Validate + ship | `docs/example_runs/v2-launch/` with screenshots, Lighthouse ≥ 90 perf/SEO/a11y, validator output; **security-review skill pass logged even if clean** (WoW §11); **explicit go from Simon → merge `v2` → `main`**; live 301s + matrix render spot-checked on production URL and snapshotted | `release: v2.0.0` |
| 13 | Skill + lessons + portfolio close-out | `~/.claude/skills/evidence-linked-directory/` created with Gotchas section **and `SKILLS-INDEX.md` updated** (WoW §14); lessons appended to STATE.md; `PROJECTS.md` + `CHANGELOG.md` + `DECISIONS.md` updated per WoW §12 | `docs: capture skill + lessons learned` |
| 14 | Drift watch (report-only) | `~/bin/singletenant-review.sh` + user-level `singletenant-review.timer` (weekly, Sun): runs `npm run validate` + HTTP-checks every `evidence_url` (status + redirect drift) against the frozen vendor set, Telegrams summary (token from `~/.hermes/.env`, existing chat) — mirrors the dosh weekly-review pattern; **report-only: it never edits data** (decision 4 stands); stale findings become manual changelog entries | `feat(ops): weekly evidence drift watch` |

Sub-agent use (Phase 3): pieces 6a–6k are independent — parallelise vendor research across sub-agents, one vendor each, `npm run validate` as the merge gate.

## 8. Six Eyes gates *(private-design vocabulary — never in public copy, WoW §10)*

| Eye | Gate applied |
|---|---|
| Attention | Piece 0 recon before any change — see what exists, don't overwrite blind |
| Emotion | Copy audit strips analyst-hype adjectives; tone stays flat and factual |
| Framing | "Data product, not magazine" — any piece drifting editorial gets stopped |
| Structure | Schema v2 forces evidence per claim; the Zod schema + tests are the structural check |
| Contrast | Piece 10 rereads every claim against the data it sits above |
| Integrity | No field from model memory; unknown rendered as unknown; disclosure page before any affiliate link renders |

## 9. Gotchas / out of scope

- **Do not** fill vendor facts from training data — hosting pricing and cert scopes change monthly; fetch primary sources at build time.
- **Do not** build dark mode, automated collectors, or GitLab-style API — v3 candidates, log in STATE.md.
- Hyperscaler dedicated offerings rename constantly (PTU vs provisioned throughput); record the vendor's current term + date.
- RunPod is an existing affiliate — piece 8 must land **before** any piece 6 work exposes its affiliate link, or sequence the RunPod migration after piece 8.
- Cloudflare Pages: verify redirects file syntax (`_redirects`) actually deploys — verify on the `v2` **preview** deployment first, snapshot the live 301s in piece 12.
- 105 compare pages: check build time doesn't blow Cloudflare Pages limits; if slow, memoise matrix data load.
- **Thin-page SEO risk** (from STATE.md open questions): 105 programmatic compare pages with no editorial value risk a Google manual action. Each compare page needs at least a data-derived differences summary (generated from the YAML deltas — still evidence-bound, no invented prose).
- **No framework branding in anything public** (WoW §10): methodology page, meta descriptions, README if the repo ever goes public.
- **Run as `vpc`**, not root — root-owned files in the repo break the user's tooling; `git` "dubious ownership" errors mean wrong user, not a config gap.

---

## Appendix: deltas from the 2026-07-06 draft (review notes)

1. **WoW made governing** (§0) — the draft never referenced `~/WAYS_OF_WORKING.md`; STATE.md already binds this project to it ("per WoW §11").
2. **Branch/deploy model corrected** — draft's "push immediately, auto-deploys" would ship a half-migrated live site for the duration of the build. v2 branch + Pages preview; merge-to-main is the ship action and needs an explicit go (WoW §5, §8 informed-consent).
3. **Python validator replaced** with the repo's existing Zod schema as single source of truth + `node --test` (WoW §1, §7 — one tool, and the schema already exists in `content.config.ts`).
4. **Governance scaffold pulled into piece 0** — THREAT_MODEL/DECISIONS/CHANGELOG/CONTEXT + README phase marker were already STATE.md run-blocker #1 and the draft skipped them.
5. **Value checkpoints quantified** (decision 6) with proposed numbers to confirm — STATE.md blocker #3 required pinning these before advancing.
6. **Piece 14 drift watch added** — WoW §11 requires weekly drift monitoring; implemented report-only to respect locked decision 4, reusing the proven dosh-review timer + Telegram pattern.
7. **UK regulatory surface named** in piece 8 (ICO/UK GDPR Art 13, ASA CAP Code; FTC for US) per WoW §3/§10, plus the correction-process open question from STATE.md resolved into `/methodology/`.
8. **Known repo facts folded in**: 4 v1 vendors enumerated; repo currently on `fix/cloudflare-deploy`; managed-selfhost bench is one candidate short; "Simon Wilson" attribution check added to piece 10; `-vs-` slug ADR added to piece 9; Buttondown/`NewsletterSignup.astro` named in piece 3.
9. **Evidence-in-commit-body convention** adopted from the dosh workflow — DoD verification output goes in the commit message, making the git log the audit trail.
10. **Thin-page SEO risk** promoted from STATE.md open question to an explicit gotcha with a data-derived mitigation.
