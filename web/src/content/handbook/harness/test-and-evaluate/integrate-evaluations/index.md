---
title: Extend and integrate evaluations
description: Reuse generic observations and scorer adapters with application-owned storage, OpenTelemetry, and optional experiment platforms.
order: 880
---

The generic evaluation substrate stays provider-neutral. Use ordinary scorer
adapters for deterministic predicates, injected validators, calibrated model
rubrics, and authorized human labels. Applications own data retention, dataset
UIs, annotation, dashboards, external SDKs, and release approval.

The same scorer engine supports two operations:

- run a candidate and score the resulting observation; or
- score an existing successful application-owned observation again.

Re-scoring is useful when a rubric or judge changes. It does not rerun the
candidate task, fabricate its original latency or cost, or overwrite the first
verdict. Select and redact the observation before handing it to any remote
scorer or platform.

## Choose one scheduler

When connecting an experiment platform, choose one execution owner:

| Owner | Use when | Boundary |
| --- | --- | --- |
| Harness/application | You need Harness run controls, scorer adapters, and application-owned observations | Export selected result records, scores, and valid correlations after the run |
| Platform/application | The platform runs an experiment over its own dataset | Reuse task/scorer callbacks directly; do not nest a full Harness candidate matrix in every platform item |

Trace export and experiment/score submission are separate integrations. An
OpenTelemetry trace does not automatically create a versioned dataset,
experiment, or comparable score in another product.

The following guides are optional platform boundaries, not Harness packages:
[Langfuse](/handbook/harness/test-and-evaluate/integrate-evaluations/langfuse/),
[Phoenix](/handbook/harness/test-and-evaluate/integrate-evaluations/phoenix/),
and [Datadog](/handbook/harness/test-and-evaluate/integrate-evaluations/datadog/).
