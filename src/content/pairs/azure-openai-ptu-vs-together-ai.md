---
pair: azure-openai-ptu-vs-together-ai
last_verified: "2026-10-22"
sources:
  - url: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput-billing
    verified: "2026-10-22"
  - url: https://www.together.ai/pricing
    verified: "2026-10-22"
  - url: https://azure.microsoft.com/en-us/pricing/details/azure-openai/
    verified: "2026-10-22"
  - url: https://www.together.ai/dedicated-endpoints
    verified: "2026-10-22"
  - url: https://www.together.ai/terms-of-service
    verified: "2026-10-22"
  - url: https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types
    verified: "2026-10-22"
---

Both vendors sell something they call a PTU, and the units are not the same.
On [Azure OpenAI Provisioned Throughput](/vendors/azure-openai-ptu/), a
provisioned throughput unit reserves capacity on Microsoft-hosted OpenAI models,
[billed hourly or through 1-month or 1-year reservations](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput-billing). On
[Together AI](/vendors/together-ai/), [reserved dedicated capacity](https://www.together.ai/pricing)
is sold in throughput units whose tokens per minute depend on the model, on
top of per-GPU-hour dedicated endpoints for open models.

Prices are public on both. Microsoft's [table](https://azure.microsoft.com/en-us/pricing/details/azure-openai/) listed GPT-5.5 at
$1 per PTU per hour on a Global deployment on 22 October 2026, with a 15-PTU
minimum (labelled estimates). Together lists dedicated endpoint prices per GPU
per hour.

Isolation and residency differ in strength. Together says
[every dedicated deployment runs on single-tenant, isolated GPUs](https://www.together.ai/dedicated-endpoints) and
that customers choose the deployment region for data residency, but its
[terms](https://www.together.ai/terms-of-service) make no geographic commitment, so residency is Stated. Azure's
[deployment types](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types) bind processing to a data zone or geography, and
this site records Azure residency as Contractual (see the profile).

Both are US companies; Together Computer, Inc. is a Delaware corporation.
