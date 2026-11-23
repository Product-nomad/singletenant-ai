---
title: "Azure OpenAI PTU: what a provisioned throughput unit is"
description: "A PTU is Azure OpenAI's unit of reserved model capacity, billed hourly whether used or not, or cheaper on a reservation. Costs and deployment types explained."
audience: "Teams pricing or procuring Azure OpenAI capacity for production workloads"
order: 10
jurisdiction: []
vendors:
  - azure-openai-ptu
status: published
pub_date: "2026-10-22"
last_verified: "2026-10-22"
sources:
  - url: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput-billing
    verified: "2026-10-22"
  - url: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput
    verified: "2026-10-22"
  - url: https://azure.microsoft.com/en-us/pricing/details/azure-openai/
    verified: "2026-10-22"
  - url: https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types
    verified: "2026-10-22"
---

**In short:** a PTU (provisioned throughput unit) is what Microsoft calls a
[generic unit of model processing capacity](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput-billing)
for Azure OpenAI. You choose how many PTUs a provisioned deployment gets,
Microsoft reserves that capacity, and you pay for it by the hour whether or not
it handles requests, or at a discount through a monthly or yearly Azure
Reservation.

Azure OpenAI offers two ways to pay for the same models: by the token on a
Standard deployment, or by reserved capacity on a provisioned deployment
measured in provisioned throughput units (PTUs). This guide explains the
difference using Microsoft's own documentation and price list, all checked on
22 October 2026. The vendor profile is at
[Azure OpenAI Provisioned Throughput](/vendors/azure-openai-ptu/).

## What a PTU is

Microsoft describes PTUs as
[generic units of model processing capacity](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput-billing). When you create a
provisioned deployment you choose how many PTUs to allocate; Microsoft reserves
that capacity and charges for it hourly whether or not the deployment is
handling requests. Each model has a
[minimum PTU count](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput) for a deployment.

## Provisioned throughput vs pay-as-you-go

Microsoft's [comparison table](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput) sets the two side by side:

| | Standard | Provisioned |
|---|---|---|
| Billing | Pay per token | Per PTU per hour, or Azure Reservations |
| Latency SLA | None | Defined latency target per model |
| Fit (Microsoft's wording) | Variable or unpredictable traffic | Guaranteed throughput and consistent latency |

Microsoft recommends provisioned throughput for predictable traffic,
latency-sensitive applications, production-scale volume where per-token billing
becomes expensive, and interactive scenarios such as chat and agents. Standard
remains the better fit for development, testing, low volume and highly variable
traffic.

## What it costs at published rates

Microsoft's [pricing page](https://azure.microsoft.com/en-us/pricing/details/azure-openai/) lists per-PTU rates by model and
deployment type. It labels them estimates in US dollars. For GPT-5.5 on
22 October 2026:

| GPT-5.5 deployment | Minimum PTUs | Per PTU per hour | Monthly reservation per PTU | Yearly reservation per PTU |
|---|---|---|---|---|
| Global | 15 | $1 | $260 | $2,652 |
| Data Zone | 15 | $1.10 | $286 | $2,916 |
| Regional | 50 | $2 | $286 | $2,916 |

On the same page, GPT-5.5 on a Standard Global deployment cost $5 per million
input tokens and $30 per million output tokens.

Worked from those figures: the smallest Global deployment (15 PTUs) costs $15
an hour on hourly billing, about $10,950 over a 730-hour month, or $3,900 a
month on a monthly reservation. At Standard rates, $15 buys 3 million input
tokens or 500,000 output tokens. Whether 15 PTUs serve more than that in an
hour depends on the model's throughput per PTU and your input-to-output mix,
which is not verified here; size it with your own traffic before committing.

## Hourly billing or a reservation

[Provisioned deployments](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput-billing) bill hourly, prorated (a deployment that
exists for 15 minutes is charged a quarter of the hourly rate). Azure
Reservations give a discounted effective rate in exchange for a 1-month or
1-year term. Two details matter in procurement. A reservation is a financial
discount applied to PTU billing meters, not a capacity guarantee, and deployed
PTUs beyond the reservation quantity are billed at the hourly rate. Microsoft
also warns that unused quota does not guarantee capacity will be available
when you scale back up.

## Global, Data Zone or Regional

The [deployment type](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types) decides where prompts are processed:

- **Global**: may be processed in any Azure region.
- **Data Zone**: processed only within a Microsoft-specified data zone: US, EU
  or Asia Pacific.
- **Regional**: processed within the Azure geography you specify, possibly
  across regions inside it.

The table above shows the trade: Regional processing carries a higher hourly
rate and a higher minimum than Global. Where data is processed is a residency
question; it does not change the jurisdiction of the parent company. See the
[methodology](/methodology/#jurisdiction).

## Spillover

Microsoft documents [spillover](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput), an optional setting that routes
overflow requests from a fully used provisioned deployment to a Standard
deployment in the same resource, so peaks are billed per token rather than
rejected. It is available for Azure OpenAI models that support provisioned
throughput, not for other providers' models in Foundry.

## How PTUs compare elsewhere

Other providers reserve capacity in different units and terms; see
[provisioned throughput vs pay-per-token](/guides/provisioned-throughput-vs-pay-per-token/).
Side by side:
[Bedrock vs Azure](/compare/aws-bedrock-provisioned-vs-azure-openai-ptu/),
[Azure vs Vertex AI](/compare/azure-openai-ptu-vs-vertex-ai-provisioned/),
[Azure vs Together AI](/compare/azure-openai-ptu-vs-together-ai/) (which also
sells a unit it calls a PTU) and
[Azure vs Modal](/compare/azure-openai-ptu-vs-modal/).
