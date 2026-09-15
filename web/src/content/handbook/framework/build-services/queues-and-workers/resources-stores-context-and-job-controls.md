---
title: Use worker resources, stores, context, and job controls
description: Use the leased message, declared dependencies, service resources, stores, telemetry, and cooperative cancellation without leaking transport assumptions.
order: 355
---

A queue worker receives `(context, message)`. `message` is the leased job;
`context` contains the application capabilities for that lease. Keep the
handler focused on a business result and use job controls only for an explicit
lease decision. The current fluent worker builder has a known type-propagation
gap: queue schemas and service resources exist at runtime but are not inferred
in the handler. Do not introduce casts to compensate; use the focused tests in
[Test queued work](/handbook/framework/build-services/queues-and-workers/test-queued-work/)
to prove the expected boundary until the Framework builder is corrected.

| Context member | What it gives you | Use carefully |
| --- | --- | --- |
| `message` | Readonly id, queue name, payload, parameter, headers, attempts, lease, trace/correlation metadata | Headers are transport metadata; do not authorize from arbitrary values or log sensitive payloads. |
| `resources` | Concrete dependencies supplied when the service is instantiated | Keep I/O behind a focused resource. |
| `configs`, `secrets`, `states` | Runtime stores plus logger and span helpers | Link permission/retention decisions to the store configuration. |
| `metrics` | Declared custom metrics | Use low-cardinality labels only. |
| `service`, `stream`, `queue`, `emit`, `agent` | Only capabilities declared on the worker builder | Declare a capability before relying on it. |
| `signal`, `job.cancelRequested()` | Cooperative cancellation | Stop expensive upstream work and return promptly. |

## Settle a job explicitly only when needed

For an idempotent report worker, the runtime sequence is: read a durable result
by the business key; stop upstream work if `signal` is aborted; persist the
result; then settle success. A separately typed function keeps that contract
compile-time visible while the fluent worker builder does not yet infer queue
schemas and service resources:

```ts title="Typed worker logic and direct context test"
import {
  createQueueWorkerContextMock,
  type QueueJobContext,
  type QueueMessage,
} from '@purista/core'
import { expect, test } from 'vitest'

type ReportJob = { reportId: string }
type ReportResources = {
  reports: { generate(reportId: string, signal: AbortSignal): Promise<{ reportId: string }> }
}

async function runReportJob(
  context: QueueJobContext<ReportJob, undefined, ReportResources>,
  message: QueueMessage<ReportJob>,
) {
  const stateKey = `report:${message.payload.reportId}`
  const state = await context.states.getState(stateKey)
  const previous = state[stateKey] as { reportId: string } | undefined
  if (previous) {
    await context.job.complete(previous)
    return
  }

  if (context.signal.aborted || context.job.cancelRequested()) {
    await context.job.retry({ reason: 'worker cancellation requested', delayMs: 1_000 })
    return
  }

  const result = await context.resources.reports.generate(
    message.payload.reportId,
    context.signal,
  )
  await context.states.setState(stateKey, result)
  await context.job.complete(result)
}

test('persists before completing the lease', async () => {
  const reports = { generate: async (reportId: string) => ({ reportId }) }
  const mocked = createQueueWorkerContextMock(generateReportWorkerBuilder, {
    queueName: 'generateReport',
    payload: { reportId: 'report-1' },
    parameter: undefined,
    resources: { reports },
  })
  mocked.stubs.getState.resolves({})
  mocked.stubs.setState.resolves()

  await runReportJob(mocked.context, mocked.message)

  expect(mocked.stubs.setState.calledBefore(mocked.stubs.job.complete)).toBe(true)
  expect(mocked.stubs.job.complete.calledWith({ reportId: 'report-1' })).toBe(true)
})
```

Store accessors in the mock reject until the test re-arms them. This keeps an
undeclared persistence dependency from passing silently.

| Job control | Runtime effect |
| --- | --- |
| `complete(output?, headers?)` | Deliver success result policy, then acknowledge. |
| `retry(request?)` | Settle the lease and start retry/dead-letter handling. |
| `fail(reason, fatal?)` | Fatal failures dead-letter; other failures enter recovery. |
| `moveToDeadLetter(reason?)` | Move the current job directly to the configured/derived dead-letter queue. |
| `extendLease(durationMs)` | Ask the selected bridge to extend the lease. |
| `cancelRequested()` | Read the runtime's cooperative cancellation state. |

Use `signal` for I/O cancellation and store a business-keyed durable result
before returning success. Lease extension and cancellation are not substitutes
for an idempotent effect. For the capability declarations, read [compose a
worker](/handbook/framework/build-services/queues-and-workers/invoke-enqueue-emit-stream-and-call-agents/); for store wiring and handler operations, read [use stores from handlers](/handbook/framework/configure-applications/use-stores-from-handlers/).

For the full handler type, see [QueueJobContext](/handbook/api/types/_purista_core.QueueJobContext/).
