# Autopilot operating model

How singletenant.ai runs itself. `OWNERSHIP.md` holds the mandate and the fixed independence rules; this file holds
the machinery. Adopted 2026-11-24 from Simon's autopilot brief (v1, 23 Nov 2026), merged into the 23 Nov ownership
model (ADR 2026-11-24 in `DECISIONS.md`).

## Schedule (Europe/London, root systemd timers on the Minisforum, all `Persistent=true`)

| When | Job | What it does |
|---|---|---|
| Daily 06:50 | `health` | Scripted checks: CI on `main`, outbound source links, live smoke test, 404s, npm advisories. Merges any `autopilot-48h` PR that has qualified (below). Runs Claude only if a check failed, to fix low-risk problems. |
| Thursday 23:20 | search snapshot | `gsc-weekly-snapshot@singletenant.ai`: Search Console and Bing, read-only, saved locally and uploaded to Drive as "singletenant.ai search snapshot YYYY-MM-DD". |
| Saturday 07:40 | `apply` | Weekly research and apply, the rotation re-verify of the 4 profiles with the oldest `last_verified`, search tightening, PRs, then the digest in the watch Doc. |
| First Saturday 09:40 | `monthly` | Content and SEO review, the 45-day re-verification sweep, metrics, outreach drafts, stage gates. |
| First Saturday of Jan, Apr, Jul, Oct, 11:40 | `quarterly` | "State of dedicated LLM hosting" data report from the site's own dated history. |

The wrapper is `vpc-config/scripts/singletenant/autopilot.sh <mode>`; units are in `vpc-config/scripts/singletenant/units/`.
They run as root because only root holds working Claude and `gh` logins; git work runs as `vpc`. Logs go to
`/root/logs/singletenant/`. A lock file means two runs never overlap: a later run waits up to 90 minutes, then gives up
and alerts. Prompts are in `ops/prompts/` (`_rules.md` is prepended to every mode). Prompts are read from `origin/main`,
so changing one is a reviewed change.

## Merge policy

The wrapper decides the route. It takes the stricter of the run's own `.autopilot-risk` and a classification by path:

- **Low risk: merge when CI is green.** Sourced data refreshes, typos, broken-link fixes, metadata tightening and
  corrections. These are edits to existing vendor YAML, pairs, articles and guides, plus `data/`, `docs/` and
  `STATE.md`. Squash-merged as soon as the `ci` workflow passes.
- **Higher risk: label `autopilot-48h`.** A new or removed vendor, a new or deleted page or article, policy or legal
  wording (`/editorial-policy/`, `/methodology/`, `/disclosure/`, `/corrections/`, `/privacy/`, `/terms/`), schema,
  components, layouts, config, monetisation or redesign. The daily job merges it once it is 48 hours old, CI is green,
  it isn't labelled `autopilot-hold`, and it has no comment or review other than the autopilot's own (comments start
  with `[autopilot]`). **Any other comment counts as an objection**, so writing anything on the PR stops it.
- **After every merge** the wrapper waits for the Cloudflare Workers build of the merge commit, then runs
  `npm run smoke` against the live site. On failure it reverts the merge commit on `main` (`git revert`, pushed as
  `vpc`), runs the smoke test again and alerts on Telegram.

GitHub can't enforce any of this. The repo is private on a free plan, so branch protection, required checks and
auto-merge are unavailable (API 403). The wrapper does the enforcing: it never merges unless the PR's `gates` check
is `SUCCESS`. Making the repo public, or upgrading to GitHub Pro, would let GitHub require the checks too.

## Kill switch

- A file `.autopilot-paused` in the repo root, on `origin/main` or in the canonical checkout
  `/home/vpc/projects/singletenant-ai`, pauses everything. Runs log "paused" and take no write action.
- The label `autopilot-hold` on a PR stops the autopilot touching that PR.

## Guardrails on the headless run

- `.claude/settings.json` holds the allowlist (read, edit, web, `npm`/`node scripts`, read-only Search Console). It
  denies git, gh, curl, sudo, `rm -rf`, wrangler, credential paths, Search Console write tools, and Drive
  trash, share and update. It also denies edits to `.github/`, `.claude/settings.json`, `OWNERSHIP.md` and `ops/`,
  so a run can't loosen its own rules. The wrapper adds `--allowedTools`, `--max-budget-usd` and `--max-turns`.
  It never uses skip-permissions.
- Per-run caps: apply $4 / 120 turns; monthly $7 / 200; quarterly $5 / 150; health fix $0.75 / 40; Doc digest and
  Drive upload use Haiku, $0.25 each. The month caps from `OWNERSHIP.md` (Claude $40, DataForSEO $20) are enforced by
  `spend.py` before each run.
- CI (`.github/workflows/ci.yml`) runs the six gates plus `scripts/source-check.mjs`: a vendor field changed in a PR
  must carry a new or re-dated source.

## Reporting

- Each Saturday run appends a digest to the Google Doc "singletenant.ai: weekly watch", directly under the anchor
  paragraph "Applied by Claude Code (autopilot digests, newest first)" near the top. It lists what merged, what's
  waiting 48 hours, what was skipped and why, and "Needs Simon" (money, account, legal or judgement items only). No
  new Google Docs are created.
- Telegram gets a one-message summary per run and an alert on any failure (`OnFailure=notify-failure@`).
- `docs/owner-log.md` gets an entry per run; `STATE.md` holds the metrics and the stage gates.

## Schema changes

New fields (for example an isolation level) only by PR on the `autopilot-48h` route, with the migration, validation and
sourced back-filled values for every vendor in the same PR. A field is never half-populated.
