---
title: "The UK buyer's position: adequacy, the CLOUD Act, and what UK-sovereign actually exists"
description: "EU-UK adequacy was renewed to 2031, but adequacy settles transfers, not sovereignty. What a UK regulated buyer should weigh, and the one UK-parented option in the matrix."
pub_date: 2026-07-19
updated: 2026-10-17
author: "Simon Newton"
category: "analysis"
target_keyword: "uk sovereign ai hosting"
keywords:
  - "uk sovereign ai hosting"
  - "uk sovereign llm inference"
  - "uk gdpr llm hosting"
  - "fca cloud outsourcing ai"
  - "does uk adequacy cover ai hosting"
tags:
  - sovereignty
  - compliance
  - jurisdiction
featured: false
draft: false
---

A UK firm choosing where to run its models sits under a different set of rules
from an EU one, and the differences are easy to misread. The most common
misreading is that the recent renewal of EU-UK data adequacy settles the
sovereignty question. It does not. It settles a different question, and the gap
between the two is exactly where UK procurement goes wrong.

## What adequacy renewal settles, and what it does not

On 19 December 2025 the European Commission
[renewed](https://ec.europa.eu/commission/presscorner/detail/en/ip_25_3059) its
two adequacy decisions for the United Kingdom, covering the GDPR and the Law
Enforcement Directive, valid until 27 December 2031. The renewal rests on the
UK's
[Data (Use and Access) Act](https://www.gov.uk/guidance/data-use-and-access-act-2025-plans-for-commencement),
whose first main provisions came into force on 20 August 2025 following Royal
Assent on 19 June. For a UK business the practical effect is continuity:
personal data keeps flowing from the EEA to the UK without additional
safeguards.

That is worth having, and it is narrower than it is usually read to be.
Adequacy is a finding about transfers. It says the UK's data protection regime
offers protection essentially equivalent to the EU's, so data may move to the
UK freely. It says nothing about whether data held by a UK firm is reachable by
a foreign government, and nothing about who controls the company processing it.
Adequacy answers where data may go. Sovereignty answers whose law governs the
holder once it arrives. Those are different questions, the same split the
[jurisdiction analysis](/blog/jurisdiction-eu-region-not-sovereign/) draws for
EU regions.

## The UK buyer's actual concerns

For a regulated UK firm, the binding constraints are supervisory, not only data
protection. The FCA, Bank of England and PRA run a joint
[oversight regime for critical third parties](https://www.fca.org.uk/firms/operational-resilience).
That regime, in the FCA's words, "does not change the accountability of firms,
their boards and senior management" for complying with "existing outsourcing and
operational resilience rules, including when they rely on services provided by
third parties". Outsourcing an AI workload does not outsource the obligation.
Concentration is the sharper worry: when much of a sector depends on a handful
of providers, disruption in one part of the sector "can spread to another, and
to the wider economic system".

Frontier AI has now been folded into that frame. On 15 May 2026 the FCA, Bank
of England and HM Treasury issued a
[joint statement](https://www.fca.org.uk/news/statements/fca-boe-treasury-joint-statement-frontier-ai-models-cyber-resilience)
on frontier AI models and cyber resilience, telling firms to manage frontier AI
cyber risks "from third parties and supply chains" and to keep boards able to
oversee them. For a buyer choosing an AI host, the third-party and concentration
lens is now explicit supervisory expectation, not background noise.

## The jurisdiction lens, UK-side

None of that decides jurisdiction, and this is where a UK buyer's map differs
from an EU buyer's. Since Brexit the EU is a foreign jurisdiction to a UK firm.
An EU-parented vendor, [Nebius](/vendors/nebius/), [OVHcloud](/vendors/ovhcloud/)
or [Scaleway](/vendors/scaleway/) in this database, answers to EU law and EU
courts. That is a different jurisdiction from the UK's, not the same one. It can
be a good answer to a residency question and still be foreign for sovereignty.

A US-parented vendor is foreign in the way the
[sovereignty washing analysis](/blog/sovereignty-washing/) and the jurisdiction
piece describe. [18 U.S.C. &sect; 2713](https://www.law.cornell.edu/uscode/text/18/2713)
reaches a US-controlled company's data regardless of where it sits, so a UK
region from [AWS Bedrock Provisioned Throughput](/vendors/aws-bedrock-provisioned/),
[Azure OpenAI Provisioned Throughput](/vendors/azure-openai-ptu/) or
[Vertex AI Provisioned Throughput](/vendors/vertex-ai-provisioned/) places the
bytes in Britain while the controlling law stays American. A UK region is a
residency fact. It is not a UK-jurisdiction fact.

## The honest inventory: what exists at UK-parented level

So what exists at UK-parented level? On our inclusion bar, one vendor.
[Civo](/vendors/civo/) is UK-registered (Companies House 09568551); its sole
person with significant control is a UK-resident individual, with no foreign
parent, so no foreign entity controls the data. It offers dedicated
single-tenant GPU inference, and its UK Sovereign Cloud page states that data
stays in the UK under UK law (a Stated commitment in our
[evidence levels](/methodology/#evidence-levels): it is on Civo's own pages,
not in its service terms). That makes it the only vendor in the matrix whose
parent jurisdiction and stated residency point at the same place, and the only one
where the CLOUD Act question does not arise as a matter of structure.

That is a narrow finding, and stated narrowly on purpose. One qualifying vendor
is not a market. The bar was the existing [methodology](/methodology/) inclusion
criteria, applied without loosening to fill the category: UK-parented ownership
verified on the register, a single-tenant GPU product, and primary-sourced
compliance and residency claims. Civo cleared it. The marketing listicles that
prompted the search did not count as evidence and were not cited. A UK buyer who
needs a UK-jurisdiction host has one verified option here, not a shortlist, and
should read that as the current state of a thin market rather than a
recommendation.

## Buyer questions, UK edition

The questions that turn the matrix into a procurement decision, UK-side:

1. Is the contracting entity UK-registered, and does any foreign parent or
   person with significant control sit above it? Check the register, not the
   brochure.
2. Does adequacy cover what you think it covers? It keeps EEA data flowing to
   you; it does not shield your data from a foreign production order served on
   your provider.
3. If the provider is US-parented, does the CLOUD Act reach your data through
   it, whatever region you pick?
4. Can you meet FCA outsourcing and operational-resilience expectations for this
   provider, including exit and substitutability where it is a concentrated
   dependency?
5. For genuine UK sovereignty, are the operating entity, its people and the
   control plane all under UK law, not only the storage region?

Adequacy renewal is good news for data flows and no news at all for
sovereignty. Read the [matrix](/vendors/) with the two kept apart: filter to UK
sovereign for the one UK-parented option, and read the parent jurisdiction
against the region for everyone else.

This piece is analysis, not legal advice. A specific procurement should be
checked against the current rules and with counsel.
