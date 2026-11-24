# Owner log

One entry per owner run, newest first: what was checked, what changed (with sources), what was skipped and why,
search data, and spend. The earlier weekly-watch log (16 Oct to 23 Nov 2026) is in the Google Doc
"singletenant.ai: weekly watch".

## 2026-11-24: autopilot set-up (interactive; Simon's autopilot brief v1)

Simon chose to merge the brief into the 23 Nov ownership model (the Saturday run does its own research) and to have no
affiliates for now. Done: CI with a source check (#14); the watch-doc audit (#15, nothing outstanding); three policy PRs
on the 48h route (#16 editorial standards, #17 corrections and log, #18 independence and monetisation); this PR
(#19: ops manual, prompts, permissions, smoke test, render-text helper). The snapshot upload is fixed through the
Drive connector and moved to Thursday 23:20. Autopilot timers are installed and the Mon/Tue owner timers retired.
The first digest is in the watch Doc under the "Applied by Claude Code" anchor.

Dry runs: health (twice; they found false objections from the Cloudflare bot's PR comment and an npm audit parsing
bug, both fixed) and apply ($0.99, 42 turns). The apply dry run found Civo's tagline unsupported by its Cloud GPU page,
and AWS Service Terms 1.24.2 allowing cross-region inference for generative AI services (check whether it weakens
Bedrock PT's "contractual" residency). Both were discarded with the dry run and are left for the 28 Nov apply run and
the 5 Dec monthly review. npm audit: 11 high and 1 critical advisories in build-time dependencies. The critical one
(Astro `define:vars` XSS, server islands) isn't reachable: the site uses neither. An Astro 5 to 7 upgrade goes on the
48h route.

**Spend:** Claude dry runs about $1.50 plus uploads about $0.02 (ledger); DataForSEO $0.

## 2026-11-24: catch-up audit of the weekly-watch Doc (autopilot brief, Phase 1)

Checked all 34 items logged from 19 Oct to 23 Nov against `main`, PRs and branches. Six were already applied (PRs #6, #7, #9). The rest are either NO FIELD ON SITE or conditional items whose condition the site doesn't meet (it never quoted RunPod rates, never called Together's dedicated inference beta, never said Chat Completions only, and never mentions the Cloud and AI Development Act). No data edits, so no source dates moved. The full table is in `STATE.md` under "Watch-doc audit (2026-11-24)".

**Spend:** DataForSEO $0. Claude: interactive session, not metered by the ledger.

## 2026-11-23 (later): residency vs sovereignty article upgrade

**Why:** UK demand for the site's core topic is far above anything else it targets: "data sovereignty" 880 a month,
"data sovereignty vs data residency" 30 and "data residency vs data sovereignty" 20 (DataForSEO, Oct 2026). The
article ranked about 82 for those, and page 1 is generic blog posts and LinkedIn posts with no data. "Sovereign AI"
(2,900 a month) was rejected as a target: its page 1 mixes the UK government's Sovereign AI unit, companies called
"Sovereign AI" and foreign-language pages.

**Changed** (`/blog/residency-vs-sovereignty/`, now MDX, `updated` 2026-11-23):
- An at-a-glance table of the three concepts.
- A live section from the vendor data (`ResidencyTable.astro`, counts from `src/lib/residency.mjs`, tested): 7 of 16
  hosts commit to residency contractually, 4 of those 7 have a US parent, and 5 offer a UK region, but only Civo is
  sovereign for the UK.
- A "Common questions" FAQ. The UK GDPR transfers answer cites the ICO guide (updated 15 Jan 2026, read today).
- Corrected the claim that Civo is "the one vendor whose parent jurisdiction and residency guarantee point at the
  same place". OVHcloud and Scaleway are French-parented with contractual EU residency, and Civo's residency is
  Stated, not guaranteed.
- New meta description.

**Checked, no change:** the four stub guides are already `noindex, follow`; Baseten vs Together AI already has a
written analysis.

**Spend:** DataForSEO about $0.08 (volumes and 2 SERPs).

## 2026-11-23: first owner run (interactive, set-up day)

**Search data** (Google, 24 Oct to 20 Nov; week of 14–20 Nov: 5 clicks, 1,138 impressions, average position 16.7):
- `/guides/provisioned-throughput-vs-pay-per-token/`: 290 impressions at position 1.6 to 4.7 and no clicks, almost all
  on one exact long phrase plus "reddit", "free", "review" and "2026" variants. That pattern looks like rank trackers
  or AI fan-out queries, not people. No change made.
- `/guides/azure-openai-ptu-explained/`: real definitional demand ("azure ptu" 23 at 26.7, "ptu azure" 13 at 9.2,
  "what is ptu in azure" 11 at 9.5, "ptu meaning ai", "provisioned throughput units"). Its 121-character title was
  cut off in results.
- "provisioned throughput bedrock" and related searches spread across about 12 Bedrock-vs-X compare pages (positions
  24–91) instead of the guide. Compare pages didn't link guides.
- Striking distance: "what makes baseten different from traditional cloud ai platforms?" → `/vendors/baseten/`
  (8.1, 19 impressions); "together ai vs baseten" / "baseten vs together ai" → `/compare/baseten-vs-together-ai/`
  (about 8.5). Not changed this run; candidates for next week.

**Changed:**
- Compare pages list the published guides covering either vendor (`src/lib/guides.mjs`, shared with vendor pages;
  test added). The Bedrock and Azure PTU guides now collect links from their 28 compare pages.
- Azure OpenAI PTU guide: title "Azure OpenAI PTU: what a provisioned throughput unit is" (55 characters, was 121),
  a definition-first description, and an "In short" answer quoting Microsoft's billing page (re-read today:
  https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput-billing). No facts were
  added, so source dates are unchanged.
- Bedrock guide title is 59 characters (was 77).
- Together AI notes: placement can be restricted to named regions or region patterns at deploy time; the docs list no
  EU or UK region (https://docs.together.ai/docs/dedicated-endpoints/manage, checked 2026-11-23). Regions stay not
  verified; residency stays Stated. Public changelog entry added.

**Checked, no site change** (from the last weekly-watch entry): Google Gemini 4 Neon on Provisioned Throughput,
the Deferred tier and model list (no field); OVHcloud AI Summit (no AI Deploy page confirms B300 or SecNumCloud for
AI Deploy); Databricks model retirements and system-table retention (no field); EU Cloud and AI Development Act
Council progress report (a draft, not law).

**Set-up:** ownership charter, ADR and `/methodology/` disclosure merged in PR #8. Weekly (Mon 10:00) and monthly
(first Tue 10:00) owner runs scheduled; pipeline smoke-tested twice. Cloud weekly-watch routine disabled.

**Spend:** Claude $0.26 (two smoke tests; this session isn't metered by the ledger). DataForSEO $0.

