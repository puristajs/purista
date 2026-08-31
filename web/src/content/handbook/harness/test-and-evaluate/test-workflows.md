---
title: Test workflows
description: Exercise real workflow coordination with deterministic agent handlers, bounded fan-out, events, cancellation, and replayable state.
order: 813
---

Workflow tests should prove coordination, not model wording. Keep the real
workflow handler and replace each agent or external port with a deterministic
implementation. This makes ordering, concurrency, retries, review, and
persistence observable without a provider call.

The example reviews invoices with at most two parallel child agent calls and
preserves the input order in the result.

## Build a deterministic workflow fixture

```ts title="src/harness/createInvoiceReviewHarness.ts"
import { defineHarness, inMemorySandbox, type ModelProvider } from '@purista/harness'
import { z } from 'zod'

type ReviewInvoice = (invoiceId: string) => Promise<'approved' | 'review'>

export function createInvoiceReviewHarness(provider: ModelProvider, reviewInvoice: ReviewInvoice) {
	return defineHarness({ name: 'invoice-review' })
		.sandbox(inMemorySandbox())
		.models({
			reviewer: { provider, model: 'reviewer', capabilities: ['object'] },
		})
		.agent('review_invoice', {
			model: 'reviewer',
			input: z.string(),
			output: z.enum(['approved', 'review']),
			instructions: 'Review one invoice.',
			handler: context => reviewInvoice(context.input),
		})
		.workflow('review_batch', {
			input: z.array(z.string()).min(1),
			output: z.array(z.enum(['approved', 'review'])),
			delegation: {
				agents: ['review_invoice'],
				maxParallelChildAgentCalls: 2,
			},
			handler: context =>
				context.fanOut(context.input, invoiceId => context.agents.review_invoice(invoiceId), { concurrency: 10 }),
		})
		.build()
}
```

The agent's custom handler is the deterministic seam. The normal model alias,
schemas, agent registry, workflow registry, delegation policy, session, and
event path still execute. `fanOut` applies the lower of its requested
concurrency and the workflow delegation ceiling, so this fixture can verify the
real budget rule.

The fixture retains
[`defineHarness(...)`](/handbook/api/functions/_purista_harness.defineHarness/),
[`.sandbox(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox),
[`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models),
[`.agent(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent),
[`.workflow(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#workflow),
and [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build).
The [workflow guide](/handbook/harness/orchestrate-work/workflows/) owns the
full definition and delegation options; this page owns test replacement and
evidence.

## Assert results and coordination events

```ts title="src/harness/createInvoiceReviewHarness.test.ts"
import { describe, expect, it, vi } from 'vitest'
import { FakeModelProvider, recordEvents } from '@purista/harness/testing'
import { createInvoiceReviewHarness } from './createInvoiceReviewHarness.js'

describe('invoice review workflow', () => {
	it('limits parallel reviews and preserves result order', async () => {
		const provider = new FakeModelProvider({ strict: true })
		let active = 0
		let peak = 0
		const reviewInvoice = vi.fn(async (invoiceId: string) => {
			active += 1
			peak = Math.max(peak, active)
			await Promise.resolve()
			active -= 1
			return invoiceId === 'INV-2' ? ('review' as const) : ('approved' as const)
		})
		const harness = createInvoiceReviewHarness(provider, reviewInvoice)

		try {
			const session = await harness.getSession('invoice-batch')
			const events = await recordEvents(session.workflows.review_batch.stream(['INV-1', 'INV-2', 'INV-3']))

			expect(peak).toBeLessThanOrEqual(2)
			expect(events.find(event => event.type === 'fanout.started')).toMatchObject({ count: 3, concurrency: 2 })
			expect(events.find(event => event.type === 'run.finished')).toMatchObject({
				output: ['approved', 'review', 'approved'],
			})
			expect(provider.requests).toHaveLength(0)
			provider.assertExhausted()
		} finally {
			await harness.shutdown()
		}
	})
})
```

The strict provider also protects the fixture: an accidental fallback from the
custom handler to a live model path fails because no response is queued.

## Expand by workflow feature

| Feature | Deterministic evidence |
| --- | --- |
| `context.step` | The side effect runs once, committed output replays, invalid or duplicate step IDs fail, and configured retry exhaustion is visible |
| Child tasks | Start/result/cancel status, idempotency key, timeout, allowed agent/model, and isolated context are enforced |
| Human review | The wait persists, a valid external signal resumes once, malformed/expired/duplicate decisions fail safely |
| Cancellation | Abort reaches active agents and adapters; no new fan-out work starts |
| Durable retry | Rebuild the Harness over retained storage/workspace, reuse the durable run ID, and prove committed work is not repeated |
| Compensation | Record the completed side effects, force the later failure, and assert compensations run in the declared order |
| Streaming | `run.started` is first, terminal state is last, and breaking a consumer iterator does not cancel the run without an abort signal |

Use the in-memory adapters for ordinary workflow logic. For crash recovery,
lease conflict, missing state, or multi-instance behavior, use the selected
durable adapter's integration fixture rather than mocking persistence methods
inside the workflow.
