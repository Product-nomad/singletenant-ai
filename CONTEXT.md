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
| **Sovereign / EU sovereign** | Hosting under EU jurisdiction and ownership guarantees, marketed for data-sovereignty requirements. The site's differentiator category. |
| **PTU (provisioned throughput unit)** | Azure OpenAI's unit of dedicated capacity. Hyperscaler terms rename constantly — always record the vendor's current term + the date. |
| **Data residency** | Where data can be pinned geographically. A verifiable fact with an evidence URL, not a marketing adjective. |

## Category tags (schema enum — exact slugs)

| Slug | Meaning |
|---|---|
| `dedicated-gpu` | Dedicated GPU / inference clouds (Baseten, Modal, RunPod, …) |
| `hyperscaler-dedicated` | Hyperscaler dedicated capacity (Bedrock provisioned, Azure PTU, Vertex provisioned) |
| `managed-selfhost` | Managed self-host platforms (HF dedicated endpoints, NVIDIA NIM/DGX) |
| `eu-sovereign` | EU sovereign clouds (OVHcloud, Scaleway, Nebius, IONOS) |

## Evidence vocabulary

| Term | Meaning |
|---|---|
| **Verified** | The fact was checked against a primary source (vendor docs, trust centre, pricing page) on the stated date, and the evidence URL is on the page. |
| **Not verified** | Rendered wherever a field is `unknown`. Honest absence — never papered over, never guessed from model memory. |
| **Evidence URL** | The primary-source link every populated fact carries. No evidence URL → the field may only be `unknown`. |
| **Last verified** | The per-section date chip on vendor profiles. Drives the freshness claim; goes stale honestly rather than silently. |
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
