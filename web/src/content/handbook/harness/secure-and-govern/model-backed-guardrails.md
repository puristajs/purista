---
title: Use model-backed Guardrails
description: Add a model-backed content rail only after deterministic checks and an approved model alias are configured.
order: 762
---

Model-backed Guardrails are nondeterministic quality controls. Register their
model alias before the guarded agent, keep deterministic detectors first, and
measure false accepts and false rejects in evaluations.

```ts title="Model Backed Guardrails example 1"
import { defineAgent, defineHarness } from '@purista/harness'
import { defineGuardrails, modelCheckRail } from '@purista/harness-guardrails'

const modelSafetyAction = modelCheckRail({
  phase: 'input',
  model: 'safety',
  instructions: 'Allow only safe support requests.',
})
const rails = defineGuardrails({
  actions: { modelSafety: modelSafetyAction },
  config: { rails: { input: { flows: ['modelSafety'] } } },
})

const agent = defineAgent('answer', {
  model: 'answering',
  guardrails: rails,
  instructions: 'Answer the support request safely and clearly.',
})
const definition = defineHarness({ name: 'support' }).addAgent(agent)
const harness = await definition.getInstance({
  models: {
    answering: answeringModel,
    safety: { provider: safetyProvider, model: 'safety-model-id' },
  },
})
```
The guardrail model is not business authorization. Fail closed on unavailable
or malformed decisions, bound timeout and cost, and keep content capture
policy explicit. Test provider failure and cancellation separately from quality
evaluations.
