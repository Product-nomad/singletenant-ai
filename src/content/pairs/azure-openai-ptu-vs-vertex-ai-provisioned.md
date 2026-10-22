---
pair: azure-openai-ptu-vs-vertex-ai-provisioned
last_verified: "2026-10-22"
sources:
  - url: https://policies.google.com/terms
    verified: "2026-10-22"
  - url: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput-billing
    verified: "2026-10-22"
  - url: https://azure.microsoft.com/en-us/pricing/details/azure-openai/
    verified: "2026-10-22"
  - url: https://cloud.google.com/blog/products/ai-machine-learning/provisioned-throughput-on-vertex-ai
    verified: "2026-10-22"
  - url: https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types
    verified: "2026-10-22"
  - url: https://cloud.google.com/terms/service-terms
    verified: "2026-10-22"
---

Both reserve capacity for a hyperscaler's own model family, and both parents
are US companies: Microsoft, and Google LLC, which its
[terms](https://policies.google.com/terms) describe as organised under Delaware law. The useful
differences are the unit, the term and how openly each prices it.

[Azure OpenAI Provisioned Throughput](/vendors/azure-openai-ptu/) sells
provisioned throughput units (PTUs), billed [hourly or through Azure
Reservations](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput-billing) on 1-month or 1-year terms. Microsoft
[publishes per-PTU rates](https://azure.microsoft.com/en-us/pricing/details/azure-openai/): on 22 October 2026, GPT-5.5 listed at
$1 per PTU per hour on a Global deployment and $2 on a Regional one, with
minimums of 15 and 50 PTUs. Microsoft labels these prices estimates.
[Vertex AI Provisioned Throughput](/vendors/vertex-ai-provisioned/) sells
generative AI scale units (GSUs) on fixed-cost terms, now including
[1-week terms](https://cloud.google.com/blog/products/ai-machine-learning/provisioned-throughput-on-vertex-ai) for select models. A public GSU price list is not
verified here.

On location, Azure's [deployment types](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types) decide where prompts are
processed: Data Zone keeps processing inside a Microsoft-defined zone (US, EU
or Asia Pacific), and Regional inside the chosen Azure geography. Google's
[Service Specific Terms](https://cloud.google.com/terms/service-terms) (AI/ML Data Location) commit to storing
data and running machine learning processing in a customer-chosen
multi-region.

The practical question is which models you need. The Vertex
[announcement](https://cloud.google.com/blog/products/ai-machine-learning/provisioned-throughput-on-vertex-ai) covers dedicated capacity for Gemini models; Azure
PTUs serve the Azure OpenAI catalogue.
