---
title: "The jurisdiction problem: why an EU region is not EU sovereign"
description: "Data residency and data sovereignty are different claims. A US-parented vendor with an EU region is still reachable under US law, and the matrix keeps the two apart."
pub_date: 2026-07-12
author: "Simon Newton"
category: "analysis"
target_keyword: "eu data sovereignty"
tags:
  - sovereignty
  - compliance
  - jurisdiction
featured: false
draft: false
---

"Data residency" and "data sovereignty" get used as if they mean the same
thing. They do not, and the gap between them is where a lot of regulated AI
procurement goes wrong.

Residency is a question about place: where does the data physically sit and
get processed. Sovereignty is a question about power: whose law governs the
company that holds the data, and which courts and agencies can compel it. A
vendor can give you a firm answer on the first and still leave you exposed on
the second.

## The reach of the controlling law

The clearest example is United States law. The CLOUD Act, the Clarifying
Lawful Overseas Use of Data Act of 2018, added
[18 U.S.C. &sect; 2713](https://www.law.cornell.edu/uscode/text/18/2713). It
requires a provider subject to US jurisdiction to preserve and disclose data
"within such provider's possession, custody, or control, regardless of whether
such communication, record, or other information is located within or outside
of the United States." In plain terms, US legal process can reach a
US-controlled company's
data even when that data lives in a Frankfurt or Paris data centre. Choosing an
EU region does not move the company out of reach. It only moves the bytes.

This is not a US-specific complaint. Any vendor whose controlling entity sits
under a government with extraterritorial disclosure powers carries the same
structure. US law is simply the best documented case, and most of the vendors
in this database are US-parented. (This piece is analysis, not legal advice. A
specific procurement should be checked with counsel.)

## How the matrix encodes it

The vendor database keeps three fields apart on purpose, because collapsing
them is the error:

- **parent_jurisdiction** records the country whose law governs the
  contracting or parent company.
- **regions** records where compute and data can be placed.
- **data_residency_guarantee** records whether the vendor makes a contractual
  commitment to keep data in a chosen region, as opposed to merely offering a
  region selector.

A European entry in the regions field tells you nothing about the parent
jurisdiction. The matrix on the vendors page prints the parent country next to
the data residency column for exactly this reason, so a US parent with an EU
region reads as what it is.

## Walking the sixteen

Three vendors in the database are EU-parented, and they make up the EU
sovereign category. [Nebius](/vendors/nebius/) contracts through a Dutch entity
(parent jurisdiction NL). [OVHcloud](/vendors/ovhcloud/) is French.
[Scaleway](/vendors/scaleway/) is also French, and is the only one of the three
that additionally carries a verified data residency guarantee in our data.
Jurisdiction and residency stay separate even here: two of the three record
their residency guarantee as not verified. EU parentage is a necessary
condition for EU sovereignty, not a sufficient one.

One vendor stands apart from all of these. [Civo](/vendors/civo/) is
UK-parented: on the Companies House register its sole person with significant
control is a UK-resident individual, with no foreign parent. That places it in
its own category, UK sovereign, and makes it the only vendor here whose parent
jurisdiction and residency guarantee point at the same place. Civo commits to
keeping data in the UK under UK law, and there is no foreign parent to pull it
into another jurisdiction. For a UK buyer that is a genuinely different position
from an EU-parented vendor, which is still foreign jurisdiction to a UK firm,
and different again from a US-parented vendor offering a UK region, where the
region is UK but the controlling law is not.

The larger group is US-parented vendors that can place data in a European or UK
region. On our current data that is
[AWS Bedrock Provisioned Throughput](/vendors/aws-bedrock-provisioned/),
[Azure OpenAI Provisioned Throughput](/vendors/azure-openai-ptu/),
[Baseten](/vendors/baseten/),
[CoreWeave](/vendors/coreweave/),
[Databricks Model Serving](/vendors/databricks-model-serving/),
[Fireworks AI](/vendors/fireworks-ai/),
[Hugging Face Inference Endpoints](/vendors/huggingface-inference-endpoints/),
[Modal](/vendors/modal/), [RunPod](/vendors/runpod/) and
[Vertex AI Provisioned Throughput](/vendors/vertex-ai-provisioned/). Every one
has a US parent jurisdiction. Some go further and record a verified residency
guarantee: AWS, Azure and Modal each commit to keeping data in a
customer-chosen region. That is a real and useful commitment, but it is a
residency commitment. It constrains where the data sits. It does not change the
fact that the company holding it answers to US law.

That distinction is the whole point. A US-parented vendor with an EU region and
a residency guarantee has answered the residency question well and the
sovereignty question not at all.

A final pair is US-parented and offers no region a buyer can pin from a primary
source, for different reasons. [NVIDIA NIM](/vendors/nvidia-nim/) is
run-anywhere software: you deploy the containers on infrastructure you choose,
so there is no vendor-published region at all, and residency is whatever your
own hosting is. [Together AI](/vendors/together-ai/) documents no deployment
region for its serverless or dedicated-endpoint inference, and its terms make no
residency guarantee, which our data records as such. For both, the database
records regions as not verified rather than guessing, so a buyer cannot lean on
an EU-region claim.

## What a regulated buyer should ask

The matrix gives you the starting facts. The questions that turn them into a
decision are:

1. Who is the contracting entity, and under which country's law does it
   operate? A reseller in your own jurisdiction does not help if a foreign
   parent controls the data.
2. Is the residency commitment contractual and in writing, or is it a region
   drop-down that can change without notice?
3. Does the provider, its parent, or its affiliates fall under a foreign
   disclosure regime such as the US CLOUD Act?
4. If served with a foreign production order for your data, what is the
   provider's documented response?
5. For genuine sovereignty, are the operating entity, its personnel, and the
   service's control plane all inside the target jurisdiction, not just the
   storage?

None of these is answered by a region selector.

## Read the two columns separately

You can see the shape of this across the market on the
[vendor matrix](/vendors/): set the Category filter to EU sovereign for the
three EU-parented options or UK sovereign for the UK-parented one, and read the
parent jurisdiction shown against each vendor's residency column for everyone
else. Residency and sovereignty are
different columns because they are different questions. Treating an EU region as
EU sovereignty is the most common way to get this wrong.
