<!--
MONTHLY DISPATCH TEMPLATE (not published)

This file lives in src/content/templates/, which is not a configured content
collection, so Astro does not build or route it. It is a working template for
the end-of-month email/note, not site content.

How to run it at month end:
1. Set the range: the reporting month, e.g. 2026-07-01 to 2026-07-31.
2. Changes this month: open data/changelog.yaml and copy every entry whose
   date falls in the range. Each changelog entry already carries the vendors
   it touched and a factual, source-checked summary, so no rewriting is
   needed. List them newest first, the same order the file uses.
3. Vendor moves worth noting: from those entries, pull out anything a reader
   would act on (a new tier, a corrected fact, a newly verified region). If
   nothing material changed, say so plainly.
4. Analyst observation: one short, factual paragraph. It must rest on the
   month's verified data or a primary source you can link. No predictions,
   no adjectives without evidence.
5. Link to the changelog and send. Do not publish this file to the site.

Writing rules: analyst tone, UK English, no em dashes, and every factual
claim about a vendor links to its profile on the site or a primary source.
-->

# singletenant.ai monthly dispatch: {{ MONTH YYYY }}

Reporting range: {{ YYYY-MM-01 }} to {{ YYYY-MM-DD }}

## Changes this month

<!-- Paste the changelog.yaml entries dated within the range, newest first.
     One bullet per entry: date, type, vendors, and the entry summary. -->

- {{ YYYY-MM-DD }} ({{ added / updated / corrected / removed }}):
  {{ vendors }}. {{ changelog summary }}.

## Vendor moves worth noting

<!-- The subset of the above a reader would act on. If nothing material
     changed this month, write: "No material vendor moves this month." -->

- {{ vendor }} ({{ /vendors/<slug>/ }}): {{ what changed and why it matters }}.

## One analyst observation

<!-- A single factual paragraph grounded in this month's verified data or a
     linked primary source. No speculation. -->

{{ observation }}

## Full history

Every change to the vendor database, with dates and sources, is on the public
changelog: {{ https://singletenant.ai/changelog/ }}
