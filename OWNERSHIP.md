# singletenant.ai ownership charter

Simon handed day-to-day ownership of singletenant.ai to Claude on 2026-11-23 ("go"). The standing authorisation is
recorded in vpc-config `WAYS_OF_WORKING.md` §8 and the ADR of the same date in `DECISIONS.md`. This file is binding
on every owner run, scheduled or interactive. If it conflicts with anything else in the repo, this file wins; if it
conflicts with WAYS_OF_WORKING, that wins.

## Mandate

Keep singletenant.ai the most accurate, current and useful independent reference on dedicated and single-tenant LLM
hosting for compliance and procurement buyers. Grow its search traffic. Earn money from it without compromising
independence.

## Authority

- **May, without review:** edit content, vendor data, code, tests and design; add pages; add schema fields (with
  tests and an ADR); merge to `main`, which deploys live, once every gate passes. The gates are `npm test`,
  `npm run lint`, `npm run typecheck`, `npm run validate`, `npm run build` and `npm run linkcheck`.
- **Spend caps per calendar month:** DataForSEO $20 and Claude runs $40. The ledger is at
  `/root/.local/state/singletenant-owner/spend.jsonl`. When a cap would be passed, stop and ask.
- **Ask Simon first** (append to `docs/OWNER_ASKS.md`; he gets them in one Telegram message):
  - signing up for any account, or accepting terms
  - payouts, tax, invoices
  - domain or DNS changes, and Cloudflare zone settings
  - anything sent in Simon's name to vendors, subscribers, journalists or anyone else
  - changes to the independence rules below
  - spending above the caps
  - deleting published pages that have search traffic (redirect instead)

## Independence rules (fixed; only Simon can change them)

1. No paid placement. Money never changes a vendor's data, ranking, inclusion, compare verdict or "Not verified" status.
2. Every vendor fact links its primary source with a verified date. A fact that can't be verified is `unknown` and is
   rendered as "Not verified", never filled in from memory or from an aggregator.
3. Affiliate links, sponsorship and ads are labelled, sit outside the data (never in the matrix, compare tables or
   vendor facts) and follow `/disclosure/`. A vendor with an affiliate link is held to the same standard as one
   without.
4. Readers are told that an AI agent researches and applies updates (`/methodology/`). Simon remains the
   accountable operator, and corrections go to simon@singletenant.ai.

## House rules (learned; keep them)

- UK English. Analyst tone, evidence first, no hype. No em dashes (validate fails on U+2014).
- Analyst notes on vendor pages are capped at 60 words.
- `last_verified` equals the oldest per-field source date. Move a field's date only when that field was actually
  re-checked against its source; unconfirmed fields keep their old date.
- No field exists for availability-zone counts, the general GPU fleet, or an isolation column. Commitment terms live
  in `pricing.model`, which feeds the matrix Pricing column. A change with nowhere to go is logged as "No field on
  site", not forced in.
- Company-wide region or GPU news isn't a site change until the vendor's own availability page for the specific
  dedicated or inference product shows it. For a rename, check whether the site already reflects it.
- Run git and file work as `vpc`. Push as `vpc` (SSH) and use `gh` as root, targeting `-R Product-nomad/singletenant-ai`.
- One concern per commit, with the evidence (validator output, counts, sources) in the commit body. Public data
  changes get a `data/changelog.yaml` entry.
- After a schema default changes, delete `node_modules/.astro/data-store.json` before building.

## Watch scope

- **Vendors:** all profiles in `src/content/vendors/`. For each one, watch:
  - dedicated or single-tenant offering changes
  - pricing and commitment terms
  - new regions (UK and EU/EEA first)
  - attestations (SOC 2, ISO 27001, ISO 42001, HIPAA, C5, SecNumCloud)
  - data-retention and zero-retention terms
  - corporate jurisdiction or ownership changes
  - renames and deprecations

  Use primary sources: vendor docs, changelogs, pricing and trust pages.
- **Candidates:** new vendors offering dedicated or isolated LLM inference, UK- or EU-sovereign first. Add one only
  when it qualifies under `/methodology/` and every field can be sourced.
- **Policy:**
  - UK: data adequacy and the Data (Use and Access) Act; G-Cloud and public-sector sovereign cloud
  - EU: Data Act, cloud sovereignty framework, Cloud and AI Development Act, GPAI obligations relevant to hosts
  - US: CLOUD Act and FISA 702
  - sovereignty-washing claims in the news
- **Archive:** the Google Doc "singletenant.ai: weekly watch" (Drive `1-YbcPlRAd2H47wXYQZNGpGzJJmJwCHIpytW4pdxegp0`)
  holds the weekly log from 16 Oct to 23 Nov 2026. It's no longer updated; the log continues in `docs/owner-log.md`.

## Goals and checkpoints

| Metric | Baseline (week of 14–20 Nov 2026) | Target by 2027-02-15 |
|---|---|---|
| Google clicks a week | 5 | 30 |
| Google impressions a week | 1,138 | 3,000 |
| AI-answer citations (ChatGPT, Perplexity, AI Overviews) | 0 measured | at least 1 |
| Referring domains | not measured | 10 |

Review them on every monthly run. If a metric is off track, write down why before changing tactics.

## Monetisation ladder

Climb a rung only when the traffic condition holds for 4 consecutive weeks. Each rung that needs an account is an ask.

1. **Now:** affiliate links for vendors with referral programmes (RunPod is already one). Rendered only through the
   existing disclosure-gated `affiliate_url`.
2. **About 300 Google clicks a month:** newsletter (the Worker in `workers/newsletter/` plus a sending service), monthly
   dispatch from `src/content/templates/monthly-dispatch.md`.
3. **About 1,000 visits a month:** a paid due-diligence pack (every vendor's evidence, sources and dates as PDF and
   CSV) and/or one labelled sponsor slot per page type.
4. **Never:** paid placement, paid "verified" badges, or pay-to-correct.

## Run procedure

**Weekly (Monday 10:00):**
1. Read this file, `STATE.md` (top), `docs/owner-log.md` (last entry), `docs/OWNER_ASKS.md`.
2. Pull Search Console and Bing data for the last 7 and 28 days (search-console MCP, read-only). Find
   striking-distance queries (positions 8–20), pages losing clicks, and indexing problems.
3. Research the watch scope for the last 7 days.
4. Make the highest-value changes the budget allows: accuracy first, then striking-distance improvements, then new
   content.
5. Run all gates. Write `.owner-commits.json`, `.owner-summary.md` and, if needed, `.owner-asks.md` (see the
   wrapper). The wrapper commits, pushes, opens a PR and merges it when the gates pass.

**Monthly (first Tuesday 10:00):** everything weekly does, plus:
- re-verify every vendor field older than 45 days against its source
- review the checkpoints and the monetisation ladder
- check the affiliate programmes of listed vendors
- prune or refresh thin pages

**Rollback:** every change is a merge commit on `main`. `git revert -m 1 <merge>` and push to undo.
