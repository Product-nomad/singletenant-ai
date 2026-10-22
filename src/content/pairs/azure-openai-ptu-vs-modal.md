---
pair: azure-openai-ptu-vs-modal
last_verified: "2026-10-22"
sources:
  - url: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput-billing
    verified: "2026-10-22"
  - url: https://azure.microsoft.com/en-us/pricing/details/azure-openai/
    verified: "2026-10-22"
  - url: https://modal.com/pricing
    verified: "2026-10-22"
  - url: https://modal.com/legal/terms
    verified: "2026-10-22"
  - url: https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types
    verified: "2026-10-22"
---

These answer different questions. [Azure OpenAI Provisioned Throughput](/vendors/azure-openai-ptu/)
reserves capacity for Microsoft-hosted OpenAI models. [Modal](/vendors/modal/)
runs your own models and code on GPUs it manages.

That shows up in billing. Azure sells provisioned throughput units,
[billed hourly or through 1-month or 1-year Azure Reservations](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput-billing),
with [per-PTU minimums](https://azure.microsoft.com/en-us/pricing/details/azure-openai/): on 22 October 2026, GPT-5.5 needed at
least 15 PTUs on a Global deployment at $1 per PTU per hour (Microsoft labels
these estimates). Modal [bills per second](https://modal.com/pricing) for GPU, CPU and
memory.

Both make contractual location commitments. Modal's [terms](https://modal.com/legal/terms) let
the customer restrict processing of customer data to the regions it specifies,
and Modal will not process it elsewhere without consent. Azure's
[deployment types](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types) keep processing within a US, EU or Asia Pacific
data zone, or within one Azure geography for Regional deployments.

Both parents are US companies (Modal Labs, Inc. is a Delaware corporation per
its terms), so jurisdiction is not the deciding factor here; the choice is
between reserved access to one model family and per-second compute for any
model.
