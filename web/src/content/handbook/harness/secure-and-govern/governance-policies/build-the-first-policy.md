---
title: Build the first governance policy
description: Deny one unauthorized tool operation before its handler runs, then test the fail-closed result.
order: 702
---

Governance decides allow, deny, audit, or approval for a selected operation.
Authentication and business authorization remain application responsibilities.

```ts title="Build The First Policy example 1"
const transfer = defineTool('transferFunds', {
  description: 'Transfer approved funds.',
  input: transferInput,
  output: transferOutput,
  handler: executeTransfer,
})
const agent = defineAgent('support', {
  model: 'primary', tools: [transfer],
  instructions: 'Use the transfer tool only for an authorized payment request.',
  governance: { policies: [denyUnverifiedTransfer] },
})
const definition = defineHarness({ name: 'support' }).addAgent(agent)
const harness = await definition.getInstance({ model: primaryModel })
```
Register policies before accepting work. A deny or approval interruption must
happen before the handler side effect. Test matching and nonmatching selectors,
precedence, shadow mode, timeout, cancellation, malformed evaluator output,
and the negative assertion that `executeTransfer` did not run.
