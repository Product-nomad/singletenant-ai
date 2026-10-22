---
pair: aws-bedrock-provisioned-vs-vertex-ai-provisioned
last_verified: "2026-10-22"
sources:
  - url: https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html
    verified: "2026-10-22"
  - url: https://cloud.google.com/blog/products/ai-machine-learning/provisioned-throughput-on-vertex-ai
    verified: "2026-10-22"
  - url: https://aws.amazon.com/bedrock/pricing/
    verified: "2026-10-22"
  - url: https://aws.amazon.com/agreement/
    verified: "2026-10-22"
  - url: https://cloud.google.com/terms/service-terms
    verified: "2026-10-22"
  - url: https://policies.google.com/terms
    verified: "2026-10-22"
---

Two US hyperscalers, two different capacity units.
[Amazon Bedrock Provisioned Throughput](/vendors/aws-bedrock-provisioned/)
reserves model units (MUs), [billed hourly](https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html) with no commitment, a
1-month or a 6-month term, and is required to serve a model you have
customised on Bedrock.
[Vertex AI Provisioned Throughput](/vendors/vertex-ai-provisioned/) reserves
generative AI scale units (GSUs) on fixed-cost terms, including
[1-week terms](https://cloud.google.com/blog/products/ai-machine-learning/provisioned-throughput-on-vertex-ai) for select models, which suits a short spike such as
a launch.

Price visibility differs. AWS [pricing](https://aws.amazon.com/bedrock/pricing/) includes worked examples
with per-model-unit hourly rates, for instance $18.40 per hour per Titan Text
Express unit on a 1-month commitment. A public GSU price list is not verified
here.

Both make contractual location commitments. Section 1.4 of the
[AWS Customer Agreement](https://aws.amazon.com/agreement/) lets you specify the regions where your
content is stored. Google's [Service Specific Terms](https://cloud.google.com/terms/service-terms) commit to
storing data and running machine learning processing in a customer-chosen
multi-region. Google LLC is organised under Delaware law per its
[terms](https://policies.google.com/terms); both parents are US companies, so neither answers the
jurisdiction question differently from the other.
