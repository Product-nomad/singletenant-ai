---
title: "Provisioned throughput vs pay-per-token for LLM serving"
description: "Reserved LLM capacity against per-token billing: what each buys, the units and terms each vendor uses, and how to work out which is cheaper for your traffic."
audience: "Anyone choosing between reserved and per-token LLM capacity, on any platform"
order: 12
jurisdiction: []
vendors:
  - azure-openai-ptu
  - aws-bedrock-provisioned
  - vertex-ai-provisioned
  - databricks-model-serving
  - together-ai
  - coreweave
  - nebius
  - fireworks-ai
  - modal
  - baseten
status: published
pub_date: "2026-10-22"
last_verified: "2026-10-22"
sources:
  - url: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput
    verified: "2026-10-22"
  - url: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput-billing
    verified: "2026-10-22"
  - url: https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html
    verified: "2026-10-22"
  - url: https://www.together.ai/dedicated-endpoints
    verified: "2026-10-22"
  - url: https://cloud.google.com/blog/products/ai-machine-learning/provisioned-throughput-on-vertex-ai
    verified: "2026-10-22"
  - url: https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/deploy-prov-throughput-foundation-model-apis
    verified: "2026-10-22"
  - url: https://www.together.ai/pricing
    verified: "2026-10-22"
  - url: https://www.coreweave.com/pricing
    verified: "2026-10-22"
  - url: https://fireworks.ai/pricing
    verified: "2026-10-22"
  - url: https://modal.com/pricing
    verified: "2026-10-22"
  - url: https://www.baseten.co/pricing
    verified: "2026-10-22"
  - url: https://docs.tokenfactory.nebius.com/ai-models-inference/dedicated-endpoints/billing-policy
    verified: "2026-10-22"
  - url: https://azure.microsoft.com/en-us/pricing/details/azure-openai/
    verified: "2026-10-22"
---

Every vendor in the [matrix](/vendors/) sells LLM serving in one of two ways,
and several sell both. Pay-per-token charges for what you send and receive.
Provisioned (or reserved, or dedicated) capacity charges for time, whether or
not you use it. This guide compares the two on primary sources checked on
22 October 2026.

## What each one buys

**Pay-per-token** prices input and output tokens separately on shared serving.
Microsoft's [comparison](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput) gives Standard deployments no latency
SLA and recommends them for development, testing, low volume and variable
traffic.

**Provisioned capacity** reserves throughput for you. Microsoft charges for it
[hourly whether or not the deployment is handling requests](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput-billing), and
AWS bills Provisioned Throughput
[until you delete it](https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html). In return you get a defined latency target
(Azure) or a guaranteed throughput level per unit (AWS). Microsoft recommends
it for predictable traffic, latency-sensitive applications and production
volume where per-token billing becomes expensive.

Reserved capacity is not automatically single-tenant hardware. Some vendors
say their dedicated capacity is single-tenant (Together AI states
[every dedicated deployment runs on single-tenant, isolated GPUs](https://www.together.ai/dedicated-endpoints));
others reserve throughput without describing the hardware. Check the
deployment and notes on each profile.

## Units and terms differ by vendor

| Vendor | Reserved unit | Terms (from the vendor's documentation) |
|---|---|---|
| [Azure OpenAI](/vendors/azure-openai-ptu/) | Provisioned throughput unit (PTU) | [Hourly, or 1-month or 1-year reservations](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput-billing) |
| [Amazon Bedrock](/vendors/aws-bedrock-provisioned/) | Model unit (MU) | [No commitment, 1 month or 6 months](https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html) |
| [Vertex AI](/vendors/vertex-ai-provisioned/) | Generative AI scale unit (GSU) | Fixed-cost terms, [including 1-week terms for select models](https://cloud.google.com/blog/products/ai-machine-learning/provisioned-throughput-on-vertex-ai) |
| [Databricks](/vendors/databricks-model-serving/) | [Model units or throughput bands](https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/deploy-prov-throughput-foundation-model-apis) | On-demand with no term commitment, or reserved |
| [Together AI](/vendors/together-ai/) | [Throughput units (PTUs)](https://www.together.ai/pricing) or GPU-hours | Reserved capacity, or per GPU per hour |
| [CoreWeave](/vendors/coreweave/) | GPU-hours | [On-demand, spot, or up to 60% off for committed usage](https://www.coreweave.com/pricing) |

Dedicated GPU platforms bill time directly instead:
[Fireworks AI](/vendors/fireworks-ai/) [per GPU second](https://fireworks.ai/pricing),
[Modal](/vendors/modal/) [per second](https://modal.com/pricing),
[Baseten](/vendors/baseten/) [down to the minute](https://www.baseten.co/pricing), and
[Nebius](/vendors/nebius/) dedicated endpoints
[while at least one replica is running](https://docs.tokenfactory.nebius.com/ai-models-inference/dedicated-endpoints/billing-policy).

Two units share a name: Azure's PTU and Together's throughput unit are
different vendors' measures and cannot be compared one for one.

## Working out which is cheaper

The method is the same everywhere:

1. Price the smallest reservation you could buy for the hours you need it.
2. Price your expected token volume at the same model's per-token rates.
3. Compare, then check that the reservation's throughput covers your peak.

With Microsoft's [published GPT-5.5 rates](https://azure.microsoft.com/en-us/pricing/details/azure-openai/) on 22 October 2026
(estimates, in US dollars): the minimum Global provisioned deployment is 15
PTUs at $1 per PTU per hour, so $15 an hour. At Standard Global rates of $5 per
million input tokens and $30 per million output tokens, $15 buys 3 million
input tokens or 500,000 output tokens. If your hourly Standard bill for real
traffic would exceed $15, and 15 PTUs can carry that traffic, provisioned is
cheaper; the throughput per PTU is
model-specific and not verified here. A
[monthly reservation](https://azure.microsoft.com/en-us/pricing/details/azure-openai/) ($260 per PTU on Global) moves the line
further towards provisioned for steady traffic.

Spiky traffic usually favours per-token billing, or a reservation sized for the
baseline with overflow sent elsewhere; Azure supports this with
[spillover](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput) to a Standard deployment.

## Vendor detail

- [Azure OpenAI PTU explained](/guides/azure-openai-ptu-explained/)
- [Amazon Bedrock provisioned throughput](/guides/bedrock-provisioned-throughput/)
- Side by side:
  [Bedrock vs Azure](/compare/aws-bedrock-provisioned-vs-azure-openai-ptu/),
  [Azure vs Vertex AI](/compare/azure-openai-ptu-vs-vertex-ai-provisioned/),
  [Bedrock vs Vertex AI](/compare/aws-bedrock-provisioned-vs-vertex-ai-provisioned/),
  [Databricks vs Fireworks AI](/compare/databricks-model-serving-vs-fireworks-ai/)
