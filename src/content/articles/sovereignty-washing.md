---
title: "Sovereignty washing: reading hyperscaler sovereign cloud claims against the EU framework"
description: "Sovereignty washing is sovereign cloud marketing that outruns the criteria. Here is how hyperscaler claims score against the EU Cloud Sovereignty Framework."
pub_date: 2026-07-18
updated: 2026-10-17
author: "Simon Newton"
category: "analysis"
target_keyword: "sovereignty washing"
keywords:
  - "sovereign cloud vs sovereignty washing"
  - "is hyperscaler sovereign cloud really sovereign"
  - "eu cloud sovereignty framework levels explained"
  - "cloud act sovereign cloud"
jurisdiction:
  - EU
tags:
  - sovereignty
  - compliance
  - jurisdiction
featured: false
draft: false
---

"Sovereign" has become a cloud marketing word. Every large US provider now
sells a sovereign cloud, a sovereign region, or a sovereign controls package
aimed at European buyers. The pitch is that data stays local, a local partner
or subsidiary operates the service, and European staff hold the keys. What the
pitch rarely does is measure itself against an external definition of
sovereignty. Until recently there was not one to measure against. Now there is.

## A measuring stick exists

In October 2025 the European Commission's Directorate-General for Digital
Services published the
[Cloud Sovereignty Framework](https://commission.europa.eu/document/download/09579818-64a6-4dd5-9577-446ab6219113_en)
(version 1.2.1). It is the reference the Commission uses to grade cloud services
in its own procurement, and it turns "sovereign" from a slogan into a graded
assessment.

The framework defines eight sovereignty objectives, SOV-1 to SOV-8: strategic,
legal and jurisdictional, data and AI, operational, supply chain, technology,
security and compliance, and environmental sustainability. Each is scored on a
Sovereignty Effectiveness Assurance Level, or SEAL, from 0 to 4. SEAL-0 is "no
sovereignty": the service is under the exclusive control of non-EU third
parties and governed in non-EU jurisdictions. SEAL-4 is "full digital
sovereignty": technology and operations under complete EU control, "subject
only to EU law, with no critical non-EU dependencies".

Two features of the scoring matter more than the labels. First, the SEAL level
is a minimum floor. A tender specifies "a minimum SEAL level that the cloud
service provider must reach for each Sovereignty Objective", and "tenders that
do not offer the required (minimum) levels of assurance consistently across all
objectives will be rejected". A provider that scores well on seven objectives
and falls below the floor on the eighth is out. The weakest objective decides.
Second, above the floor the framework computes a weighted Sovereignty Score
used as an award criterion, so sovereignty competes on quality rather than only
as a pass or fail.

## Where the top level is out of reach

The objective that matters for a US-parented provider is SOV-2, legal and
jurisdictional sovereignty. The framework's own contributing factors for SOV-2
include the "degree of exposure to non-EU laws with cross-border reach (e.g.,
US CLOUD Act, Chinese Cybersecurity Law)" and the "existence of legal,
contractual, or technical channels through which non-EU authorities could
compel access to data or systems".

That is a precise description of the
[CLOUD Act](https://www.law.cornell.edu/uscode/text/18/2713). Codified at
18 U.S.C. &sect; 2713, it requires a provider subject to US jurisdiction to
preserve and disclose data in its "possession, custody, or control" regardless
of where the data is stored. A US-parented company remains subject to that law
wherever its servers sit. SEAL-4 requires operations "subject only to EU law,
with no critical non-EU dependencies". A provider that also answers to US law
does not fit that description, so its ceiling on SOV-2 sits below the top of the
scale as a matter of structure, before any product feature is considered.

Local engineering, an EU subsidiary, or an independent trustee holding
encryption keys can raise the practical difficulty of compelled access. None of
them changes which law the controlling company answers to. That is the gap the
term "sovereignty washing" points at: sovereignty presented as a set of
governance-layer controls, measured against a framework that scores the
controlling jurisdiction directly.

## The evidence is on the record

This is not a hypothetical reading of the statute. In June 2025, asked under
oath by a French Senate committee whether he could guarantee that French
citizens' data would never be handed to US authorities, Microsoft France's
director of public and legal affairs, Anton Carniaux,
[answered](https://www.theregister.com/2025/07/25/microsoft_admits_it_cannot_guarantee/)
"No", adding "I cannot guarantee that", while noting that no such request had
been received. The admission was about the structure, not a specific incident:
a US-controlled provider cannot promise immunity from US legal process, whatever
the data's location.

The Commission has since put the framework to work. In April 2026 it
[awarded](https://commission.europa.eu/news-and-media/news/sovereign-cloud-framework-explained-2026-06-01_en)
a EUR 180 million cloud contract to four providers assessed against the
sovereignty objectives, its first procurement to score bids on sovereignty
criteria rather than treat "sovereign" as a self-declared label. Buyers who once
had only vendor marketing now have a public rubric and a worked example of it in
use.

## What this database records, and what it does not

The point of a framework is that it separates claims from criteria. This
database does the same at the level of a single fact. It keeps two columns apart
on purpose:

- **parent_jurisdiction** records the country whose law governs the parent or
  contracting company.
- **data_residency_guarantee** records whether the vendor contractually commits
  to keep data in a chosen region.

A vendor can score well on the second and still carry a foreign parent
jurisdiction on the first.
[AWS Bedrock Provisioned Throughput](/vendors/aws-bedrock-provisioned/),
[Azure OpenAI Provisioned Throughput](/vendors/azure-openai-ptu/) and
[Vertex AI Provisioned Throughput](/vendors/vertex-ai-provisioned/) each offer
European regions, and all three commit to data residency in their contract
terms, yet each has a
US parent jurisdiction in the [matrix](/vendors/). That is not a mark against the
products. It is the same distinction the EU framework draws with SOV-2:
residency answers where the bytes sit, jurisdiction answers whose court can
compel them. The
[jurisdiction analysis](/blog/jurisdiction-eu-region-not-sovereign/) works
through why an EU region does not settle the second question, and a companion
guide defines
[residency, sovereignty and operational sovereignty](/blog/residency-vs-sovereignty/)
term by term.

Read against the framework, a hyperscaler sovereign cloud is best understood as
a set of controls that improve some objectives, not as a claim to the top of the
scale on all of them. The framework makes that measurable. The matrix records
the one fact, parent jurisdiction, that no amount of local operation changes.

This piece is analysis, not legal advice. A specific procurement should be
checked against the framework and with counsel.
