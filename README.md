# singletenant.ai

An independent, evidence-linked reference on dedicated and single-tenant LLM hosting: who offers it, where, on what
terms, with which certifications, data-residency commitments and parent jurisdiction.
**Live at [singletenant.ai](https://singletenant.ai).**

> **Phase: Operate.** The site is live and maintained on a schedule. Vendor facts are re-verified against their
> primary sources at least every 60 days. Operating model: [`ops/README.md`](ops/README.md).

## What makes it different

- **Every fact has a source and a date.** Each vendor field links to the vendor's own documentation, terms, pricing
  or trust page, with the date it was checked. The schema and CI refuse a fact without one, and refuse an edited fact
  whose source wasn't re-checked.
- **Gaps stay visible.** Anything that can't be confirmed from a primary source is shown as "Not verified", never
  guessed or filled in from an aggregator.
- **Independent.** No vendor pays for inclusion, placement or wording. The site carries no ads, sponsorship or
  referral links. See the [disclosure](https://singletenant.ai/disclosure/) and
  [editorial policy](https://singletenant.ai/editorial-policy/).
- **Corrections are public.** Every data change is in the [changelog](https://singletenant.ai/changelog/), and every
  correction is in the [corrections log](https://singletenant.ai/corrections/).

## Who makes it

The content is researched, written and maintained by **Claude**, an AI model made by Anthropic, working to the written
rules in this repo ([`OWNERSHIP.md`](OWNERSHIP.md), [`ops/`](ops/)). **Simon Newton** owns the site, set its
direction and is accountable for it. Nothing on the site comes from hands-on testing of vendors' services. More:
[how this site is made](https://singletenant.ai/editorial-policy/#how-made).

## Using the data

The vendor database is open: [singletenant.ai/data](https://singletenant.ai/data/) (CSV and JSON, CC BY 4.0). The
source of truth is one YAML file per vendor in [`src/content/vendors/`](src/content/vendors/), with per-field
`sources[]` (field, URL, verified date). Please attribute "singletenant.ai vendor dataset (CC BY 4.0)".

Found an error? Email simon@singletenant.ai with the page, the claim and the primary source that contradicts it, or
open an issue. Vendors have the same right of reply: see [corrections](https://singletenant.ai/corrections/).

## Licence

- **Data** (vendor YAML, the changelog and the `/data/` downloads): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- **Code and prose:** no licence has been chosen yet, so all rights are reserved for now.

## Development

Astro + Tailwind + MDX, a static build deployed on Cloudflare Workers (static assets). Every push to `main` deploys.

```bash
npm ci
npm run dev          # http://localhost:4321
npm test             # node --test
npm run lint         # Biome
npm run typecheck    # astro check
npm run validate     # vendor schema, changelog, house style
npm run build        # dist/, plus generated _redirects
npm run linkcheck    # internal links (add --external for outbound)
npm run smoke        # live smoke test against https://singletenant.ai
```

CI (`.github/workflows/ci.yml`) runs all of these on every PR, plus `scripts/source-check.mjs`. `main` is protected
and requires the `gates` check.

### Repository map

- `src/content/vendors/*.yaml`: the database. The schema is in `src/schemas/vendor.mjs`.
- `src/content/pairs/`: written analysis for selected compare pairs. `articles/` and `guides/` hold long-form content.
- `data/changelog.yaml`: the public data changelog, which also feeds `/corrections/`.
- `src/pages/`: vendor profiles, compare pages (`compare/[slug].astro`), guides, articles, policies and `/data/`.
- `src/lib/`: pure helpers (compare scoring, titles, JSON-LD, dataset, authorship) with tests in `tests/`.
- `scripts/`: validate, linkcheck, smoke, source-check, redirects, and `render-text.mjs` for reading sources.
- Project records: `STATE.md` (current state), `DECISIONS.md` (ADRs), `CHANGELOG.md` (site changes),
  `THREAT_MODEL.md`, `CONTEXT.md` (domain terms), `docs/owner-log.md` (run log).

### Adding or changing a vendor fact

1. Read the vendor's primary source. If it doesn't clearly state the claim, the value is `unknown`.
2. Edit the YAML and add or update a `sources[]` entry for that field, with today's date. `last_verified` must equal the
   oldest source date on the profile.
3. Add a `data/changelog.yaml` entry (`added`, `updated`, `removed` or `corrected`) with the sources.
4. Run the gates above. House style: UK English, no em dashes, analyst notes of 60 words or fewer.
