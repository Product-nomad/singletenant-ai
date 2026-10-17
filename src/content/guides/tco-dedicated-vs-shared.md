---
title: "Total cost of ownership: dedicated vs shared inference"
description: "How to compare the cost of dedicated LLM capacity with shared per-token endpoints: normalising pricing units, utilisation break-even, commitments and hidden costs."
audience: "Engineering leads and finance or procurement partners sizing an LLM workload"
status: stub
order: 4
---

<!-- Outline only. Every price or unit definition must link to the vendor's
pricing page (the vendor profiles already carry them) with the date checked;
worked examples use clearly labelled hypothetical inputs, never quoted prices
from memory. Set status: published, pub_date and last_verified when done. -->

## The question this guide answers

- When does reserving dedicated capacity cost less than paying per token on a shared endpoint, and what else should go into the comparison?

## Pricing units across the matrix

- Per million tokens, per GPU-hour or GPU-second, and provisioned units (Azure PTU, Bedrock Model Units, Vertex GSUs).
- Why these units cannot be compared directly, and how to normalise them to cost per million tokens at a given throughput.

## Utilisation and break-even

- How to estimate break-even utilisation for a dedicated deployment.
- Peak versus steady load: why bursty workloads favour shared endpoints.
- Inputs table: tokens per day, input to output ratio, latency target, peak factor.

## Commitments and terms

- Reservations, minimum terms and commitment discounts, and the risk of over-committing.
- Exit and portability costs.

## Costs outside the price list

- Idle capacity, engineering and operations time, egress and networking, observability, compliance and assurance work.
- What single tenancy can remove (shared-tenancy risk reviews) and what it adds.

## Worked example (hypothetical inputs)

- One workload costed three ways: shared per-token, dedicated endpoint, provisioned throughput. Clearly labelled assumptions, with pricing links to the vendor profiles.

## Sources to cite

- The vendor pricing pages linked from each profile, with the date checked.
