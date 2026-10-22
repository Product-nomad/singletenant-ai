# singletenant.ai — domain language

Single source of truth for the site's vocabulary. Site copy, vendor YAML, spec work, and public pages must use these terms exactly. If two project docs disagree, this file wins — fix the other place.

## The product

| Term | Meaning | Don't say |
|---|---|---|
| **singletenant.ai** | The site: an evidence-linked reference database of dedicated/single-tenant LLM hosting vendors. Lower-case, one word, with the TLD. | "SingleTenant", "the directory blog", "the Buyer's Brief" (killed v1 framing). |
| **Vendor matrix** | The filterable comparison table that is the site's hero. | "listings", "catalogue". |
| **Vendor profile** | One vendor's page: facts table, evidence links, compliance certs, pricing model, per-section verified dates. | "review" (we don't score), "listing". |
| **Data changelog** | The public `/changelog/` of dated data changes. Distinct from the repo's `CHANGELOG.md`. | "news", "updates blog". |

## Deployment vocabulary

| Term | Meaning |
|---|---|
| **Single-tenant** | Inference infrastructure where the customer's workload runs on capacity not shared with other customers. The umbrella term for the site's scope. |
| **Dedicated** | A vendor's own word for single-tenant capacity (dedicated instances, dedicated endpoints). Use the vendor's current term on their profile, with the date it was recorded. |
| **Multi-tenant** | Shared serverless inference — out of scope except as contrast. |
| **Parent jurisdiction** | The country (ISO 3166-1 alpha-2, e.g. `GB`, never `UK`) where the vendor's parent company is incorporated. The law that can compel the company. |
| **Sovereign for** | A sourced per-vendor field naming jurisdictions (country or bloc) the vendor is sovereign for: parent there, capacity there, residency at least Stated, and the vendor's own sovereignty claim. Never inferred; never a category. Avoid "EU sovereign"/"UK sovereign" as category names. |
| **Region code** | Where compute can run: a country code, a bloc (`EU` = EU/EEA) or an area (`APAC`, `GLOBAL`). Vocabulary in `src/schemas/jurisdictions.mjs`, extended by hand. |
| **PTU (provisioned throughput unit)** | Azure OpenAI's unit of dedicated capacity. Hyperscaler terms rename constantly — always record the vendor's current term + the date. |
| **Data residency** | Where data can be pinned geographically. A verifiable fact with an evidence URL, not a marketing adjective. |

## Category tags (schema enum — exact slugs; functional only, never geographic)

| Slug | Meaning |
|---|---|
| `dedicated-gpu` | Dedicated GPU / inference clouds (Baseten, Modal, RunPod, …) |
| `hyperscaler-dedicated` | Hyperscaler dedicated capacity (Bedrock provisioned, Azure PTU, Vertex provisioned) |
| `managed-selfhost` | Managed self-host platforms (HF dedicated endpoints, NVIDIA NIM/DGX) |

## Evidence vocabulary

| Term | Meaning |
|---|---|
| **Verified** | The fact was checked against a primary source (vendor docs, trust centre, pricing page) on the stated date, and the evidence URL is on the page. |
| **Not verified** | Rendered wherever a field is `unknown`. Honest absence — never papered over, never guessed from model memory. |
| **Evidence URL** | The primary-source link every populated fact carries. No evidence URL → the field may only be `unknown`. |
| **Last verified** | The per-section date chip on vendor profiles, and the headline "Last verified DD Mon YYYY" stamp on vendor, compare and guide pages. A profile's `last_verified` is the *oldest* check behind any of its facts (schema-enforced), so the headline never overstates freshness; compare pages show the older of the two vendors. Goes stale honestly rather than silently. |
| **Sources** | A profile's `sources[]`: every primary source it relies on, rendered as a list on the profile. Must include every fact's evidence URL (schema-enforced). |
| **Primary source** | The vendor's own published material, fetched at build/research time. Third-party writeups and model memory are not primary sources. |

## Voice & tone

- **Analyst, evidence-first, no hype.** Primary reader is compliance/procurement; engineering leads secondary.
- **Claims never exceed the data.** "15 vendors, every fact sourced" beats "comprehensive".
- **No emoji in data UI.**
- **No framework branding in public copy** — methodology-discipline words ("Six Eyes", "WoW", phase names) stay in private docs; `/methodology/` states the discipline in the site's own words.

## What this file is NOT

- Not project status — that's `STATE.md`.
- Not a decision log — that's `DECISIONS.md`.
- Not the data schema — that's the Zod collection in `src/content.config.ts`.
