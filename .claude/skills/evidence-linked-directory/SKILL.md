---
name: evidence-linked-directory
description: >-
  Use when building or maintaining a reference/comparison directory where every
  published fact must trace to a primary source — vendor databases, compliance
  matrices, "X vs Y" comparison sites, buyer's guides for regulated audiences.
  Covers the schema-enforced evidence invariant, honest "unknown" handling,
  canonical pair routing, thin-page SEO mitigation, and the traps that bite.
---

# Evidence-linked directory

A reference directory earns trust by making every claim checkable. The design
rule is simple and load-bearing: **a fact is either sourced or it is marked
unknown — never guessed.** Everything below serves that rule.

Distilled from the singletenant.ai v2 build (15-vendor single-tenant LLM hosting
directory: 15 profiles, 105 comparison pages, schema-validated data).

## The evidence invariant (enforce it in code, not in review)

Put the rule in a schema that both the site build and the test suite import, so
it cannot be bypassed by a careless edit:

- Every **populated** fact carries `evidence_url` + `verified` (ISO date).
- A fact with no source must be the literal `unknown` — and `unknown` facts
  **must not** carry an evidence_url (catches copy-paste of a stale source).
- The UI renders `unknown` as "Not verified", never as a blank or an implied
  claim. An honest gap is more useful to a procurement buyer than a guess.
- "Verified" means *the linked page supported the claim on that date* — show
  the date per section so staleness is visible, not hidden.

Back it with tests that assert both directions: a populated fact missing
evidence is rejected, AND an `unknown` fact carrying evidence is rejected. Add
one test that loads *every* data file and validates it, so new entries can't
land unsourced.

## Verify the claim is on the page — not just that the page 200s

A URL returning HTTP 200 is not evidence. The linked page must actually state
the claim. Spot-check the text, not the status code. (See the Databricks BAA
gotcha below for what happens when you don't.)

## Canonical routing for pair/comparison pages

For "A vs B" pages, one unordered pair must map to exactly one URL, or you ship
duplicate content and split link equity:

- Order the pair canonically (e.g. alphabetically by slug) so `a-vs-b` is the
  only generated page; `b-vs-a` 301s to it.
- Forbid the separator token (`-vs-`) inside slugs at the schema level, so the
  route parser can't be ambiguous.
- Generate the reverse-order 301s from the data set (a small script), so the
  redirect list stays in sync with the vendor set instead of being hand-kept.

## Thin-page SEO mitigation

Programmatic pages (N-choose-2 comparisons) risk a "thin content" manual action.
Give each one a **data-derived** differences summary — sentences computed from
the two records' fields (shared vs exclusive certs, residency, jurisdiction,
pricing). Still evidence-bound: `unknown` surfaces as "not verified", never as
invented prose. No hand-written filler.

## Meta references must resolve

Every `<link>`, `og:image`, and `rel=alternate` in the head must point at
something that exists. A feed link to a missing route or an OG image that 404s
is a silent defect on every page. Either build the target or remove the tag —
never ship a reference to a file that was never created.

## Gotchas

**Tail-piping trap — never pipe a gate command through `tail`/`head`.**
`npm run validate | tail` (or `git commit | tail`) reports *tail's* exit code,
which is almost always 0, so a failed validation or a blocked commit looks like
success. This masked two silent commit failures during the build. Run gate
commands bare, check `$?` (or `${PIPESTATUS[0]}`) directly, and confirm the
result independently — e.g. `git log` to prove a commit actually landed.

**Databricks BAA repoint — 200 ≠ evidence.** The HIPAA/BAA cert first cited a
trust page that only said "HIPAA compliance options" — it returned 200 but did
not establish a signed BAA. The fix was repointing `evidence_url` at the
published agreement itself (`databricks.com/legal/baa`). Always confirm the
specific claim appears on the specific page; a nearby, softer statement is not
the same claim.

**Vertex honest unknowns — don't infer from a blog post or a rebrand.** For
Vertex AI Provisioned Throughput, the public GSU price list and regional
availability could not be confirmed from a primary source, so `pricing.public`
and `data_residency_guarantee` were recorded as `unknown` and `regions` left
empty — not back-filled from a marketing blog. The platform was mid-rebrand
("Gemini Enterprise Agent Platform"); the rebrand was noted in prose but never
used to upgrade an unverified fact to a verified one. When the source is a
launch blog rather than docs/terms/pricing, the honest value is `unknown`.
