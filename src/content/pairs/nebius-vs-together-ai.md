---
pair: nebius-vs-together-ai
last_verified: "2026-10-22"
sources:
  - url: https://docs.nebius.com/legal/agreement
    verified: "2026-10-22"
  - url: https://www.together.ai/terms-of-service
    verified: "2026-10-22"
  - url: https://nebius.com/services/token-factory/enterprise-grade-inference
    verified: "2026-10-22"
  - url: https://www.together.ai/dedicated-endpoints
    verified: "2026-10-22"
  - url: https://docs.nebius.com/legal/dpa
    verified: "2026-10-22"
  - url: https://www.together.ai/pricing
    verified: "2026-10-22"
  - url: https://docs.tokenfactory.nebius.com/ai-models-inference/dedicated-endpoints/billing-policy
    verified: "2026-10-22"
---

Both sell single-tenant inference, but they sit under different law.
[Nebius](/vendors/nebius/) is EU-parented: its
[services agreement](https://docs.nebius.com/legal/agreement) contracts non-US, non-Israeli customers through
Nebius B.V. under Dutch law. [Together AI](/vendors/together-ai/) is operated by
Together Computer, Inc., a Delaware corporation, and its
[terms](https://www.together.ai/terms-of-service) are governed by California law.

That Dutch contract does not make Nebius EU sovereign. US customers who
registered for Token Factory on or after 15 September 2026 contract with Nebius
Inc. under the same agreement, and Nebius makes no sovereignty claim on its
[enterprise inference page](https://nebius.com/services/token-factory/enterprise-grade-inference). This site records Nebius as EU-parented,
not as sovereign for the EU.

The isolation story is similar. Nebius offers
[shared or single-tenant endpoints](https://nebius.com/services/token-factory/enterprise-grade-inference); Together says
[every dedicated deployment runs on single-tenant, isolated GPUs](https://www.together.ai/dedicated-endpoints).

Residency is where they part. Section 6.1 of the Nebius
[Data Processing Agreement](https://docs.nebius.com/legal/dpa) commits dedicated endpoints to the
customer-selected region, which is Contractual on our
[evidence levels](/methodology/#evidence-levels). Together's dedicated page says
customers choose the deployment region for data residency, but its terms make
no geographic commitment and no regions are named, so it is Stated.

Pricing differs in shape too. Together [publishes](https://www.together.ai/pricing) per-GPU-hour
rates and sells reserved capacity in throughput units. Nebius bills dedicated
endpoints [while a replica runs](https://docs.tokenfactory.nebius.com/ai-models-inference/dedicated-endpoints/billing-policy); its rates are not verified here.
