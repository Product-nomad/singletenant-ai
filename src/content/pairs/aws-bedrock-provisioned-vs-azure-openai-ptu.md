---
pair: aws-bedrock-provisioned-vs-azure-openai-ptu
last_verified: "2026-10-22"
sources:
  - url: https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html
    verified: "2026-10-22"
  - url: https://aws.amazon.com/bedrock/pricing/
    verified: "2026-10-22"
  - url: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput-billing
    verified: "2026-10-22"
  - url: https://azure.microsoft.com/en-us/pricing/details/azure-openai/
    verified: "2026-10-22"
  - url: https://aws.amazon.com/agreement/
    verified: "2026-10-22"
  - url: https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types
    verified: "2026-10-22"
---

Both are US hyperscalers selling reserved model capacity, so the difference is
in the unit, the term and the price you can see before talking to sales.

[Amazon Bedrock Provisioned Throughput](/vendors/aws-bedrock-provisioned/) is
sold in model units (MUs), [billed hourly](https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html) with no commitment, a
1-month or a 6-month term; longer terms lower the hourly rate. If you customise
a model on Bedrock, provisioned throughput is the only way to serve it. AWS
[pricing](https://aws.amazon.com/bedrock/pricing/) shows worked examples, such as two Titan Text Express
model units on a 1-month commitment at $18.40 per hour each.

[Azure OpenAI Provisioned Throughput](/vendors/azure-openai-ptu/) is sold in
PTUs, [billed hourly or through Azure Reservations](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput-billing) on 1-month or
1-year terms. Microsoft [publishes a per-PTU table](https://azure.microsoft.com/en-us/pricing/details/azure-openai/) by model and
deployment type; on 22 October 2026 GPT-5.5 listed at $1 per PTU per hour on
Global, $1.10 on Data Zone and $2 on Regional deployments, labelled as
estimates.

On location, the [AWS Customer Agreement](https://aws.amazon.com/agreement/) (section 1.4) lets you
specify the AWS regions where your content is stored. Azure's
[deployment types](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types) set where prompts are processed: globally,
within a US, EU or Asia Pacific data zone, or within one Azure geography.
