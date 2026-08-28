---
title: Use Langfuse with evaluations
description: Optionally submit application-selected traces and scores to Langfuse without making it a Harness dependency or second scheduler.
order: 881
---

Use Langfuse when its hosted or self-hosted dataset, experiment, trace, and
score workflows fit your team's operating model. It is optional: install and
configure its SDK only in the application that owns the integration. Harness
core neither creates a Langfuse client nor requires a Langfuse account.

Choose whether the application runs the Harness evaluation and submits selected
results afterwards, or Langfuse runs the experiment while reusing application
task and scorer callbacks. Do not schedule the complete evaluation matrix in
both places. Preserve scorer ID/version, dataset snapshot identity, candidate
identity, outcome/coverage, and only valid trace correlation.

Decide separately whether traces, scores, evidence references, and annotations
may be submitted. A local application dataset does not automatically become a
hosted dataset version or a comparable platform experiment. Pin the platform
SDK and verify its current dataset-version, retention, authentication, and
regional deployment behavior before enabling the integration.

If export fails, preserve the Harness result and report the export failure as an
integration concern; it must not change the quality verdict. Return to
[integration choices](/handbook/harness/test-and-evaluate/integrate-evaluations/).
