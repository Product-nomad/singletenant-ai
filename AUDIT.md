# singletenant.ai reposition audit, 2026-10-17

The audit for the `reposition/2026-10` branch, which turns the site into an independent reference site rather than a sales site. It covers the live `main` build (`d699cf2`, 153 pages) as it stood before any change on this branch. Method: the built `dist/` was scanned by script (word counts of `<main>`, promotional-phrase grep, visible-date detection, JSON-LD types, duplicate title and description check), `scripts/linkcheck.mjs --external` was run, and the vendor YAML was read field by field. Compare pairs were scored with `pairDistinctiveness` in `src/lib/compare.mjs`. The same function drives the noindex decision at build time, so this document and the site cannot drift apart.

Each finding notes what this branch does about it (**Fix**) or says that it needs a decision from Simon (**Decision**).

## 1. Pages

### 1.1 Self-promotion, services and consulting copy

| Where | What | Fix |
|---|---|---|
| `Header.astro` | "Consulting" is the accent-coloured last item in the main nav on every page | Removed |
| `Footer.astro` | "Consulting" link in the About column on every page | Replaced with "Contact" and "Editorial policy" |
| `ConsultingCTA.astro` | "Need a second opinion? ... I also consult on AI delivery ... Book a 30-min call" block | Component deleted |
| `/` (homepage) | ConsultingCTA directly under the vendor matrix | Removed |
| All 16 vendor profiles | ConsultingCTA at the foot of the facts | Removed |
| All 120 compare pages | ConsultingCTA above "Read the full profiles" | Removed |
| All 6 articles (`ArticleLayout`) | ConsultingCTA after the article body | Removed |
| `/contact/` | Titled "Consulting & Contact": "Get a second opinion", 30-minute call agenda, free discovery call versus paid fixed-fee "Vendor selection" engagement, "Who I work with", "SC clearance eligible" | Rewritten as a plain contact page (corrections, vendor submissions, press), with no services |
| `/about/` | "Talk to us" section invites "consulting requests" and links to "the consulting page" | Rewritten: editorial standards, independence statement, short founder note |
| `/privacy/` | Email processing lists "consulting enquiries" | Removed. The newsletter section now appears only when the newsletter flag is on |

Text hits for "services" in `/blog/sovereignty-washing/`, `/blog/uk-buyer-position/`, `/vendors/nvidia-nim/` and `/changelog/` are subject matter ("cloud services", "services provided by"), not self-promotion. No change.

### 1.2 Thin or duplicate content

- **Compare pages (120)**: 391 to 612 words in `<main>`, and most of that is shared template text: the generic description sentence, the section headings, and the ConsultingCTA. The two "quick verdict" cards reuse each vendor's `notes` word for word. Every vendor note therefore appears on its own profile and on 15 compare pages, which makes these pages the site's main duplicate-content risk. **Fix**: low-distinctiveness pairs are now noindex,follow (section 2). **Decision**: whether to write pair-specific editorial for the rival pairs listed in 2.3.
- **Vendor profiles (16)**: 240 to 365 words, almost all of it in data tables. That is reasonable for a data page, and each profile is unique. No change.
- **`/compare/`**: 115 words. It is a utility page (the two-vendor picker) and not a content page. Left indexable. It is the hub that keeps noindexed pairs reachable.
- **`/about/`**: 245 words, made up of generic claims ("Independent. Specific. Useful.") and the consulting invitation. **Fix**: rewritten.
- **No duplicate `<title>` or meta description** across the 153 pages.

### 1.3 Missing dates

These pages had no visible date:

| Page(s) | Fix |
|---|---|
| All 120 compare pages | "Last verified DD Mon YYYY" added: the older of the two vendors' `last_verified` dates |
| All 16 vendor profiles | Per-section chips existed, but the page had no headline date. "Last verified DD Mon YYYY" added under the tagline |
| `/vendors/` | Left as is. The matrix carries no per-page date, the homepage stat strip shows "Last data change", and the Dataset JSON-LD carries `dateModified` |
| `/` | Left as is. The "Last data change" stat already shows the date |
| `/about/`, `/contact/`, `/compare/` | Left as is: undated policy or utility pages |

Methodology, disclosure, privacy and terms carry "Last updated". The changelog and articles are dated.

### 1.4 Broken links

`node scripts/linkcheck.mjs --external` over the pre-change build found **0 broken internal links** across 153 pages and **0 broken outbound links** across 91 distinct URLs. The one non-2xx response is `linkedin.com/in/newton-simon/`, which returns HTTP 999. That is LinkedIn's bot block, not a dead page, so the checker reports it as a warning to check by hand. `npm run linkcheck` is new on this branch.

### 1.5 Conflicts with recorded decisions

- **DECISIONS.md decision 7 (2026-07-06) "Newsletter: killed"** conflicts with the newsletter signup in this brief. **Fix**: a new ADR supersedes it. The signup ships behind a flag, default off (section 5).
- **DECISIONS.md decision 6** includes a success metric of "at least 1 unsolicited consulting enquiry at 90 days". It is meaningless once the consulting copy is gone. **Decision**: replace it (suggestion: newsletter subscribers, or inbound corrections and submissions).
- **STATE.md goal line** still lists "consulting CTA conversions into Incubate Labs engagements" as a revenue line. Updated to the reference-site model.

## 2. Compare pairs: distinctiveness and the indexed set

### 2.1 Method

Each unordered pair (16 vendors, 120 pairs) is scored on six verified dimensions that a buyer acts on, 0 to 1 each, scaled to 0 to 100:

| Dimension | Scores 1 when | Partial credit |
|---|---|---|
| Category | the categories differ | none |
| Jurisdiction | both parent jurisdictions are verified and differ | none |
| Residency | both evidence levels are known and differ (Contractual vs Stated) | 0.5 when one side has a level and the other is Not verified |
| Certs | the cert sets have no overlap | Jaccard distance of the two sets; 0 if either set is empty |
| Regions | the region sets have no overlap | Jaccard distance; 0 if either set is empty |
| Pricing | both public-pricing flags are verified and differ | none |

Free text is excluded. Pricing-model wording and deployment-model tokens always differ between vendors, so they carry no signal. Unverified gaps score 0 because a "Not verified versus Not verified" row is identical on every page.

**Threshold: 40** (at least 2.4 of the 6 dimensions). Pairs below it render `noindex, follow` and are left out of the sitemap. They stay reachable from both vendor profiles (each profile links all 15 of its comparisons) and from the `/compare/` picker, and the `follow` directive keeps link equity flowing. The constant is `INDEX_MIN_SCORE` in `src/lib/compare.mjs`. Per-pair overrides go in `INDEX_OVERRIDES` in the same file (empty today).

Distribution after the evidence-level regrading (section 3.3): 0 to 9: 2 pairs; 10 to 19: 11; 20 to 29: 11; 30 to 39: 21; 40 to 49: 21; 50 to 59: 21; 60 to 69: 19; 70 to 79: 13; 80 or more: 1. Result: **75 indexed, 45 noindex**. It was 69 and 51 before any re-verification, and 67 and 53 after the field-level pass; the pairs that moved are listed in 3.1, 3.2 and 3.3.

### 2.2 What the score rewards

Cross-category and cross-jurisdiction pairs score highest, for example a US hyperscaler against an EU or UK sovereign provider. Those are the pages where the comparison answers a real sovereignty question, which is the site's niche. Same-category US pairs with identical cert sets and the same unverified gaps (Baseten vs RunPod scores 9) render near-identical pages.

### 2.3 Open decision: rival pairs that score low but have search demand

The score measures how distinctive a page's content is, not how much search demand it has. These head-to-head pairs fall below 40 because the two vendors look alike in the data, yet they are probably the comparisons buyers search for most:

| Pair | Score |
|---|---:|
| AWS Bedrock Provisioned vs Azure OpenAI PTU | 26 |
| Azure OpenAI PTU vs Vertex AI Provisioned | 14 |
| AWS Bedrock Provisioned vs Vertex AI Provisioned | 11 |
| OVHcloud vs Scaleway | 6 |
| Nebius vs OVHcloud | 53 (now indexed: Contractual vs Stated residency) |
| Modal vs RunPod | 33 |

**Recommendation**: do not index these as they stand. They are exactly the thin pages Google discounts. Either add a short written editorial section to each (the hyperscaler trio first) and then list them in `INDEX_OVERRIDES.index`, or leave them noindexed. A search-volume pull (DataForSEO, about $0.10 for all 120 pairs) would rank the candidates if you want evidence before writing.

### 2.4 Indexed set (75 pairs, score >= 40)

| Score | Pair | Cat | Jur | Res | Certs | Regions | Pricing |
|---:|---|---:|---:|---:|---:|---:|---:|
| 91 | [Amazon Bedrock Provisioned Throughput vs Civo](/compare/aws-bedrock-provisioned-vs-civo/) | 1 | 1 | 1 | 0.71 | 0.75 | 1 |
| 79 | [Civo vs OVHcloud](/compare/civo-vs-ovhcloud/) | 1 | 1 | 1 | 0.75 | 1 | 0 |
| 78 | [Azure OpenAI Provisioned Throughput (PTU) vs Civo](/compare/azure-openai-ptu-vs-civo/) | 1 | 1 | 1 | 0.67 | 1 | 0 |
| 78 | [Civo vs Scaleway](/compare/civo-vs-scaleway/) | 1 | 1 | 1 | 0.67 | 1 | 0 |
| 75 | [Civo vs Vertex AI Provisioned Throughput](/compare/civo-vs-vertex-ai-provisioned/) | 1 | 1 | 1 | 0.50 | 1 | 0 |
| 75 | [Fireworks AI vs OVHcloud](/compare/fireworks-ai-vs-ovhcloud/) | 1 | 1 | 1 | 0.75 | 0.75 | 0 |
| 74 | [Amazon Bedrock Provisioned Throughput vs Scaleway](/compare/aws-bedrock-provisioned-vs-scaleway/) | 1 | 1 | 0 | 0.71 | 0.75 | 1 |
| 74 | [Databricks Model Serving vs OVHcloud](/compare/databricks-model-serving-vs-ovhcloud/) | 1 | 1 | 1 | 0.67 | 0.75 | 0 |
| 74 | [Fireworks AI vs Scaleway](/compare/fireworks-ai-vs-scaleway/) | 1 | 1 | 1 | 0.67 | 0.75 | 0 |
| 73 | [Databricks Model Serving vs Scaleway](/compare/databricks-model-serving-vs-scaleway/) | 1 | 1 | 1 | 0.60 | 0.75 | 0 |
| 72 | [Amazon Bedrock Provisioned Throughput vs OVHcloud](/compare/aws-bedrock-provisioned-vs-ovhcloud/) | 1 | 1 | 0 | 0.57 | 0.75 | 1 |
| 72 | [Modal vs Nebius](/compare/modal-vs-nebius/) | 1 | 1 | 1 | 0.80 | 0.50 | 0 |
| 71 | [Civo vs Modal](/compare/civo-vs-modal/) | 1 | 1 | 1 | 0.50 | 0.75 | 0 |
| 71 | [OVHcloud vs RunPod](/compare/ovhcloud-vs-runpod/) | 1 | 1 | 1 | 0.60 | 0.67 | 0 |
| 69 | [Amazon Bedrock Provisioned Throughput vs Fireworks AI](/compare/aws-bedrock-provisioned-vs-fireworks-ai/) | 1 | 0 | 1 | 0.71 | 0.40 | 1 |
| 69 | [Baseten vs OVHcloud](/compare/baseten-vs-ovhcloud/) | 1 | 1 | 1 | 0.67 | 0.50 | 0 |
| 69 | [Civo vs Hugging Face Inference Endpoints](/compare/civo-vs-huggingface-inference-endpoints/) | 1 | 1 | 0.50 | 0.67 | 1 | 0 |
| 69 | [RunPod vs Scaleway](/compare/runpod-vs-scaleway/) | 1 | 1 | 1 | 0.50 | 0.67 | 0 |
| 68 | [Baseten vs Scaleway](/compare/baseten-vs-scaleway/) | 1 | 1 | 1 | 0.60 | 0.50 | 0 |
| 65 | [Azure OpenAI Provisioned Throughput (PTU) vs Nebius](/compare/azure-openai-ptu-vs-nebius/) | 1 | 1 | 1 | 0.43 | 0.50 | 0 |
| 65 | [CoreWeave vs OVHcloud](/compare/coreweave-vs-ovhcloud/) | 1 | 1 | 0.50 | 0.75 | 0.67 | 0 |
| 64 | [Civo vs CoreWeave](/compare/civo-vs-coreweave/) | 1 | 1 | 0.50 | 0.67 | 0.67 | 0 |
| 64 | [CoreWeave vs Scaleway](/compare/coreweave-vs-scaleway/) | 1 | 1 | 0.50 | 0.67 | 0.67 | 0 |
| 63 | [Amazon Bedrock Provisioned Throughput vs Baseten](/compare/aws-bedrock-provisioned-vs-baseten/) | 1 | 0 | 1 | 0.29 | 0.50 | 1 |
| 63 | [Amazon Bedrock Provisioned Throughput vs Nebius](/compare/aws-bedrock-provisioned-vs-nebius/) | 1 | 1 | 1 | 0.29 | 0.50 | 0 |
| 63 | [Hugging Face Inference Endpoints vs OVHcloud](/compare/huggingface-inference-endpoints-vs-ovhcloud/) | 1 | 1 | 0.50 | 0.75 | 0.50 | 0 |
| 63 | [Modal vs OVHcloud](/compare/modal-vs-ovhcloud/) | 1 | 1 | 0 | 1 | 0.75 | 0 |
| 63 | [Modal vs Scaleway](/compare/modal-vs-scaleway/) | 1 | 1 | 0 | 1 | 0.75 | 0 |
| 62 | [Amazon Bedrock Provisioned Throughput vs Hugging Face Inference Endpoints](/compare/aws-bedrock-provisioned-vs-huggingface-inference-endpoints/) | 1 | 0 | 0.50 | 0.71 | 0.50 | 1 |
| 61 | [Amazon Bedrock Provisioned Throughput vs RunPod](/compare/aws-bedrock-provisioned-vs-runpod/) | 1 | 0 | 1 | 0.43 | 0.25 | 1 |
| 61 | [Hugging Face Inference Endpoints vs Scaleway](/compare/huggingface-inference-endpoints-vs-scaleway/) | 1 | 1 | 0.50 | 0.67 | 0.50 | 0 |
| 60 | [Baseten vs Civo](/compare/baseten-vs-civo/) | 1 | 1 | 0 | 0.60 | 1 | 0 |
| 60 | [Civo vs Nebius](/compare/civo-vs-nebius/) | 1 | 1 | 0 | 0.60 | 1 | 0 |
| 59 | [Nebius vs Vertex AI Provisioned Throughput](/compare/nebius-vs-vertex-ai-provisioned/) | 1 | 1 | 1 | 0.20 | 0.33 | 0 |
| 58 | [Amazon Bedrock Provisioned Throughput vs CoreWeave](/compare/aws-bedrock-provisioned-vs-coreweave/) | 1 | 0 | 0.50 | 0.71 | 0.25 | 1 |
| 58 | [Civo vs RunPod](/compare/civo-vs-runpod/) | 1 | 1 | 0 | 0.50 | 1 | 0 |
| 57 | [Azure OpenAI Provisioned Throughput (PTU) vs Scaleway](/compare/azure-openai-ptu-vs-scaleway/) | 1 | 1 | 0 | 0.67 | 0.75 | 0 |
| 57 | [CoreWeave vs Nebius](/compare/coreweave-vs-nebius/) | 1 | 1 | 0.50 | 0.60 | 0.33 | 0 |
| 56 | [Civo vs Databricks Model Serving](/compare/civo-vs-databricks-model-serving/) | 1 | 1 | 0 | 0.60 | 0.75 | 0 |
| 55 | [Amazon Bedrock Provisioned Throughput vs Databricks Model Serving](/compare/aws-bedrock-provisioned-vs-databricks-model-serving/) | 1 | 0 | 1 | 0.29 | 0 | 1 |
| 55 | [OVHcloud vs Together AI](/compare/ovhcloud-vs-together-ai/) | 1 | 1 | 0.50 | 0.80 | 0 | 0 |
| 54 | [Amazon Bedrock Provisioned Throughput vs NVIDIA NIM](/compare/aws-bedrock-provisioned-vs-nvidia-nim/) | 1 | 0 | 0.50 | 0.71 | 0 | 1 |
| 54 | [Azure OpenAI Provisioned Throughput (PTU) vs OVHcloud](/compare/azure-openai-ptu-vs-ovhcloud/) | 1 | 1 | 0 | 0.50 | 0.75 | 0 |
| 54 | [OVHcloud vs Vertex AI Provisioned Throughput](/compare/ovhcloud-vs-vertex-ai-provisioned/) | 1 | 1 | 0 | 0.60 | 0.67 | 0 |
| 54 | [Scaleway vs Together AI](/compare/scaleway-vs-together-ai/) | 1 | 1 | 0.50 | 0.75 | 0 | 0 |
| 53 | [Civo vs NVIDIA NIM](/compare/civo-vs-nvidia-nim/) | 1 | 1 | 0.50 | 0.67 | 0 | 0 |
| 53 | [Nebius vs OVHcloud](/compare/nebius-vs-ovhcloud/) | 0 | 1 | 1 | 0.67 | 0.50 | 0 |
| 53 | [Scaleway vs Vertex AI Provisioned Throughput](/compare/scaleway-vs-vertex-ai-provisioned/) | 1 | 1 | 0 | 0.50 | 0.67 | 0 |
| 52 | [Fireworks AI vs Nebius](/compare/fireworks-ai-vs-nebius/) | 1 | 1 | 0 | 0.60 | 0.50 | 0 |
| 52 | [Hugging Face Inference Endpoints vs Nebius](/compare/huggingface-inference-endpoints-vs-nebius/) | 1 | 1 | 0.50 | 0.60 | 0 | 0 |
| 52 | [Nebius vs NVIDIA NIM](/compare/nebius-vs-nvidia-nim/) | 1 | 1 | 0.50 | 0.60 | 0 | 0 |
| 52 | [Nebius vs Scaleway](/compare/nebius-vs-scaleway/) | 0 | 1 | 1 | 0.60 | 0.50 | 0 |
| 51 | [Amazon Bedrock Provisioned Throughput vs Together AI](/compare/aws-bedrock-provisioned-vs-together-ai/) | 1 | 0 | 0.50 | 0.57 | 0 | 1 |
| 50 | [Civo vs Fireworks AI](/compare/civo-vs-fireworks-ai/) | 1 | 1 | 0 | 0 | 1 | 0 |
| 49 | [Azure OpenAI Provisioned Throughput (PTU) vs Baseten](/compare/azure-openai-ptu-vs-baseten/) | 1 | 0 | 1 | 0.43 | 0.50 | 0 |
| 48 | [Amazon Bedrock Provisioned Throughput vs Modal](/compare/aws-bedrock-provisioned-vs-modal/) | 1 | 0 | 0 | 0.86 | 0 | 1 |
| 48 | [Nebius vs Together AI](/compare/nebius-vs-together-ai/) | 1 | 1 | 0.50 | 0.40 | 0 | 0 |
| 47 | [Azure OpenAI Provisioned Throughput (PTU) vs RunPod](/compare/azure-openai-ptu-vs-runpod/) | 1 | 0 | 1 | 0.57 | 0.25 | 0 |
| 47 | [Civo vs Together AI](/compare/civo-vs-together-ai/) | 1 | 1 | 0.50 | 0.33 | 0 | 0 |
| 47 | [Databricks Model Serving vs Modal](/compare/databricks-model-serving-vs-modal/) | 1 | 0 | 1 | 0.80 | 0 | 0 |
| 47 | [Databricks Model Serving vs Nebius](/compare/databricks-model-serving-vs-nebius/) | 1 | 1 | 0 | 0.33 | 0.50 | 0 |
| 47 | [NVIDIA NIM vs OVHcloud](/compare/nvidia-nim-vs-ovhcloud/) | 1 | 1 | 0.50 | 0.33 | 0 | 0 |
| 46 | [Azure OpenAI Provisioned Throughput (PTU) vs CoreWeave](/compare/azure-openai-ptu-vs-coreweave/) | 1 | 0 | 0.50 | 0.67 | 0.60 | 0 |
| 46 | [Databricks Model Serving vs Vertex AI Provisioned Throughput](/compare/databricks-model-serving-vs-vertex-ai-provisioned/) | 1 | 0 | 1 | 0.50 | 0.25 | 0 |
| 46 | [Fireworks AI vs Vertex AI Provisioned Throughput](/compare/fireworks-ai-vs-vertex-ai-provisioned/) | 1 | 0 | 1 | 0.50 | 0.25 | 0 |
| 44 | [Azure OpenAI Provisioned Throughput (PTU) vs Fireworks AI](/compare/azure-openai-ptu-vs-fireworks-ai/) | 1 | 0 | 1 | 0.67 | 0 | 0 |
| 44 | [Azure OpenAI Provisioned Throughput (PTU) vs Hugging Face Inference Endpoints](/compare/azure-openai-ptu-vs-huggingface-inference-endpoints/) | 1 | 0 | 0.50 | 0.67 | 0.50 | 0 |
| 44 | [Fireworks AI vs Hugging Face Inference Endpoints](/compare/fireworks-ai-vs-huggingface-inference-endpoints/) | 1 | 0 | 0.50 | 0.67 | 0.50 | 0 |
| 43 | [Azure OpenAI Provisioned Throughput (PTU) vs Databricks Model Serving](/compare/azure-openai-ptu-vs-databricks-model-serving/) | 1 | 0 | 1 | 0.17 | 0.40 | 0 |
| 42 | [Baseten vs Vertex AI Provisioned Throughput](/compare/baseten-vs-vertex-ai-provisioned/) | 1 | 0 | 1 | 0.20 | 0.33 | 0 |
| 42 | [CoreWeave vs Vertex AI Provisioned Throughput](/compare/coreweave-vs-vertex-ai-provisioned/) | 1 | 0 | 0.50 | 0.50 | 0.50 | 0 |
| 42 | [Hugging Face Inference Endpoints vs Modal](/compare/huggingface-inference-endpoints-vs-modal/) | 1 | 0 | 0.50 | 0.50 | 0.50 | 0 |
| 42 | [Modal vs NVIDIA NIM](/compare/modal-vs-nvidia-nim/) | 1 | 0 | 0.50 | 1 | 0 | 0 |
| 42 | [Nebius vs RunPod](/compare/nebius-vs-runpod/) | 1 | 1 | 0 | 0.20 | 0.33 | 0 |
| 42 | [NVIDIA NIM vs Scaleway](/compare/nvidia-nim-vs-scaleway/) | 1 | 1 | 0.50 | 0 | 0 | 0 |

### 2.5 noindex,follow (45 pairs, score < 40)

| Score | Pair | Cat | Jur | Res | Certs | Regions | Pricing |
|---:|---|---:|---:|---:|---:|---:|---:|
| 39 | [CoreWeave vs Databricks Model Serving](/compare/coreweave-vs-databricks-model-serving/) | 1 | 0 | 0.50 | 0.60 | 0.25 | 0 |
| 39 | [Hugging Face Inference Endpoints vs RunPod](/compare/huggingface-inference-endpoints-vs-runpod/) | 1 | 0 | 0.50 | 0.50 | 0.33 | 0 |
| 39 | [Hugging Face Inference Endpoints vs Vertex AI Provisioned Throughput](/compare/huggingface-inference-endpoints-vs-vertex-ai-provisioned/) | 1 | 0 | 0.50 | 0.50 | 0.33 | 0 |
| 38 | [Baseten vs Modal](/compare/baseten-vs-modal/) | 0 | 0 | 1 | 0.80 | 0.50 | 0 |
| 37 | [Azure OpenAI Provisioned Throughput (PTU) vs Modal](/compare/azure-openai-ptu-vs-modal/) | 1 | 0 | 0 | 0.83 | 0.40 | 0 |
| 36 | [Azure OpenAI Provisioned Throughput (PTU) vs NVIDIA NIM](/compare/azure-openai-ptu-vs-nvidia-nim/) | 1 | 0 | 0.50 | 0.67 | 0 | 0 |
| 36 | [Fireworks AI vs NVIDIA NIM](/compare/fireworks-ai-vs-nvidia-nim/) | 1 | 0 | 0.50 | 0.67 | 0 | 0 |
| 35 | [Baseten vs Hugging Face Inference Endpoints](/compare/baseten-vs-huggingface-inference-endpoints/) | 1 | 0 | 0.50 | 0.60 | 0 | 0 |
| 35 | [Baseten vs NVIDIA NIM](/compare/baseten-vs-nvidia-nim/) | 1 | 0 | 0.50 | 0.60 | 0 | 0 |
| 35 | [Together AI vs Vertex AI Provisioned Throughput](/compare/together-ai-vs-vertex-ai-provisioned/) | 1 | 0 | 0.50 | 0.60 | 0 | 0 |
| 33 | [Azure OpenAI Provisioned Throughput (PTU) vs Together AI](/compare/azure-openai-ptu-vs-together-ai/) | 1 | 0 | 0.50 | 0.50 | 0 | 0 |
| 33 | [Baseten vs Nebius](/compare/baseten-vs-nebius/) | 1 | 1 | 0 | 0 | 0 | 0 |
| 33 | [Databricks Model Serving vs Fireworks AI](/compare/databricks-model-serving-vs-fireworks-ai/) | 1 | 0 | 0 | 0.60 | 0.40 | 0 |
| 33 | [Modal vs RunPod](/compare/modal-vs-runpod/) | 0 | 0 | 1 | 0.75 | 0.25 | 0 |
| 33 | [Modal vs Vertex AI Provisioned Throughput](/compare/modal-vs-vertex-ai-provisioned/) | 1 | 0 | 0 | 0.75 | 0.25 | 0 |
| 33 | [NVIDIA NIM vs RunPod](/compare/nvidia-nim-vs-runpod/) | 1 | 0 | 0.50 | 0.50 | 0 | 0 |
| 33 | [NVIDIA NIM vs Vertex AI Provisioned Throughput](/compare/nvidia-nim-vs-vertex-ai-provisioned/) | 1 | 0 | 0.50 | 0.50 | 0 | 0 |
| 33 | [RunPod vs Vertex AI Provisioned Throughput](/compare/runpod-vs-vertex-ai-provisioned/) | 1 | 0 | 1 | 0 | 0 | 0 |
| 32 | [Databricks Model Serving vs Together AI](/compare/databricks-model-serving-vs-together-ai/) | 1 | 0 | 0.50 | 0.40 | 0 | 0 |
| 32 | [Fireworks AI vs Modal](/compare/fireworks-ai-vs-modal/) | 0 | 0 | 1 | 0.50 | 0.40 | 0 |
| 31 | [Baseten vs Databricks Model Serving](/compare/baseten-vs-databricks-model-serving/) | 1 | 0 | 0 | 0.33 | 0.50 | 0 |
| 29 | [CoreWeave vs Fireworks AI](/compare/coreweave-vs-fireworks-ai/) | 0 | 0 | 0.50 | 0.67 | 0.60 | 0 |
| 29 | [Databricks Model Serving vs RunPod](/compare/databricks-model-serving-vs-runpod/) | 1 | 0 | 0 | 0.50 | 0.25 | 0 |
| 29 | [Hugging Face Inference Endpoints vs Together AI](/compare/huggingface-inference-endpoints-vs-together-ai/) | 1 | 0 | 0 | 0.75 | 0 | 0 |
| 29 | [NVIDIA NIM vs Together AI](/compare/nvidia-nim-vs-together-ai/) | 1 | 0 | 0 | 0.75 | 0 | 0 |
| 28 | [CoreWeave vs NVIDIA NIM](/compare/coreweave-vs-nvidia-nim/) | 1 | 0 | 0 | 0.67 | 0 | 0 |
| 27 | [Databricks Model Serving vs Hugging Face Inference Endpoints](/compare/databricks-model-serving-vs-huggingface-inference-endpoints/) | 0 | 0 | 0.50 | 0.60 | 0.50 | 0 |
| 26 | [Amazon Bedrock Provisioned Throughput vs Azure OpenAI Provisioned Throughput (PTU)](/compare/aws-bedrock-provisioned-vs-azure-openai-ptu/) | 0 | 0 | 0 | 0.14 | 0.40 | 1 |
| 25 | [CoreWeave vs RunPod](/compare/coreweave-vs-runpod/) | 0 | 0 | 0.50 | 0.50 | 0.50 | 0 |
| 24 | [Baseten vs CoreWeave](/compare/baseten-vs-coreweave/) | 0 | 0 | 0.50 | 0.60 | 0.33 | 0 |
| 22 | [CoreWeave vs Hugging Face Inference Endpoints](/compare/coreweave-vs-huggingface-inference-endpoints/) | 1 | 0 | 0 | 0 | 0.33 | 0 |
| 21 | [CoreWeave vs Modal](/compare/coreweave-vs-modal/) | 0 | 0 | 0.50 | 0.50 | 0.25 | 0 |
| 19 | [Modal vs Together AI](/compare/modal-vs-together-ai/) | 0 | 0 | 0.50 | 0.67 | 0 | 0 |
| 18 | [Baseten vs Fireworks AI](/compare/baseten-vs-fireworks-ai/) | 0 | 0 | 0 | 0.60 | 0.50 | 0 |
| 18 | [Databricks Model Serving vs NVIDIA NIM](/compare/databricks-model-serving-vs-nvidia-nim/) | 0 | 0 | 0.50 | 0.60 | 0 | 0 |
| 18 | [RunPod vs Together AI](/compare/runpod-vs-together-ai/) | 0 | 0 | 0.50 | 0.60 | 0 | 0 |
| 15 | [Baseten vs Together AI](/compare/baseten-vs-together-ai/) | 0 | 0 | 0.50 | 0.40 | 0 | 0 |
| 14 | [Azure OpenAI Provisioned Throughput (PTU) vs Vertex AI Provisioned Throughput](/compare/azure-openai-ptu-vs-vertex-ai-provisioned/) | 0 | 0 | 0 | 0.57 | 0.25 | 0 |
| 14 | [Fireworks AI vs Together AI](/compare/fireworks-ai-vs-together-ai/) | 0 | 0 | 0.50 | 0.33 | 0 | 0 |
| 13 | [CoreWeave vs Together AI](/compare/coreweave-vs-together-ai/) | 0 | 0 | 0 | 0.75 | 0 | 0 |
| 13 | [Fireworks AI vs RunPod](/compare/fireworks-ai-vs-runpod/) | 0 | 0 | 0 | 0.50 | 0.25 | 0 |
| 11 | [Amazon Bedrock Provisioned Throughput vs Vertex AI Provisioned Throughput](/compare/aws-bedrock-provisioned-vs-vertex-ai-provisioned/) | 0 | 0 | 0 | 0.43 | 0.25 | 0 |
| 11 | [Hugging Face Inference Endpoints vs NVIDIA NIM](/compare/huggingface-inference-endpoints-vs-nvidia-nim/) | 0 | 0 | 0 | 0.67 | 0 | 0 |
| 9 | [Baseten vs RunPod](/compare/baseten-vs-runpod/) | 0 | 0 | 0 | 0.20 | 0.33 | 0 |
| 6 | [OVHcloud vs Scaleway](/compare/ovhcloud-vs-scaleway/) | 0 | 0 | 0 | 0.33 | 0 | 0 |

## 3. Vendor YAML freshness and sources

Audit date 2026-10-17, so the 60-day staleness cutoff is **2026-08-18**.

**Finding at audit time: every verified fact in the database was older than 60 days.** All 16 vendors had last been checked between 7 and 18 July 2026, 91 to 102 days earlier, and no fact had been re-verified since the v2.3 sprint. **Resolved on this branch**: all 87 facts were re-verified on 2026-10-17 (section 3.1). The table below is the state before that pass. The drift watch (piece 14) that would catch evidence-URL rot has not been built.

| Vendor | Facts | Oldest | Newest | Over 60 days | Facts without a source URL |
|---|---:|---|---|---:|---|
| aws-bedrock-provisioned | 9 | 2026-07-08 | 2026-07-08 | 9 | none |
| azure-openai-ptu | 8 | 2026-07-08 | 2026-07-08 | 8 | none |
| baseten | 6 | 2026-07-07 | 2026-07-07 | 6 | none |
| civo | 4 | 2026-07-18 | 2026-07-18 | 4 | none |
| coreweave | 4 | 2026-07-07 | 2026-07-07 | 4 | none |
| databricks-model-serving | 7 | 2026-07-08 | 2026-07-12 | 7 | none |
| fireworks-ai | 5 | 2026-07-07 | 2026-07-07 | 5 | none |
| huggingface-inference-endpoints | 4 | 2026-07-07 | 2026-07-07 | 4 | none |
| modal | 4 | 2026-07-07 | 2026-07-07 | 4 | none |
| nebius | 6 | 2026-07-07 | 2026-07-07 | 6 | none |
| nvidia-nim | 4 | 2026-07-08 | 2026-07-08 | 4 | none |
| ovhcloud | 6 | 2026-07-07 | 2026-07-07 | 6 | none |
| runpod | 6 | 2026-07-07 | 2026-07-07 | 6 | none |
| scaleway | 4 | 2026-07-07 | 2026-07-07 | 4 | none |
| together-ai | 4 | 2026-07-07 | 2026-07-07 | 4 | none |
| vertex-ai-provisioned | 6 | 2026-07-08 | 2026-07-08 | 6 | none |

"Facts" counts the evidence-bearing blocks: each compliance entry, pricing, and sovereignty. The schema already makes a populated fact impossible to commit without `evidence_url` and `verified`, so no fact block lacks a source.

**Fields that carry no source URL in the schema** (the evidence invariant does not cover them):

- `regions` (all 16 vendors): provenance exists only as YAML comments with a URL. It is not rendered and not validated. This was already a v3 candidate. **Resolved in 3.2**: `sources[]` now records a source and date per field, regions included.
- `deployment_models` (all 16): no provenance field or comment.
- `tagline`, `notes`, `category`: editorial fields. `notes` often restates sourced facts but cites nothing inline.

**Fix on this branch**: each vendor gains `last_verified` and `sources[]`. `sources` lists every URL the profile relies on: all evidence URLs plus the region provenance URLs that were only in comments. A schema rule forbids an evidence URL that is missing from `sources`. `last_verified` is set conservatively to the **oldest** fact date, so the claim "Last verified" never overstates freshness. The schema rejects a `last_verified` later than any fact's own verified date. The re-verification in 3.1 then moved every fact, and so every `last_verified`, to 2026-10-17.

### 3.1 Re-verification, 2026-10-17

**Method.** All 75 source URLs were rendered in headless Chromium and their visible text saved. Each claim was then checked against that text, not against the HTTP status. Two kinds of page needed a direct fetch: `trust.runpod.io` serves a Cloudflare bot challenge to headless browsers, and the Databricks BAA and DPA download as PDFs. Where a page had moved, the claim was checked at its new address and the evidence URL repointed. Region provenance comments were re-checked the same way. Residency stays `unknown` unless the vendor makes a contractual commitment, per the methodology definition.

**Result: 87 of 87 facts still supported. Two facts added, regions changed for two vendors, nothing removed or downgraded.** There are now 89 facts.

| Vendor | Outcome |
|---|---|
| aws-bedrock-provisioned | 9/9 hold |
| azure-openai-ptu | 8/8 hold |
| baseten | 6/6 hold. **ISO 27001 added** (trust centre lists ISO 27001:2022 and publishes the certificate). **Regions narrowed** from us, uk, europe, apac to us, europe: the regional-deployments doc now lists only `us` and `eu`, and the UK and Australia regions named in July are gone |
| civo | 4/4 hold. ISO 27001 and SOC 2 moved from the sovereign-cloud page to the GPU page FAQ; both repointed. Notes: "VFIO passthrough" is no longer on any Civo page, so the note now says "GPU passthrough", from the FlexCore page |
| coreweave | 4/4 hold. DPA and terms repointed (`/docs/policies/` became `/policies/`) |
| databricks-model-serving | 7/7 hold. **UK added to regions**: the Model Serving region table lists EU (London) with GPU serving and provisioned throughput. Notes: FedRAMP tiers are now named Class C and D (formerly Moderate and High) |
| fireworks-ai | 5/5 hold. Regions now have a primary source (`/deployments/regions`). Notes: Enterprise accounts can enforce US-only inference |
| huggingface-inference-endpoints | 4/4 hold |
| modal | 4/4 hold |
| nebius | 6/6 hold. The Token Factory terms were superseded on 28 Sep 2026 by the Nebius Services Agreement. That agreement still names Nebius B.V. under Dutch law for non-US customers, and it is now the sovereignty evidence. Notes: US Token Factory customers registering from 15 Sep 2026 contract with Nebius Inc. |
| nvidia-nim | 4/4 hold |
| ovhcloud | 6/6 hold. The certifications page moved to `/en/compliance/`; 4 facts repointed |
| runpod | 6/6 hold. **ISO 27001 added** (trust centre lists ISO/IEC 27001:2022) |
| scaleway | 4/4 hold. Security page repointed. Notes: Managed Inference is now "Generative APIs Dedicated Deployment", and the security page no longer dates the SecNumCloud process to January 2025 |
| together-ai | 4/4 hold. The data-centre page now redirects to `/gpu-clusters`, and the regions stay not verified. Notes: reserved capacity is also sold in PTUs |
| vertex-ai-provisioned | 6/6 hold. Google's scope list now names the service "Generative AI on Gemini Enterprise Agent Platform (formerly Generative AI on Vertex AI)". The locations page moved to the Gemini Enterprise Agent Platform docs |

**Effect on compare pairs.** Two pairs drop below 40 and become noindex: Azure OpenAI PTU vs Baseten (45 to 38) and Baseten vs Nebius (48 to 37). Both fall because Baseten's region set narrowed. The indexed set is now 67 (2.4).

**Residency upgrades considered and not taken.** Three vendors now document a product control that keeps processing in a region, but none is a contractual guarantee, so each stays `unknown`:

- Fireworks: Enterprise accounts can enforce US-only inference. No EU option is listed.
- Baseten: regional deployments pin replicas to the US or EU.
- Vertex AI: multi-region endpoints keep ML processing in the US or EU.

**Decision**: whether a documented, enforced product control should count as a residency guarantee. That would be a methodology change, so it was not made here.


### 3.2 Field-level verification, 2026-10-17 (second pass)

The first pass (3.1) checked the 87 evidence-bearing facts, then moved every profile's headline date. That overstated freshness: `deployment_models` had never been checked, regions for AWS, Azure, OVHcloud and Scaleway had no recorded source, and for several vendors the parent jurisdiction had not been confirmed from the page cited for residency. This pass checked **every field** (category, summary, deployment models, regions, each cert, pricing, residency, parent jurisdiction, analyst note, homepage URL) against the vendor's own docs, pricing, trust or legal pages. For Civo's ownership it used the Companies House register.

**Schema change.** Each `sources[]` entry is now `{field, url, verified}`. The schema enforces four rules:

- Every claimed field has at least one source.
- No source names a field the record does not claim.
- Every fact's evidence link is one of its own field's sources, with the same date.
- `last_verified` equals the oldest source date.

A field that could not be confirmed would keep its old entry and date, and so hold the profile's headline date back. In this pass every field was confirmed, so every entry is dated 2026-10-17. The vendor page renders the sources per field, each with its date.

**New changes to values**

| Vendor | Change | Source |
|---|---|---|
| aws-bedrock-provisioned | Regions gain `uk`. The PT model table lists `eu-west-2`, and AWS's regions page names it "Europe (London)", United Kingdom | Bedrock PT supported-regions doc; AWS regions page |
| azure-openai-ptu | Regions gain `apac`. Data Zone types now process within the "US, EU, or Asia Pacific (APAC)" zone, and Data Zone Provisioned exists | Foundry deployment-types doc |
| modal | Deployment models gain `dedicated-endpoints`. Dedicated Endpoints run models "on isolated, autoscaling containers" at standard compute rates | modal.com/docs/guide/dedicated-endpoints |
| nebius | **HIPAA BAA added**: PHI use "is subject to a signed Business Associate Agreement". The old note said no BAA was found | docs.nebius.com/legal/hipaa |
| nebius | Pricing corrected. The dedicated-endpoint billing policy makes an endpoint billable "when at least one replica is running", but the enterprise page still cites "$/token pricing". The pricing text now records both, and the summary drops "per-token" for dedicated endpoints | Token Factory billing policy; enterprise-grade inference page |
| fireworks-ai | The sovereignty evidence moves to the terms (Fireworks.ai, Inc., Delaware law). The privacy policy did not name the parent | fireworks.ai/terms-of-service |

**Notes corrected**: NVIDIA (Hugging Face now offers *serverless* NIM endpoints; dedicated routes are CSP model gardens, NVIDIA Brev and NVCF), OVHcloud ("more than 20" models, not 40+; hosted in the EU), RunPod (Secure Cloud defined as T3/T4 data centres), Databricks ("Mosaic AI" dropped from the product name), Azure (Data Zone US, EU or APAC), Modal (Dedicated Endpoints), Nebius (BAA).

**Unverified**: one claim could not be confirmed on any NVIDIA page: "DGX Cloud pricing is via private marketplace offers". The private offer on the AI Enterprise pricing page is a subscription quote, not DGX Cloud. The claim was removed from the note rather than left under a fresh date. No structured field remains unverified.

**Offering changes flagged (dedicated or single-tenant products, against the July record).** The baseline is this repo's July YAML. The Wayback Machine is unreachable from the build host, so only prices the YAML recorded can be compared.

- **Renamed**: Scaleway "Managed Inference" is now "Generative APIs Dedicated Deployment", partially (the same page still says "Managed Inference" lower down). Vertex AI: the product URL now redirects to "Gemini Enterprise Agent Platform", and Google's scope list renames the service; Provisioned Throughput itself is unchanged. Databricks: "Mosaic AI Model Serving" is now "Model Serving". Baseten's dedicated deployments are also marketed as "Dedicated Inference".
- **Repriced or new pricing unit**: Together AI now also sells dedicated capacity in throughput units (PTUs), alongside per-GPU-hour. Nebius's own pages conflict: the dedicated-endpoint billing policy makes an endpoint billable while a replica runs, but the product page cites $/token. The July record said per token. Every recorded price is unchanged: Scaleway EUR 0.93/hour, Hugging Face from $0.033/hour, Databricks A10G 20 DBU/hour, NVIDIA $4,500/GPU/year and $1/GPU/hour, CoreWeave up to 60% committed discount, Civo 6 to 36 month terms, AWS no-commitment/1-month/6-month MU terms, Azure 1-month and 1-year reservations.
- **Withdrawn or narrowed**: Baseten's UK and Australia regions (3.1). NVIDIA's Hugging Face route is now serverless, not dedicated. Fireworks deprecated `inference_geo` in favour of account-level data residency.
- **New**: Modal Dedicated Endpoints, Nebius BAA, and Fireworks' Enterprise US-only residency control.

**Consistency issues found, values unchanged, for decision**:

- Scaleway's residency is `true` on the strength of a product-page statement ("stored only in Europe"). OVHcloud ("hosted and run in the European Union") and others with similar wording stay `unknown`, and the methodology asks for a contractual guarantee.
- CoreWeave's trust centre shows an ISO 27001 badge but its security page says it "aligns" with ISO 27001, so it stays excluded. Baseten and RunPod were added because their trust centres state certification outright ("holds", or a certificate).

**Effect on compare pairs**: four pairs swap and the total stays 67. Azure OpenAI PTU vs Baseten (38 to 40) and Nebius vs Vertex AI (39 to 42) are now indexed. Azure OpenAI PTU vs RunPod (40 to 36) and Nebius vs RunPod (42 to 39) are now noindex.

### 3.3 Evidence levels, 2026-10-17 (decision 9)

Every certification and residency fact was regraded on one rule (documented at `/methodology/#evidence-levels`):

- **Contractual**: in the vendor's DPA, terms or service agreement, or a certification traceable to a certificate, audit report or certifying body.
- **Stated**: on the vendor's own product, docs or trust pages only.
- **Not verified**: nothing found, or only "aligns with" or "designed to" wording. A cert at this level is not listed.

Residency is now a level, not a yes/no.

**Residency**

| Level | Vendors and evidence |
|---|---|
| Contractual | AWS (Customer Agreement 1.4: "You may specify the AWS regions in which Your Content will be stored"); Azure (Products and Services DPA, "Location of Customer Data": stored at rest within a Geo); Modal (terms: "will not process Customer Data on servers in other regions"); Scaleway (DPA art. 11: EU by default, client selects location; storage outside the EU only after informing the client); OVHcloud (Public Cloud specific conditions 5.5 and AI Tools 2.3: client chooses the datacentre region); Vertex AI (Service Specific Terms, AI/ML Data Location: Google performs storage and ML processing "only in that Multi-Region"; Generative AI on Gemini Enterprise Agent Platform is listed) |
| Stated | Baseten (regional deployments "for compliance, data residency"); Civo (UK Sovereign Cloud page; its service terms have no location clause); Databricks (Geos doc: content processed only in the workspace Geo); Fireworks (Enterprise US-only enforcement); Nebius (enterprise page FAQ); RunPod (trust centre: place workloads by jurisdiction) |
| Not verified | CoreWeave, Hugging Face, NVIDIA NIM, Together AI (previously recorded as "No guarantee") |

Scaleway and OVHcloud land on the same level because their contracts make the equivalent commitment: the customer selects the location. Their product-page wording is also equivalent.

**Certifications** are mostly Contractual: AWS, Azure, Databricks, Vertex AI, Baseten, RunPod, Modal SOC 2, Fireworks, Scaleway ISO 27001, OVHcloud ISO 27001 and C5, Together ISO 27001, and the published DPAs and BAAs. Stated: Civo (ISO 27001, SOC 2), CoreWeave SOC 2, Hugging Face (SOC 2, DPA), Nebius trust-centre certs (SOC 2, SOC 3, ISO 27001), NVIDIA ISO 27001, OVHcloud GDPR DPA, Together SOC 2 and BAA.

**Removed**:

- HIPAA BAA for Fireworks, Modal and RunPod. Each states a HIPAA programme, but no doc, trust centre or terms names a BAA.
- OVHcloud SecNumCloud. The ANSSI qualification covers SNC Cloud Platform, Managed VMware, SAP HANA and Bare Metal Pod, not AI Endpoints or AI Deploy.

**Added**: Together AI ISO 27001, certified by A-LIGN, an ANAB-accredited body.

**Renamed products (decision 10)**: `renamed: {from, to}`, sourced. It renders "Old (now New)" in titles, H1s, matrix rows, compare pages and the picker. Slugs are unchanged, and the new names appear as `alternateName` in JSON-LD and in the matrix's new name search. Applies to Vertex AI, Scaleway Managed Inference and Databricks Mosaic AI Model Serving. Compare-page titles for renamed pairs run to about 150 characters.

**Effect on compare pairs**: the indexed set goes from 67 to 75. Residency now has three levels, so a Contractual-vs-Stated pair counts as a difference, and Vertex AI moved to Contractual.

- **Now indexed**: Azure vs Databricks, Fireworks and RunPod; Baseten, CoreWeave, Databricks and Fireworks vs Vertex AI; Databricks vs Modal; Fireworks vs Hugging Face; Nebius vs OVHcloud; Nebius vs RunPod.
- **Now noindex**: Azure vs Together AI, Modal vs Vertex AI, and NVIDIA vs Together AI.

**Decision**: the pair-scoring weights were calibrated on yes/no residency. Keep the threshold of 40 with the three-level residency dimension, or rescore residency so that only Contractual vs not counts?

## 4. Structured data

| Type | Where (before) | Status | Fix |
|---|---|---|---|
| Organization | Homepage only, nested as `WebSite.publisher`; Datasets and Articles repeat it inline | Valid, but no `@id` and no `sameAs` | Shared `organization()` gains `@id` `https://singletenant.ai/#organization`, so every page references one entity. Emitted as a top-level node on the homepage and `/about/` |
| Article + dateModified | All 6 articles: `dateModified` = `updated` or `pub_date` | Correct | Unchanged for articles. Published guides emit an Article whose `dateModified` comes from `last_verified` or `updated`. Stub guides emit no Article |
| BreadcrumbList | Vendor profiles, compare pages, articles, `/vendors/` | Missing on about, methodology, disclosure, changelog, blog index, compare picker, privacy, terms, contact | Added to every page through the BaseLayout `breadcrumbs` prop, plus the new editorial policy, guides and glossary pages |
| Dataset dateModified (compare) | latest fact date across both vendors | Correct | Unchanged |

Article `image` (an optional field Google flags) is still a v3 candidate.

## 5. Other findings

- **Privacy policy said "no newsletter"**. The new newsletter paragraph renders only while the newsletter flag is on, so the policy cannot describe processing that does not happen.
- **Blog index is titled "The dispatches."**, newsletter-era framing from v1. Left as is. Simon's call as editor.
- **`/disclosure/` was titled "Affiliate disclosure"** and covered referrals only. Extended to advertising and sponsorship (section 2 of the brief) and retitled "Disclosure".
- **Lighthouse ≥ 90 has been owed since piece 12.** This branch ran Lighthouse 13.5.0 locally for the first time (Playwright's headless Chromium, mobile emulation, `astro preview`, after all changes). `/`, `/vendors/modal/`, `/compare/aws-bedrock-provisioned-vs-ovhcloud/`, `/blog/residency-vs-sovereignty/`, `/guides/` and `/editorial-policy/` each scored **100** for performance, accessibility, best practices and SEO, with CLS 0 and LCP 1.5 s. Localhost has no network latency, so a run against the live site after merge is still the real number. Noindexed pages lose the SEO "is crawlable" audit by design.
