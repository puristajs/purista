---
title: Use Phoenix with evaluations
description: Optionally map application-owned experiments and trace correlation to Phoenix while retaining Harness as a provider-neutral runtime.
order: 882
---

Use Phoenix when its experiment and observability workflow suits your team,
including a deployment that meets your data and operational requirements. Add
Phoenix packages and runtime configuration at the application composition root;
do not add them to Harness core or assume a global telemetry provider.

Map a selected evaluation record deliberately: dataset snapshot and case
identity, candidate and scorer versions, dimensions/outcomes, coverage, and a
valid trace correlation when one exists. Keep raw observations, references, and
verdict explanations out unless the application policy explicitly authorizes
their export. Trace availability alone does not prove that every evaluation row
or model call was ingested.

Run either the Harness/application matrix and export its result, or a
Phoenix-owned experiment that calls application callbacks. Preserve the result
when platform submission fails and make re-submission idempotent in the
application. Verify the current Phoenix TypeScript API and deployment behavior
before writing SDK-specific code; those details are external to Harness.

Return to [integration choices](/handbook/harness/test-and-evaluate/integrate-evaluations/).
