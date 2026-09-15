---
title: Test queued work
description: Separate direct worker logic, deterministic Framework runtime flow, and the selected QueueBridge's delivery guarantees.
order: 358
---

Queue tests need three boundaries. A direct mock is fast for business decisions;
the deterministic harness executes one Framework worker cycle; a real adapter
test proves the selected broker's guarantees. None replaces the others.

| Boundary | Proves | Does not prove |
| --- | --- | --- |
| Direct logic: `createQueueWorkerContextMock` | Handler branches, declared dependency calls, emitted events, resource/store stubs, and requests to job-control stubs | Transforms, schema validation, guards, heartbeat/cancellation, result policy, ack/nack/DLQ, registration, HTTP, or adapter behaviour. |
| Deterministic runtime: `createQueueWorkerTestHarness` | One leased cycle: execute transform, guards, handler, implicit/explicit settlement, result delivery, and mocked bridge interactions | Service startup/registration, broker persistence, true lease expiry/redelivery, ordering, delayed delivery, idempotency enforcement, process races, HTTP/discovery, or provider capability claims. |
| Selected real adapter | Provider start/health, persistence, delay, lease recovery, DLQ/redrive, and configured bridge capabilities | Guarantees from another bridge or exactly-once business effects. |

## Test the handler decision directly

```ts title="src/service/report/v1/queue-worker/generateReport.test.ts"
import { createQueueWorkerContextMock } from '@purista/core'
import { expect, test } from 'vitest'

test('returns success after storing one report', async () => {
  const { context, message, stubs } = createQueueWorkerContextMock(generateReportWorkerBuilder, {
    queueName: 'generateReport',
    payload: { reportId: 'report-1' },
    resources: { reports: { generate: async () => ({ id: 'report-1' }) } },
  })
  const definition = await generateReportWorkerBuilder.getDefinition()

  await expect(definition.handler.call(undefined, context, message)).resolves.toEqual({
    status: 'success',
    output: { reportId: 'report-1' },
  })
  expect(stubs.job.complete.called).toBe(false)
})
```

The direct helper takes `(workerBuilder, { queueName, payload, parameter?,
sandbox?, resources?, message? })` and returns `{ context, message, stubs }`.
Its `moveToDeadLetter` mock is represented by `stubs.job.fail(..., true)`, not
a separate dead-letter stub.

Config, secret, and state accessor stubs reject by default. Re-arm every store
operation the handler intentionally uses, for example:

```ts title="Configure deterministic worker store stubs"
stubs.getState.resolves({ 'report:report-1': undefined })
stubs.setState.resolves()
```

This makes persistence part of the test contract instead of silently returning
invented state.

## Run one deterministic worker cycle

```ts title="src/service/report/v1/queue-worker/generateReport.runtime.test.ts"
import { createQueueWorkerTestHarness } from '@purista/core'
import { expect, test } from 'vitest'

test('acknowledges a successful report job', async () => {
  const harness = await createQueueWorkerTestHarness(reportV1ServiceBuilder, generateReportWorkerBuilder)
  try {
    const result = await harness.run({
      id: 'job-1', queueName: 'generateReport', payload: { reportId: 'report-1' }, headers: {},
      createdAt: Date.now(), attempt: 1, maxAttempts: 3, leaseExpiresAt: Date.now() + 60_000,
      leaseTtlMs: 60_000, traceId: 'trace-1', correlationId: 'correlation-1',
    })
    expect(result.ackCalls).toHaveLength(1)
    expect(result.deadLetterCalls).toHaveLength(0)
  } finally {
    await harness.destroy()
  }
})
```

The harness accepts `(serviceBuilder, workerBuilder, options?)`; it creates
mock bridges unless supplied and returns `service`, bridges, mock `stubs`,
`run(message)`, and `destroy()`. It instantiates the service but does not start
it. Use its default mock QueueBridge when calling `run(message)`: that is the
mode that injects the leased message and records settlement calls. A supplied
real QueueBridge needs a separate adapter integration test; this helper cannot
inject a message into it or expose a bridge call trace. Always call `destroy()`.

Cover success, retry, fatal failure, duplicate business key, cancellation/lease
loss, and the result-policy path deterministically. Then run a provider test
for the real QueueBridge. For API details, see [createQueueWorkerContextMock](/handbook/api/functions/_purista_core.createQueueWorkerContextMock/) and [createQueueWorkerTestHarness](/handbook/api/functions/_purista_core.createQueueWorkerTestHarness/).
