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
  model: 'primary',
  guardrails: rails,
  instructions: 'Answer the support request while protecting sensitive data.',
})
const definition = defineHarness({ name: 'support' }).addAgent(guardedAgent)
const harness = await definition.getInstance({ model: primaryModel })
```
Use native, Presidio, or local NER adapters only after verifying their package,
model assets, sidecar, credentials, and data residency. Test true positives,
false positives, malformed detector results, timeouts, and fail-closed behavior
without logging the protected value.
