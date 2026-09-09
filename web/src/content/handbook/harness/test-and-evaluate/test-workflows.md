---
title: Test workflows
description: Exercise workflow coordination with a fake model provider, bounded fan-out, cancellation, and replayable state.
order: 813
---

Keep the workflow and agents real. Bind a strict fake model provider and fake
external ports so the test remains deterministic and credential-free.

```ts title="src/harness/createInvoiceReviewHarness.ts"
import { defineAgent, defineHarness, defineWorkflow } from '@purista/harness'
import { z } from 'zod'

const reviewAgent = defineAgent('reviewInvoice', {
  input: z.string(), output: z.enum(['approved', 'review']),
  model: 'primary',
  prompt: value => ({ role: 'user', content: value }),
  instructions: 'Decide whether the invoice is approved or needs review.',
})
const batch = defineWorkflow('reviewBatch', {
  input: z.array(z.string()).min(1),
  output: z.array(z.enum(['approved', 'review'])),
  agents: [reviewAgent],
  handler: context => context.fanOut(context.input, (id, index) =>
    context.agents.reviewInvoice.run(id, { callId: `review-invoice-${index}` }),
    { concurrency: 2 }),
})
export const definition = defineHarness({ name: 'invoice-review' }).addAgent(reviewAgent).addWorkflow(batch)
export const harness = await definition.getInstance({ model: primaryModel })
```
Assert result order, concurrency, cancellation, durable step replay, external
wait resume, and retry behavior. Use a selected durable adapter for crash and
lease tests; an in-memory fake cannot prove multi-instance recovery.
