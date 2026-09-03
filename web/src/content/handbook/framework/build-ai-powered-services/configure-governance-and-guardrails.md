---
title: Configure guardrails and governance
description: Put content controls in the portable Harness definition and keep business authorization at the PURISTA service boundary.
order: 3992
---

Use Harness guardrails for model-facing content controls such as input checks,
prompt-injection detection, PII handling, tool-call inspection, and output
validation. The Harness definition owns their order and action, so the same
controls apply in standalone and PURISTA-hosted execution.

```ts title="Declare Harness guardrails"
const supportRails = defineGuardrails({
  config: { rails: { input: { flows: ['safe customer content'] } } },
  actions: { 'safe customer content': customerContentGuardrail },
})

export const supportHarness = defineHarness({ name: 'support' })
  .agent('assistant', {
    // model, input, output, instructions, and updates omitted here
    guardrails: supportRails,
  })
  .define()
```

Bind guardrail dependencies and optional policy engines through the Harness
runtime configuration. Keep credentials and environment-specific endpoints out
of the definition.

Guardrails do not decide whether a principal may read an account, initiate a
transfer, or approve a review. Use mount before/after guards and authorization
inside the command that owns each business effect. An explicit content block
crossing a PURISTA mount becomes a handled `403` with stable, content-free
error data. A detector or decision callback failure remains an internal
operational error and fails closed.

Capture prompts, model outputs, and tool inputs only when an explicit data
policy allows it. Production telemetry should default to no content capture.
