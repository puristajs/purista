---
title: Use Datadog with evaluations
description: Optionally submit external evaluation results to Datadog with explicit correlation, privacy, and delivery policy.
order: 883
---

Use Datadog when the organization already operates its AI observability and
external evaluation workflow there. This is an application integration, not a
Harness adapter: install the supported Datadog SDK, provision the service and
credentials, and configure export in the application that owns its data policy.

Submit only a deliberately mapped result. Preserve stable scorer and candidate
versions, declared dimensions and outcomes, coverage, and valid correlation to
the observed trace/span. Do not derive a trace identifier from an evaluation
run ID, and do not place case IDs, prompts, outputs, references, evidence, or
secret-bearing tool values in generic telemetry attributes.

Use one scheduler. Either run the Harness evaluation and submit external
results, or let a Datadog experiment invoke the application task/scorer path;
never nest both matrix runners. Treat platform submission errors, unavailable
entitlement, and site-specific configuration as operational integration errors,
not candidate failures.

Confirm current Datadog product availability, site, payload limits, retention,
and SDK API before enabling this optional path. Return to [integration choices](/handbook/harness/test-and-evaluate/integrate-evaluations/).
