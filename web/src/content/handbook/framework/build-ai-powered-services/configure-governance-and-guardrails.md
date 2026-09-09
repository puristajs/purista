---
title: Configure guardrails and governance
description: Put content controls in the agent definition and business authorization at the PURISTA service boundary.
order: 3992
---

Use Harness guardrails for model-facing controls such as input checks,
prompt-injection detection, PII handling, tool-call inspection, and output
validation. The agent owns their order, so the controls travel with the
portable definition.

```ts title="Attach guardrails to an agent"
const supportRails = defineGuardrails({
  config: { rails: { input: { flows: ['safe customer content'] } } },
  actions: { 'safe customer content': customerContentGuardrail },
})

export const assistantAgent = defineAgent('assistant', {
  description: 'Help a customer with a support request',
  input: supportInputSchema,
  output: supportOutputSchema,
  instructions: input => `Help with this request: ${input.request}`,
  guardrails: supportRails,
})
```

Bind guardrail dependencies and policy engines through the runtime
configuration. Keep credentials and environment-specific endpoints out of the
definition.

Guardrails control content. They do not decide whether a principal may read an
account, initiate a transfer, or approve a review. Use target guards and
authorization inside the command that owns each business effect. An explicit
content block at a PURISTA mount becomes a handled `403` with stable,
content-free error data. A detector failure remains an internal operational
error and fails closed.

Capture prompts, model output, and tool input only when your data policy allows
it. Production telemetry should default to no content capture.
