---
title: Test a Queue Worker
description: Test queue worker handlers with a context mock or execute one real worker cycle with the runtime harness.
order: 203530
---

# Test a queue worker

Queue workers also have two useful levels:

- `createQueueWorkerContextMock(...)` for direct handler tests
- `createQueueWorkerTestHarness(...)` for one real worker cycle

## Handler test

Use the context mock when you want to focus on the worker logic itself.

```ts
import { createQueueWorkerContextMock } from '@purista/core/testing'

const mock = createQueueWorkerContextMock(pingJobWorkerQueueWorkerBuilder, {
  queueName: 'pingJob',
  payload: { ping: 'queued ping' },
  parameter: { requestId: 'req-1' },
})

const definition = await pingJobWorkerQueueWorkerBuilder.getDefinition()
await definition.handler(mock.context, mock.message)

expect(mock.stubs.job.complete.calledOnce).toBe(true)
```

Use this level when you want to verify:

- job completion or retry logic
- resource usage
- handler branching
- declared outbound calls through `mock.stubs.service`, `mock.stubs.stream`, `mock.stubs.enqueue`, `mock.stubs.emit`, and `mock.stubs.agent`

For example, if a worker declares `.canEnqueue('auditJob', ...)` and `.canInvokeAgent('triagePing', '1', ...)`, the context mock exposes matching helpers:

```ts
const mock = createQueueWorkerContextMock(processJobWorkerBuilder, {
  queueName: 'pingJob',
  payload: { ping: 'queued ping' },
  parameter: { requestId: 'req-1' },
})

mock.stubs.agent['triagePing.1'].run.resolves({ priority: 'normal' })

const definition = await processJobWorkerBuilder.getDefinition()
await definition.handler(mock.context, mock.message)

expect(mock.stubs.enqueue.calledWith('auditJob')).toBe(true)
expect(mock.stubs.agent['triagePing.1'].run.calledOnce).toBe(true)
```

## Runtime test

Use the harness when you want to verify the real worker runtime path.

```ts
import { createQueueWorkerTestHarness } from '@purista/core/testing'

const harness = await createQueueWorkerTestHarness(pingV1Service, pingJobWorkerQueueWorkerBuilder)

try {
  const result = await harness.run({
    id: 'job-1',
    queueName: 'pingJob',
    payload: { ping: 'queued ping' },
    parameter: { requestId: 'req-1' },
    headers: {},
    createdAt: Date.now(),
    attempt: 1,
    maxAttempts: 3,
    leaseExpiresAt: Date.now() + 60_000,
    leaseTtlMs: 60_000,
    traceId: 'trace-1',
    correlationId: 'corr-1',
  })

  expect(result.ackCalls).toHaveLength(1)
  expect(result.deadLetterCalls).toHaveLength(0)
} finally {
  await harness.destroy()
}
```

Use this level when you want to verify:

- before and after guards
- queue bridge acknowledgements
- retry or dead-letter behavior

## Related guides

- [The queue worker builder](./the-queue-worker-builder.md)
- [The queue builder](./the-queue-builder.md)
