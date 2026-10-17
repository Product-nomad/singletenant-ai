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
| Residency | both residency guarantees are verified and differ | 0.5 when one side is verified and the other is not |
| Certs | the cert sets have no overlap | Jaccard distance of the two sets; 0 if either set is empty |
| Regions | the region sets have no overlap | Jaccard distance; 0 if either set is empty |
| Pricing | both public-pricing flags are verified and differ | none |

Free text is excluded. Pricing-model wording and deployment-model tokens always differ between vendors, so they carry no signal. Unverified gaps score 0 because a "Not verified versus Not verified" row is identical on every page.

**Threshold: 40** (at least 2.4 of the 6 dimensions). Pairs below it render `noindex, follow` and are left out of the sitemap. They stay reachable from both vendor profiles (each profile links all 15 of its comparisons) and from the `/compare/` picker, and the `follow` directive keeps link equity flowing. The constant is `INDEX_MIN_SCORE` in `src/lib/compare.mjs`. Per-pair overrides go in `INDEX_OVERRIDES` in the same file (empty today).

Distribution: 0 to 9: 1 pair; 10 to 19: 15; 20 to 29: 16; 30 to 39: 19; 40 to 49: 21; 50 to 59: 17; 60 to 69: 25; 70 to 79: 5; 80 or more: 1. Result: **69 indexed, 51 noindex**.

### 2.2 What the score rewards

Cross-category and cross-jurisdiction pairs score highest, for example a US hyperscaler against an EU or UK sovereign provider. Those are the pages where the comparison answers a real sovereignty question, which is the site's niche. Same-category US pairs with identical cert sets and the same unverified gaps (Baseten vs RunPod scores 4) render near-identical pages.

### 2.3 Open decision: rival pairs that score low but have search demand

The score measures how distinctive a page's content is, not how much search demand it has. These head-to-head pairs fall below 40 because the two vendors look alike in the data, yet they are probably the comparisons buyers search for most:

| Pair | Score |
|---|---:|
| AWS Bedrock Provisioned vs Azure OpenAI PTU | 27 |
| Azure OpenAI PTU vs Vertex AI Provisioned | 26 |
| AWS Bedrock Provisioned vs Vertex AI Provisioned | 15 |
| OVHcloud vs Scaleway | 17 |
| Nebius vs OVHcloud | 36 |
| Modal vs RunPod | 21 |

**Recommendation**: do not index these as they stand. They are exactly the thin pages Google discounts. Either add a short written editorial section to each (the hyperscaler trio first) and then list them in `INDEX_OVERRIDES.index`, or leave them noindexed. A search-volume pull (DataForSEO, about $0.10 for all 120 pairs) would rank the candidates if you want evidence before writing.

### 2.4 Indexed set (69 pairs, score >= 40)

| Score | Pair | Cat | Jur | Res | Certs | Regions | Pricing |
|---:|---|---:|---:|---:|---:|---:|---:|
| 80 | [Amazon Bedrock Provisioned Throughput vs OVHcloud](/compare/aws-bedrock-provisioned-vs-ovhcloud/) | 1 | 1 | 0.50 | 0.63 | 0.67 | 1 |
| 79 | [Amazon Bedrock Provisioned Throughput vs Civo](/compare/aws-bedrock-provisioned-vs-civo/) | 1 | 1 | 0 | 0.71 | 1 | 1 |
| 73 | [Amazon Bedrock Provisioned Throughput vs Scaleway](/compare/aws-bedrock-provisioned-vs-scaleway/) | 1 | 1 | 0 | 0.71 | 0.67 | 1 |
| 72 | [Civo vs OVHcloud](/compare/civo-vs-ovhcloud/) | 1 | 1 | 0.50 | 0.80 | 1 | 0 |
| 72 | [Civo vs RunPod](/compare/civo-vs-runpod/) | 1 | 1 | 0.50 | 0.80 | 1 | 0 |
| 71 | [Modal vs OVHcloud](/compare/modal-vs-ovhcloud/) | 1 | 1 | 0.50 | 1 | 0.75 | 0 |
| 69 | [Civo vs Hugging Face Inference Endpoints](/compare/civo-vs-huggingface-inference-endpoints/) | 1 | 1 | 0.50 | 0.67 | 1 | 0 |
| 68 | [Baseten vs Civo](/compare/baseten-vs-civo/) | 1 | 1 | 0.50 | 0.80 | 0.75 | 0 |
| 68 | [Baseten vs Scaleway](/compare/baseten-vs-scaleway/) | 1 | 1 | 0.50 | 0.80 | 0.75 | 0 |
| 68 | [Civo vs Databricks Model Serving](/compare/civo-vs-databricks-model-serving/) | 1 | 1 | 0.50 | 0.60 | 1 | 0 |
| 67 | [Civo vs Nebius](/compare/civo-vs-nebius/) | 1 | 1 | 0.50 | 0.50 | 1 | 0 |
| 67 | [Civo vs Vertex AI Provisioned Throughput](/compare/civo-vs-vertex-ai-provisioned/) | 1 | 1 | 0.50 | 0.50 | 1 | 0 |
| 67 | [Fireworks AI vs Scaleway](/compare/fireworks-ai-vs-scaleway/) | 1 | 1 | 0.50 | 0.75 | 0.75 | 0 |
| 67 | [Scaleway vs Together AI](/compare/scaleway-vs-together-ai/) | 1 | 1 | 1 | 1 | 0 | 0 |
| 66 | [RunPod vs Scaleway](/compare/runpod-vs-scaleway/) | 1 | 1 | 0.50 | 0.80 | 0.67 | 0 |
| 64 | [Civo vs CoreWeave](/compare/civo-vs-coreweave/) | 1 | 1 | 0.50 | 0.67 | 0.67 | 0 |
| 64 | [Civo vs Fireworks AI](/compare/civo-vs-fireworks-ai/) | 1 | 1 | 0.50 | 0.33 | 1 | 0 |
| 64 | [CoreWeave vs Scaleway](/compare/coreweave-vs-scaleway/) | 1 | 1 | 0.50 | 0.67 | 0.67 | 0 |
| 63 | [Databricks Model Serving vs Scaleway](/compare/databricks-model-serving-vs-scaleway/) | 1 | 1 | 0.50 | 0.60 | 0.67 | 0 |
| 63 | [Modal vs Nebius](/compare/modal-vs-nebius/) | 1 | 1 | 0.50 | 0.80 | 0.50 | 0 |
| 63 | [Modal vs Scaleway](/compare/modal-vs-scaleway/) | 1 | 1 | 0 | 1 | 0.75 | 0 |
| 62 | [Amazon Bedrock Provisioned Throughput vs CoreWeave](/compare/aws-bedrock-provisioned-vs-coreweave/) | 1 | 0 | 0.50 | 0.71 | 0.50 | 1 |
| 62 | [Amazon Bedrock Provisioned Throughput vs Together AI](/compare/aws-bedrock-provisioned-vs-together-ai/) | 1 | 0 | 1 | 0.71 | 0 | 1 |
| 62 | [Azure OpenAI Provisioned Throughput (PTU) vs OVHcloud](/compare/azure-openai-ptu-vs-ovhcloud/) | 1 | 1 | 0.50 | 0.57 | 0.67 | 0 |
| 61 | [Azure OpenAI Provisioned Throughput (PTU) vs Civo](/compare/azure-openai-ptu-vs-civo/) | 1 | 1 | 0 | 0.67 | 1 | 0 |
| 61 | [Civo vs Scaleway](/compare/civo-vs-scaleway/) | 1 | 1 | 0 | 0.67 | 1 | 0 |
| 61 | [Civo vs Together AI](/compare/civo-vs-together-ai/) | 1 | 1 | 1 | 0.67 | 0 | 0 |
| 61 | [Hugging Face Inference Endpoints vs Scaleway](/compare/huggingface-inference-endpoints-vs-scaleway/) | 1 | 1 | 0.50 | 0.67 | 0.50 | 0 |
| 61 | [Scaleway vs Vertex AI Provisioned Throughput](/compare/scaleway-vs-vertex-ai-provisioned/) | 1 | 1 | 0.50 | 0.50 | 0.67 | 0 |
| 60 | [Baseten vs OVHcloud](/compare/baseten-vs-ovhcloud/) | 1 | 1 | 0 | 0.86 | 0.75 | 0 |
| 60 | [Fireworks AI vs OVHcloud](/compare/fireworks-ai-vs-ovhcloud/) | 1 | 1 | 0 | 0.83 | 0.75 | 0 |
| 59 | [Amazon Bedrock Provisioned Throughput vs Hugging Face Inference Endpoints](/compare/aws-bedrock-provisioned-vs-huggingface-inference-endpoints/) | 1 | 0 | 0.50 | 0.71 | 0.33 | 1 |
| 59 | [OVHcloud vs RunPod](/compare/ovhcloud-vs-runpod/) | 1 | 1 | 0 | 0.86 | 0.67 | 0 |
| 58 | [CoreWeave vs OVHcloud](/compare/coreweave-vs-ovhcloud/) | 1 | 1 | 0 | 0.80 | 0.67 | 0 |
| 58 | [OVHcloud vs Together AI](/compare/ovhcloud-vs-together-ai/) | 1 | 1 | 0.50 | 1 | 0 | 0 |
| 57 | [Azure OpenAI Provisioned Throughput (PTU) vs Nebius](/compare/azure-openai-ptu-vs-nebius/) | 1 | 1 | 0.50 | 0.57 | 0.33 | 0 |
| 57 | [Civo vs Modal](/compare/civo-vs-modal/) | 1 | 1 | 0 | 0.67 | 0.75 | 0 |
| 56 | [Azure OpenAI Provisioned Throughput (PTU) vs Scaleway](/compare/azure-openai-ptu-vs-scaleway/) | 1 | 1 | 0 | 0.67 | 0.67 | 0 |
| 56 | [Databricks Model Serving vs OVHcloud](/compare/databricks-model-serving-vs-ovhcloud/) | 1 | 1 | 0 | 0.71 | 0.67 | 0 |
| 56 | [OVHcloud vs Vertex AI Provisioned Throughput](/compare/ovhcloud-vs-vertex-ai-provisioned/) | 1 | 1 | 0 | 0.67 | 0.67 | 0 |
| 55 | [Amazon Bedrock Provisioned Throughput vs Fireworks AI](/compare/aws-bedrock-provisioned-vs-fireworks-ai/) | 1 | 0 | 0.50 | 0.57 | 0.25 | 1 |
| 55 | [Hugging Face Inference Endpoints vs OVHcloud](/compare/huggingface-inference-endpoints-vs-ovhcloud/) | 1 | 1 | 0 | 0.80 | 0.50 | 0 |
| 55 | [Nebius vs Together AI](/compare/nebius-vs-together-ai/) | 1 | 1 | 0.50 | 0.80 | 0 | 0 |
| 54 | [Amazon Bedrock Provisioned Throughput vs Nebius](/compare/aws-bedrock-provisioned-vs-nebius/) | 1 | 1 | 0.50 | 0.43 | 0.33 | 0 |
| 54 | [Amazon Bedrock Provisioned Throughput vs NVIDIA NIM](/compare/aws-bedrock-provisioned-vs-nvidia-nim/) | 1 | 0 | 0.50 | 0.71 | 0 | 1 |
| 53 | [Amazon Bedrock Provisioned Throughput vs Baseten](/compare/aws-bedrock-provisioned-vs-baseten/) | 1 | 0 | 0.50 | 0.43 | 0.25 | 1 |
| 53 | [Civo vs NVIDIA NIM](/compare/civo-vs-nvidia-nim/) | 1 | 1 | 0.50 | 0.67 | 0 | 0 |
| 52 | [Fireworks AI vs Nebius](/compare/fireworks-ai-vs-nebius/) | 1 | 1 | 0 | 0.60 | 0.50 | 0 |
| 49 | [Amazon Bedrock Provisioned Throughput vs Modal](/compare/aws-bedrock-provisioned-vs-modal/) | 1 | 0 | 0 | 0.71 | 0.25 | 1 |
| 49 | [Amazon Bedrock Provisioned Throughput vs RunPod](/compare/aws-bedrock-provisioned-vs-runpod/) | 1 | 0 | 0.50 | 0.43 | 0 | 1 |
| 48 | [Baseten vs Nebius](/compare/baseten-vs-nebius/) | 1 | 1 | 0 | 0.40 | 0.50 | 0 |
| 47 | [CoreWeave vs Nebius](/compare/coreweave-vs-nebius/) | 1 | 1 | 0 | 0.50 | 0.33 | 0 |
| 47 | [Databricks Model Serving vs Nebius](/compare/databricks-model-serving-vs-nebius/) | 1 | 1 | 0 | 0.50 | 0.33 | 0 |
| 46 | [Amazon Bedrock Provisioned Throughput vs Databricks Model Serving](/compare/aws-bedrock-provisioned-vs-databricks-model-serving/) | 1 | 0 | 0.50 | 0.29 | 0 | 1 |
| 46 | [Nebius vs RunPod](/compare/nebius-vs-runpod/) | 1 | 1 | 0 | 0.40 | 0.33 | 0 |
| 45 | [Azure OpenAI Provisioned Throughput (PTU) vs Baseten](/compare/azure-openai-ptu-vs-baseten/) | 1 | 0 | 0.50 | 0.57 | 0.60 | 0 |
| 44 | [Azure OpenAI Provisioned Throughput (PTU) vs CoreWeave](/compare/azure-openai-ptu-vs-coreweave/) | 1 | 0 | 0.50 | 0.67 | 0.50 | 0 |
| 44 | [Azure OpenAI Provisioned Throughput (PTU) vs Together AI](/compare/azure-openai-ptu-vs-together-ai/) | 1 | 0 | 1 | 0.67 | 0 | 0 |
| 44 | [Hugging Face Inference Endpoints vs Modal](/compare/huggingface-inference-endpoints-vs-modal/) | 1 | 0 | 0.50 | 0.67 | 0.50 | 0 |
| 43 | [Azure OpenAI Provisioned Throughput (PTU) vs RunPod](/compare/azure-openai-ptu-vs-runpod/) | 1 | 0 | 0.50 | 0.57 | 0.50 | 0 |
| 43 | [Modal vs Vertex AI Provisioned Throughput](/compare/modal-vs-vertex-ai-provisioned/) | 1 | 0 | 0.50 | 0.80 | 0.25 | 0 |
| 42 | [Azure OpenAI Provisioned Throughput (PTU) vs Hugging Face Inference Endpoints](/compare/azure-openai-ptu-vs-huggingface-inference-endpoints/) | 1 | 0 | 0.50 | 0.67 | 0.33 | 0 |
| 42 | [Hugging Face Inference Endpoints vs Nebius](/compare/huggingface-inference-endpoints-vs-nebius/) | 1 | 1 | 0 | 0.50 | 0 | 0 |
| 42 | [Modal vs NVIDIA NIM](/compare/modal-vs-nvidia-nim/) | 1 | 0 | 0.50 | 1 | 0 | 0 |
| 42 | [Nebius vs NVIDIA NIM](/compare/nebius-vs-nvidia-nim/) | 1 | 1 | 0 | 0.50 | 0 | 0 |
| 42 | [Nebius vs Scaleway](/compare/nebius-vs-scaleway/) | 0 | 1 | 0.50 | 0.50 | 0.50 | 0 |
| 42 | [NVIDIA NIM vs OVHcloud](/compare/nvidia-nim-vs-ovhcloud/) | 1 | 1 | 0 | 0.50 | 0 | 0 |
| 42 | [NVIDIA NIM vs Scaleway](/compare/nvidia-nim-vs-scaleway/) | 1 | 1 | 0.50 | 0 | 0 | 0 |
| 42 | [NVIDIA NIM vs Together AI](/compare/nvidia-nim-vs-together-ai/) | 1 | 0 | 0.50 | 1 | 0 | 0 |

### 2.5 noindex,follow (51 pairs, score < 40)

| Score | Pair | Cat | Jur | Res | Certs | Regions | Pricing |
|---:|---|---:|---:|---:|---:|---:|---:|
| 39 | [Databricks Model Serving vs Modal](/compare/databricks-model-serving-vs-modal/) | 1 | 0 | 0.50 | 0.60 | 0.25 | 0 |
| 39 | [Nebius vs Vertex AI Provisioned Throughput](/compare/nebius-vs-vertex-ai-provisioned/) | 1 | 1 | 0 | 0 | 0.33 | 0 |
| 38 | [Azure OpenAI Provisioned Throughput (PTU) vs Fireworks AI](/compare/azure-openai-ptu-vs-fireworks-ai/) | 1 | 0 | 0.50 | 0.50 | 0.25 | 0 |
| 38 | [Azure OpenAI Provisioned Throughput (PTU) vs Modal](/compare/azure-openai-ptu-vs-modal/) | 1 | 0 | 0 | 0.67 | 0.60 | 0 |
| 38 | [Fireworks AI vs Hugging Face Inference Endpoints](/compare/fireworks-ai-vs-huggingface-inference-endpoints/) | 1 | 0 | 0 | 0.75 | 0.50 | 0 |
| 38 | [Together AI vs Vertex AI Provisioned Throughput](/compare/together-ai-vs-vertex-ai-provisioned/) | 1 | 0 | 0.50 | 0.80 | 0 | 0 |
| 36 | [Azure OpenAI Provisioned Throughput (PTU) vs Databricks Model Serving](/compare/azure-openai-ptu-vs-databricks-model-serving/) | 1 | 0 | 0.50 | 0.17 | 0.50 | 0 |
| 36 | [Azure OpenAI Provisioned Throughput (PTU) vs NVIDIA NIM](/compare/azure-openai-ptu-vs-nvidia-nim/) | 1 | 0 | 0.50 | 0.67 | 0 | 0 |
| 36 | [Hugging Face Inference Endpoints vs Together AI](/compare/huggingface-inference-endpoints-vs-together-ai/) | 1 | 0 | 0.50 | 0.67 | 0 | 0 |
| 36 | [Nebius vs OVHcloud](/compare/nebius-vs-ovhcloud/) | 0 | 1 | 0 | 0.67 | 0.50 | 0 |
| 35 | [CoreWeave vs Databricks Model Serving](/compare/coreweave-vs-databricks-model-serving/) | 1 | 0 | 0 | 0.60 | 0.50 | 0 |
| 35 | [Databricks Model Serving vs Together AI](/compare/databricks-model-serving-vs-together-ai/) | 1 | 0 | 0.50 | 0.60 | 0 | 0 |
| 33 | [Baseten vs Hugging Face Inference Endpoints](/compare/baseten-vs-huggingface-inference-endpoints/) | 1 | 0 | 0 | 0.50 | 0.50 | 0 |
| 33 | [CoreWeave vs Vertex AI Provisioned Throughput](/compare/coreweave-vs-vertex-ai-provisioned/) | 1 | 0 | 0 | 0.50 | 0.50 | 0 |
| 31 | [Fireworks AI vs Vertex AI Provisioned Throughput](/compare/fireworks-ai-vs-vertex-ai-provisioned/) | 1 | 0 | 0 | 0.60 | 0.25 | 0 |
| 31 | [Hugging Face Inference Endpoints vs RunPod](/compare/huggingface-inference-endpoints-vs-runpod/) | 1 | 0 | 0 | 0.50 | 0.33 | 0 |
| 31 | [Hugging Face Inference Endpoints vs Vertex AI Provisioned Throughput](/compare/huggingface-inference-endpoints-vs-vertex-ai-provisioned/) | 1 | 0 | 0 | 0.50 | 0.33 | 0 |
| 30 | [Baseten vs NVIDIA NIM](/compare/baseten-vs-nvidia-nim/) | 1 | 0 | 0 | 0.80 | 0 | 0 |
| 30 | [NVIDIA NIM vs RunPod](/compare/nvidia-nim-vs-runpod/) | 1 | 0 | 0 | 0.80 | 0 | 0 |
| 29 | [Baseten vs Databricks Model Serving](/compare/baseten-vs-databricks-model-serving/) | 1 | 0 | 0 | 0.50 | 0.25 | 0 |
| 29 | [Fireworks AI vs NVIDIA NIM](/compare/fireworks-ai-vs-nvidia-nim/) | 1 | 0 | 0 | 0.75 | 0 | 0 |
| 28 | [CoreWeave vs NVIDIA NIM](/compare/coreweave-vs-nvidia-nim/) | 1 | 0 | 0 | 0.67 | 0 | 0 |
| 27 | [Amazon Bedrock Provisioned Throughput vs Azure OpenAI Provisioned Throughput (PTU)](/compare/aws-bedrock-provisioned-vs-azure-openai-ptu/) | 0 | 0 | 0 | 0.14 | 0.50 | 1 |
| 27 | [Baseten vs Vertex AI Provisioned Throughput](/compare/baseten-vs-vertex-ai-provisioned/) | 1 | 0 | 0 | 0.40 | 0.25 | 0 |
| 27 | [Databricks Model Serving vs Fireworks AI](/compare/databricks-model-serving-vs-fireworks-ai/) | 1 | 0 | 0 | 0.40 | 0.25 | 0 |
| 26 | [Azure OpenAI Provisioned Throughput (PTU) vs Vertex AI Provisioned Throughput](/compare/azure-openai-ptu-vs-vertex-ai-provisioned/) | 0 | 0 | 0.50 | 0.57 | 0.50 | 0 |
| 25 | [Databricks Model Serving vs RunPod](/compare/databricks-model-serving-vs-runpod/) | 1 | 0 | 0 | 0.50 | 0 | 0 |
| 25 | [Databricks Model Serving vs Vertex AI Provisioned Throughput](/compare/databricks-model-serving-vs-vertex-ai-provisioned/) | 1 | 0 | 0 | 0.50 | 0 | 0 |
| 25 | [NVIDIA NIM vs Vertex AI Provisioned Throughput](/compare/nvidia-nim-vs-vertex-ai-provisioned/) | 1 | 0 | 0 | 0.50 | 0 | 0 |
| 24 | [CoreWeave vs Modal](/compare/coreweave-vs-modal/) | 0 | 0 | 0.50 | 0.67 | 0.25 | 0 |
| 23 | [CoreWeave vs Fireworks AI](/compare/coreweave-vs-fireworks-ai/) | 0 | 0 | 0 | 0.75 | 0.60 | 0 |
| 23 | [RunPod vs Vertex AI Provisioned Throughput](/compare/runpod-vs-vertex-ai-provisioned/) | 1 | 0 | 0 | 0.40 | 0 | 0 |
| 22 | [CoreWeave vs Hugging Face Inference Endpoints](/compare/coreweave-vs-huggingface-inference-endpoints/) | 1 | 0 | 0 | 0 | 0.33 | 0 |
| 21 | [Fireworks AI vs Modal](/compare/fireworks-ai-vs-modal/) | 0 | 0 | 0.50 | 0.33 | 0.40 | 0 |
| 21 | [Modal vs RunPod](/compare/modal-vs-runpod/) | 0 | 0 | 0.50 | 0.50 | 0.25 | 0 |
| 19 | [CoreWeave vs Together AI](/compare/coreweave-vs-together-ai/) | 0 | 0 | 0.50 | 0.67 | 0 | 0 |
| 17 | [Baseten vs Fireworks AI](/compare/baseten-vs-fireworks-ai/) | 0 | 0 | 0 | 0.60 | 0.40 | 0 |
| 17 | [Baseten vs Modal](/compare/baseten-vs-modal/) | 0 | 0 | 0.50 | 0.50 | 0 | 0 |
| 17 | [Baseten vs Together AI](/compare/baseten-vs-together-ai/) | 0 | 0 | 0.50 | 0.50 | 0 | 0 |
| 17 | [CoreWeave vs RunPod](/compare/coreweave-vs-runpod/) | 0 | 0 | 0 | 0.50 | 0.50 | 0 |
| 17 | [Modal vs Together AI](/compare/modal-vs-together-ai/) | 0 | 0 | 1 | 0 | 0 | 0 |
| 17 | [OVHcloud vs Scaleway](/compare/ovhcloud-vs-scaleway/) | 0 | 0 | 0.50 | 0.50 | 0 | 0 |
| 17 | [RunPod vs Together AI](/compare/runpod-vs-together-ai/) | 0 | 0 | 0.50 | 0.50 | 0 | 0 |
| 16 | [Databricks Model Serving vs Hugging Face Inference Endpoints](/compare/databricks-model-serving-vs-huggingface-inference-endpoints/) | 0 | 0 | 0 | 0.60 | 0.33 | 0 |
| 15 | [Amazon Bedrock Provisioned Throughput vs Vertex AI Provisioned Throughput](/compare/aws-bedrock-provisioned-vs-vertex-ai-provisioned/) | 0 | 0 | 0.50 | 0.43 | 0 | 0 |
| 14 | [Fireworks AI vs RunPod](/compare/fireworks-ai-vs-runpod/) | 0 | 0 | 0 | 0.60 | 0.25 | 0 |
| 14 | [Fireworks AI vs Together AI](/compare/fireworks-ai-vs-together-ai/) | 0 | 0 | 0.50 | 0.33 | 0 | 0 |
| 13 | [Baseten vs CoreWeave](/compare/baseten-vs-coreweave/) | 0 | 0 | 0 | 0.50 | 0.25 | 0 |
| 11 | [Hugging Face Inference Endpoints vs NVIDIA NIM](/compare/huggingface-inference-endpoints-vs-nvidia-nim/) | 0 | 0 | 0 | 0.67 | 0 | 0 |
| 10 | [Databricks Model Serving vs NVIDIA NIM](/compare/databricks-model-serving-vs-nvidia-nim/) | 0 | 0 | 0 | 0.60 | 0 | 0 |
| 4 | [Baseten vs RunPod](/compare/baseten-vs-runpod/) | 0 | 0 | 0 | 0 | 0.25 | 0 |

## 3. Vendor YAML freshness and sources

Audit date 2026-10-17, so the 60-day staleness cutoff is **2026-08-18**.

**Every verified fact in the database is older than 60 days.** All 16 vendors were last checked between 7 and 18 July 2026, 91 to 102 days ago. No fact has been re-verified since the v2.3 sprint. The drift watch (piece 14) that would catch evidence-URL rot has not been built.

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

- `regions` (all 16 vendors): provenance exists only as YAML comments with a URL. It is not rendered and not validated. This was already a v3 candidate.
- `deployment_models` (all 16): no provenance field or comment.
- `tagline`, `notes`, `category`: editorial fields. `notes` often restates sourced facts but cites nothing inline.

**Fix on this branch**: each vendor gains `last_verified` and `sources[]`. `sources` lists every URL the profile relies on: all evidence URLs plus the region provenance URLs that were only in comments. A schema rule forbids an evidence URL that is missing from `sources`. `last_verified` is set conservatively to the **oldest** fact date, so the claim "Last verified" never overstates freshness. The schema rejects a `last_verified` later than any fact's own verified date. These dates are unchanged by this branch: nothing was re-verified, and the pages will honestly show "Last verified 07 Jul 2026" and similar.

**Decision**: a re-verification pass on all 16 vendors (about 86 facts) is overdue, and the stale dates are now prominent on every profile. This is the most important follow-up. It is a research task under the primary-sources rule, not something to bundle into this PR.

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
