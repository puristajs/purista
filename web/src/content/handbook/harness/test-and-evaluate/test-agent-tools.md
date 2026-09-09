---
title: Test agent tools
description: Script the model loop and inject tool dependencies to prove arguments, results, permissions, and failures without external calls.
order: 812
---

Define the tool directly, inject its dependency through runtime resources, and
allowlist the definition on the agent.

```ts title="src/harness/createSupportHarness.ts"
import { defineAgent, defineHarness, defineTool, type ModelProvider } from '@purista/harness'
import { z } from 'zod'

type Accounts = { lookupAuthorized: (accountId: string) => Promise<{ plan: 'standard' | 'priority' }> }
const createLookup = (accounts: Accounts) => defineTool('lookupAccount', {
  description: 'Load the authorized support account.',
  input: z.object({ accountId: z.string() }),
  output: z.object({ plan: z.enum(['standard', 'priority']) }),
  handler: async (_context, input) => accounts.lookupAuthorized(input.accountId),
})
const createSupport = (lookup: ReturnType<typeof createLookup>) => defineAgent('support', {
  model: 'assistant', tools: [lookup],
  input: z.object({ accountId: z.string(), question: z.string() }),
  output: z.object({ answer: z.string() }),
  prompt: input => ({ role: 'user', content: input.question }),
  instructions: 'Use lookupAccount when the answer depends on the plan.',
})
export function createSupportHarness(provider: ModelProvider, accounts: Accounts) {
  const lookup = createLookup(accounts)
  const support = createSupport(lookup)
	return defineHarness({ name: 'support' }).addAgent(support).getInstance({
		models: { assistant: { provider, model: 'assistant' } },
	})
}
```
The repository is injected through a closure, so this portable tool uses only
declared Harness context. In a PURISTA service, create the tool with
`ServiceBuilder.defineTool(...)` when it needs service-owned resources and
authenticated caller context.

Script the tool-call response and final response with a strict fake provider.
Assert the handler receives authorized identity and cancellation, malformed
arguments do not call it, and unexpected or unused model fixtures fail.

The tool schema is not authorization. The application owns caller identity,
tenant checks, credentials, and side-effect idempotency.
