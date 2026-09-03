---
title: Test agent tools
description: Script the model loop and inject tool dependencies to prove arguments, results, permissions, and failures without external calls.
order: 812
---

Test a tool at two boundaries. First test its handler as ordinary application
code. Then run one scripted agent loop to prove that Harness validates the
model's arguments, invokes the allowed tool, returns its result to the model,
and validates the final answer.

The example handles a support request that needs an account lookup. The lookup
function is application-owned and injectable; the agent never receives database
credentials.

## Define the tool around an injected dependency

```ts title="src/harness/createSupportHarness.ts"
import { defineHarness, inMemorySandbox, type ModelProvider } from '@purista/harness'
import { z } from 'zod'

export type AccountLookup = (
	accountId: string,
	signal: AbortSignal,
) => Promise<{ name: string; plan: 'standard' | 'priority' }>

export function createSupportHarness(provider: ModelProvider, lookupAccount: AccountLookup) {
	return defineHarness({ name: 'support' })
		.sandbox(inMemorySandbox())
		.models({
			assistant: { provider, model: 'assistant', capabilities: ['object', 'tool_use'] },
		})
		.tool('lookup_account', {
				description: 'Load the authorized support account.',
				input: z.object({ accountId: z.string().regex(/^AC-[0-9]+$/) }),
				output: z.object({ name: z.string(), plan: z.enum(['standard', 'priority']) }),
				handler: (context, { accountId }) => lookupAccount(accountId, context.signal),
		})
		.agent('answer_support_request', {
			model: 'assistant',
			input: z.object({ accountId: z.string(), question: z.string().min(1) }),
			output: z.object({ answer: z.string().min(1) }),
			tools: ['lookup_account'],
			instructions: 'Use the account lookup when the answer depends on the customer plan.',
		})
		.build()
}
```

The tool schema is the technical contract. The surrounding application must
still authenticate the caller and authorize `accountId` before it invokes the
agent. The injected lookup receives the Harness cancellation signal so a
cancelled run does not leave database or HTTP work running.

This production-shaped chain uses
[`defineHarness(...)`](/handbook/api/functions/_purista_harness.defineHarness/),
[`.sandbox(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox),
[`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models),
[`.tool(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#tool),
[`.agent(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent),
and [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build).
See [Create typed tools](/handbook/harness/add-capabilities/tools/) for the
complete tool contract; this page owns its deterministic interaction test.

## Script both model rounds

The first response requests the tool. The second produces the final structured
answer after Harness has appended the validated tool result.

```ts title="src/harness/createSupportHarness.test.ts"
import { describe, expect, it, vi } from 'vitest'
import { FakeModelProvider } from '@purista/harness/testing'
import { createSupportHarness } from './createSupportHarness.js'

describe('support account lookup', () => {
	it('calls the allowed tool and returns the final answer', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: {},
			toolCalls: [
				{
					id: 'account-call-1',
					name: 'lookup_account',
					arguments: { accountId: 'AC-42' },
				},
			],
			finishReason: 'tool_calls',
		})
		provider.enqueueObject({
			object: { answer: 'Priority support is available.' },
			finishReason: 'stop',
		})
		const lookupAccount = vi.fn(async () => ({
			name: 'Example Industries',
			plan: 'priority' as const,
		}))
		const harness = createSupportHarness(provider, lookupAccount)

		try {
			const session = await harness.getSession('priority-support')
			await expect(
				session.agents.answer_support_request.run({
					accountId: 'AC-42',
					question: 'Which support level applies?',
				}),
			).resolves.toEqual({
				status: 'completed',
				runId: expect.any(String),
				output: { answer: 'Priority support is available.' },
			})

			expect(lookupAccount).toHaveBeenCalledWith('AC-42', expect.any(AbortSignal))
			expect(provider.requests).toHaveLength(2)
			provider.assertExhausted()
		} finally {
			await harness.shutdown()
		}
	})
})
```

This test is deterministic because both model decisions and the external lookup
are controlled. It proves the application flow, not whether a live model will
choose the tool for every real request.

## Add failures at the owner boundary

| Behavior | Where to arrange it | What to assert |
| --- | --- | --- |
| Invalid tool arguments | Script `accountId: '42'` | Handler is not called; the normalized validation result returns to the loop |
| Tool not allowed for this agent | Remove `lookup_account` from the agent or script another registered tool | No tool side effect occurs; permission failure is explicit |
| Dependency failure | Make `lookupAccount` reject with a sanitized application error | The caller receives the intended normalized failure; no credential or database detail leaks |
| Cancellation | Make the dependency wait on `signal`, then abort the invocation | The dependency stops and the run reports cancellation |
| Repeated calls | Script more tool rounds than `maxSteps` permits | Harness fails with `AgentLoopBudgetError` |
| Unexpected extra model round | Queue only the expected rounds in strict mode | The fake rejects the extra request |

For MCP, keep the same application assertions but replace the server boundary
with a hermetic fake MCP server. Cover authentication failure, malformed
schemas, protocol failure, timeout, cancellation, process death, and shutdown
cleanup without reaching a real remote service. See
[Connect MCP tools](/handbook/harness/add-capabilities/mcp/) for transport setup.
