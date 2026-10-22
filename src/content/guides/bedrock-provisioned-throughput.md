---
title: "Amazon Bedrock provisioned throughput: model units, commitment terms, pricing"
description: "How Amazon Bedrock Provisioned Throughput works: what a model unit buys, the three commitment terms, how it is billed and what AWS publishes about price."
audience: "Teams sizing or procuring reserved Bedrock capacity, including for customised models"
order: 11
jurisdiction: []
vendors:
  - aws-bedrock-provisioned
status: published
pub_date: "2026-10-22"
last_verified: "2026-10-22"
sources:
  - url: https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html
    verified: "2026-10-22"
  - url: https://aws.amazon.com/bedrock/pricing/
    verified: "2026-10-22"
  - url: https://docs.aws.amazon.com/bedrock/latest/userguide/prov-thru-supported.html
    verified: "2026-10-22"
  - url: https://aws.amazon.com/agreement/
    verified: "2026-10-22"
---

Amazon Bedrock serves most models on demand, priced per token. Provisioned
Throughput reserves capacity for a specific model instead, sold in model units
(MUs) and billed by the hour. This guide sets out the mechanics from AWS's own
documentation and pricing page, checked on 22 October 2026. The vendor profile
is at [Amazon Bedrock Provisioned Throughput](/vendors/aws-bedrock-provisioned/).

## What a model unit buys

AWS [defines an MU](https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html) by throughput for one specified model: the number
of input tokens it can process, and the number of output tokens it can
generate, across all requests in one minute. What one MU delivers differs by
model, and AWS directs buyers to their account manager for what an MU
specifies, per-MU pricing and limit increases.

## Commitment terms

You [choose a term](https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html) when you buy:

| Term | What it means |
|---|---|
| No commitment | Delete the Provisioned Throughput at any time |
| 1 month | Cannot be deleted until the month is over |
| 6 months | Cannot be deleted until the six months are over |

The longer the commitment, the lower the hourly price. Billing continues until
you delete the Provisioned Throughput, so a no-commitment purchase still costs
money for every hour it exists.

## Customised models need it

If you customise a model on Bedrock, AWS says you
[must purchase Provisioned Throughput](https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html) to use it. A custom model is
priced the same as the base model it was customised from. That makes
Provisioned Throughput a requirement, not an option, for fine-tuned models on
Bedrock.

## What AWS publishes about price

The Bedrock [pricing page](https://aws.amazon.com/bedrock/pricing/) publishes on-demand per-token prices
and worked Provisioned Throughput examples rather than a full per-MU price
list. One example on 22 October 2026: two Amazon Titan Text Express model units
on a 1-month commitment at $18.40 per hour each, totalling $27,379.20 for a
31-day month. For other models, budget from a quote: the
[documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html) points to the account manager for per-MU pricing.

## Where you can buy it

AWS lists Provisioned Throughput availability
[by model and region](https://docs.aws.amazon.com/bedrock/latest/userguide/prov-thru-supported.html). On 22 October 2026 the table named the
regions us-east-1, us-west-2, ca-central-1, sa-east-1, eu-central-1,
eu-west-1, eu-west-2, eu-west-3, ap-south-1 and ap-southeast-2, with
availability varying by model. Under section 1.4 of the
[AWS Customer Agreement](https://aws.amazon.com/agreement/) you may specify the regions where your
content is stored. That is a residency commitment; the parent company remains
US-based, which is a separate
[jurisdiction](/methodology/#jurisdiction) question.

## Provisioned or on-demand?

The trade is the same as on other platforms: reserved, hourly-billed capacity
against per-token prices on shared serving. See
[provisioned throughput vs pay-per-token](/guides/provisioned-throughput-vs-pay-per-token/)
for how to work out which is cheaper for your traffic, and the comparisons with
[Azure OpenAI PTU](/compare/aws-bedrock-provisioned-vs-azure-openai-ptu/),
[Vertex AI Provisioned Throughput](/compare/aws-bedrock-provisioned-vs-vertex-ai-provisioned/)
and [Fireworks AI](/compare/aws-bedrock-provisioned-vs-fireworks-ai/).
