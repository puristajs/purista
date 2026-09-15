---
title: Add privacy detectors
description: Inspect exact model and tool boundaries with optional Guardrails detector packages and fail closed on policy errors.
order: 760
---

Install `@purista/harness-guardrails` and the detector package required by the
deployment. A detector transforms or rejects content at an explicit phase; it
does not authenticate users or authorize business actions.

```ts title="Privacy Detectors example 1"
import { defineAgent, defineHarness } from '@purista/harness'
import { defineGuardrails } from '@purista/harness-guardrails'

const rails = defineGuardrails({
  actions: { privacyInput: privacyInputAction, privacyOutput: privacyOutputAction },
  config: {
    rails: {
      input: { flows: ['privacyInput'] },
      output: { flows: ['privacyOutput'] },
    },
  },
})

const guardedAgent = defineAgent('support', {
  model: 'answering',
  guardrails: rails,
  instructions: 'Answer the support request while protecting sensitive data.',
})
const definition = defineHarness({ name: 'support' }).addAgent(guardedAgent)
const harness = await definition.getInstance({ models: { answering: answeringModel } })
```

## Native privacy

Use `@purista/harness-guardrails-native-privacy` for local detection of common
identifiers such as email addresses, phone numbers, payment cards, IP
addresses, IBANs, US Social Security numbers, and URLs. It runs in process and
does not need a detector service. Verify that the target platform has a
supported native prebuild.

## Presidio

Use `@purista/harness-guardrails-presidio` when the organization already runs
a governed Microsoft Presidio Analyzer service or needs its recognizers and
language support. The application owns the authenticated sidecar connection,
timeouts, health checks, and data-residency decision. Masking remains a
Guardrails action after detection.

## Local NER

Use `@purista/harness-guardrails-local-ner` for locally provisioned labels such
as person, organization, or location. Pin and provision the model assets before
startup, supply the label map, and warm the detector. Do not download an
unreviewed model during a request.

For every detector, test true positives, false positives, malformed results,
timeouts, and fail-closed behavior without logging the protected value.
