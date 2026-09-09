---
title: Build the first guarded agent
description: Add one fail-closed Guardrails action to a default-loop agent and test the denied path.
order: 752
---

Install the optional Guardrails package, define a typed action, and bind it on
the agent definition. Guardrails inspect content; application authorization
still owns business actions.

```ts title="Build The First Guarded Agent example 1"
const agent = defineAgent('support', {
  model: 'primary',
  guardrails: { input: [redactSecrets], output: [redactSecrets] },
  instructions: 'Answer the support request without exposing sensitive data.',
})
const definition = defineHarness({ name: 'support' }).addAgent(agent)
const harness = await definition.getInstance({ model: primaryModel })
```
Test allowed input, transformed input, denied output, malformed action results,
timeout, cancellation, and the negative assertion that the handler or tool did
not run. Keep evidence content-free and do not use Guardrails as business auth.
