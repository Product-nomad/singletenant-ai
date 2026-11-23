# Owner log

One entry per owner run, newest first: what was checked, what changed (with sources), what was skipped and why,
search data, and spend. The earlier weekly-watch log (16 Oct to 23 Nov 2026) is in the Google Doc
"singletenant.ai: weekly watch".

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

