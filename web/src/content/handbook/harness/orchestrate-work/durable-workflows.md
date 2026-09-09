---
title: Build durable workflows
description: Persist replay-safe steps and external waits so a workflow can resume after a process restart.
order: 530
---

Durability requires Harness storage, a compatible durable workspace when files
are involved, and a workflow that separates replay-safe steps from unmanaged
side effects.

```ts title="src/harness/durableReview.ts"
import { defineHarness, defineWorkflow } from '@purista/harness'
import { localDurableExecution } from '@purista/harness'
import { z } from 'zod'

type Reports = { load: (reportId: string) => Promise<{ status: string }> }
const createReviewWorkflow = (reports: Reports) => defineWorkflow('durableReview', {
  input: z.object({ reportId: z.string() }),
  output: z.object({ status: z.string() }),
  durable: true,
  handler: async context => {
    const record = await context.step('load-report', () => reports.load(context.input.reportId))
    return { status: record.status }
  },
})
export async function createReviewHarness(reports: Reports) {
  const local = localDurableExecution({ root: './.harness' })
  const definition = defineHarness({ name: 'durable-review' }).addWorkflow(createReviewWorkflow(reports))
  return definition.getInstance({ storage: local.storage, workspace: local.workspace, sandbox: local.sandbox })
}
```
Step IDs are part of the replay contract. Keep side effects inside a step with
an idempotency key or reconcile them at the application boundary. External
human decisions use `context.externalWait.wait(...)`; they are persisted
interrupt outcomes, not model errors. Test restart, duplicate delivery, lease
conflict, cancellation, and missing state with the selected adapter.
