---
title: "Why this site says Not verified so often"
description: "Not verified is the most common label in our vendor database. Why an evidence-first comparison site advertises the gaps in its own data, and the bug our own audit caught."
pub_date: 2026-07-12
author: "Simon Newton"
category: "analysis"
target_keyword: "not verified"
tags:
  - methodology
  - compliance
featured: false
draft: false
---

If you read this site for long you will notice a phrase repeated more often
than any vendor name: Not verified. It appears wherever a fact could not be
tied to a primary source. That is deliberate, and it is worth explaining why a
comparison site would advertise the gaps in its own data.

## The usual failure mode

Most vendor comparison content fails the same way. It states a capability, a
certification, a price, and gives you no way to check it. The claim might be
lifted from a vendor's marketing, a year-old blog post, or another comparison
site that did the same thing. By the time it reaches you it has no source and
no date, and you cannot tell whether it was ever true or has simply gone stale.
For a casual reader that is a minor annoyance. For someone making a procurement
decision in a regulated setting it is worse than useless, because it looks like
diligence without being it.

## One rule, enforced

The database runs on a single rule, described in full on the
[methodology page](/methodology/): a populated fact carries two things, the URL
of the primary source it was checked against and the date of that check. If a
fact cannot carry both, it is not populated. It shows as Not verified. The
schema enforces this rather than trusting anyone to remember, so a fact with a
value but no evidence link fails validation and the build fails with it.

"Verified" here is a narrow, honest claim. It means the linked page supported
the fact on the date shown, not that the fact is true for all time. Dates are
printed per section so staleness is visible instead of hidden.

## Where the gaps actually are

Doing this vendor by vendor teaches you where the gaps sit. Compliance is the
most common. A vendor's trust centre will display badges for a dozen standards,
but a badge often means "aligned with" rather than a current audited
certification, and the specific report is behind a sales contact. Where a
certification is claimed without a way to confirm it, we record the absence
rather than the badge. [CoreWeave](/vendors/coreweave/) is held to that line:
its trust material references ISO 27001 with "aligned with" wording, so ISO
27001 is not listed on its profile. Data residency is another common gap. A
region selector is not a residency guarantee, and most terms of service make no
geographic commitment at all, so most residency guarantees in the database read
as not verified.

## The bug our own audit caught

The rule has to apply to our own mistakes, and it caught one. After the launch
data set was complete, a post-ship integrity audit re-fetched every evidence
link across all fifteen vendors. Every link returned a healthy response, so a
naive check would have passed. One did not survive a closer look. The
[Databricks Model Serving](/vendors/databricks-model-serving/) profile cited a
live, working page as evidence for its SOC 2 Type II certification, but the page
it pointed to was Databricks' HIPAA compliance page, not its SOC 2 page. The
link was not broken. It was the wrong source for the claim.

That is the harder failure to catch, because link checkers only test whether a
page loads, not whether it says what you cited it for. The fix is recorded,
with its date, in the public [changelog](/changelog/): the evidence now points
to the Databricks SOC compliance page, which names the SOC 2 Type II report.
The episode is the argument for the whole approach in miniature. A fact can have
a source, a date, and a green light from an automated check, and still be wrong.
The only defence is that the source is visible, so anyone, including us, can
click it and see whether it holds.

## What Not verified means for you

So when the site says Not verified, it is not saying the vendor lacks the
certification, the region, or the guarantee. It is saying we could not tie that
specific claim to a primary source we are willing to show you. Sometimes the
fact is real and simply undocumented in public. Sometimes it is available only
under a sales contact. Either way, the honest label is more useful for a
decision than a confident guess, because it tells you exactly where you need to
ask the vendor directly.

None of this is free. It is slower than aggregating marketing copy, and it
produces a database with visible holes. The holes are the point. Every
commercial relationship on the site is disclosed on the
[disclosure page](/disclosure/), and no commercial relationship changes how a
fact is verified. A comparison you cannot check is not a comparison. It is a
rumour with a table around it.
