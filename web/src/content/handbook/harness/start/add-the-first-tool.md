---
title: Add the first tool
description: Give an agent one typed application operation with explicit authorization.
order: 50
---

A native tool is a typed definition. Its handler remains application code and
must authorize every side effect.

```ts title="src/harness/orderSupport.ts"
import { defineAgent, defineHarness, defineTool } from '@purista/harness'
import { z } from 'zod'

const accounts = {
  readPlan: async (accountId: string) => ({ accountId, plan: 'standard' }),
}

const lookupPlan = defineTool('lookupPlan', {
  description: 'Read the plan visible to the current caller.',
  input: z.object({ accountId: z.string() }),
  output: z.object({ plan: z.string() }),
  handler: async (_context, input) => accounts.readPlan(input.accountId),
})
const support = defineAgent('support', {
  model: 'answering',
  tools: [lookupPlan],
  instructions: 'Use lookupPlan when account plan data is needed.',
})
export const definition = defineHarness({ name: 'support' }).addAgent(support)
```
The tool is unavailable to the model until the agent allowlist includes its
object. A description guides selection; it never grants authorization. A
portable Harness tool receives only declared Harness facilities and a signal;
PURISTA service resources belong in `ServiceBuilder.defineTool` in the hosted
integration layer.

Next: [define an agent](/handbook/harness/build-agents/agent-definition/).
