---
title: The Queue Worker Builder
description: Configure workers, polling modes, leases, and failure handling for queues.
order: 203520
---

# The Queue Worker Builder

Workers consume jobs produced by queue definitions. Use `serviceBuilder.getQueueWorkerBuilder(queueId, description)` to declare mode, concurrency, and handler logic.

## CLI scaffolding

```bash
purista add queue-worker
```

The wizard prompts for the queue, worker name, polling mode, and whether to reuse the existing resource wiring/tests.

## Modes

| mode | behavior |
| --- | --- |
| `sequential` (default) | Fetch the next job only after the handler resolves. Ideal for per-tenant serial workloads or long-running jobs. |
| `interval` | Run on a fixed interval (`setInterval` style). Suitable for scheduled scans or low-frequency background tasks. |
| `continuous` | Long-poll the queue with a minimal delay between leases. Use for high-throughput worker pools. |

```ts
export const pingJobWorkerBuilder = pingV1ServiceBuilder
  .getQueueWorkerBuilder('pingJob', 'Ping job worker')
  .setMode('continuous')
  .setIntervalMs(250) // only for interval mode
  .setHandler(async function (context, job) {
    context.logger.info({ jobId: job.id }, 'processing async ping')
    // ... do work ...
    await context.job.complete()
  })
```

## Handler utilities

Inside the handler you receive:

- `context.job.complete(result?)` – acknowledge success. Optional payload is passed to metrics/telemetry.
- `context.job.retry({ delayMs?, reason? })` – release the job back to the queue with optional delay.
- `context.job.extendLease(extensionMs?)` – extend the visibility timeout for long-running work.
- `context.job.moveToDeadLetter(reason?)` – skip retries and push to the DLQ.
- `context.job.fail(error)` – mark as failed (counts toward retry budget).

All helpers emit OpenTelemetry spans so you get timing and failure statistics automatically.

## Error handling

Unhandled exceptions trigger `context.job.retry()` automatically until `maxAttempts` is exceeded. Use `HandledError` to control the reason/status stored alongside the job. For critical failures, call `context.job.moveToDeadLetter()` yourself to bypass retries.

### Poison message controls

Queue lifecycle supports optional poison handling:

- `poisonMessageFailureThreshold`: number of repeated identical failures before action triggers
- `poisonMessageAction: 'pause-worker'`: pauses workers for that queue when threshold is reached

When enabled, operators can:

- inspect paused queues via `service.getQueueWorkerPauseState()`
- resume processing with `service.resumeQueueWorkers(queueName)`
- pause manually with `service.pauseQueueWorkers(queueName, reason)`

## Workers + resources

Workers share the same service resources defined through the `ServiceBuilder`. Inject DB clients, OpenAI SDKs, etc., via `serviceBuilder.addResource(...)` and they become available as `context.resources.<name>` inside the worker.

## Testing workers

Use the same testing split as the rest of PURISTA:

- `createQueueWorkerContextMock(...)` for direct handler tests
- `createQueueWorkerTestHarness(...)` for one real worker cycle through the runtime

Use the runtime harness when you need to verify acknowledgements, retries, or dead-letter behavior instead of only the handler logic.

## Related docs

- [Queue builder](./the-queue-builder.md)
- [Test a queue worker](./test-a-queue-worker.md)
- [Async HTTP exposure](./queue-http-exposure.md)
- [Queue bridges](../../3_eco_system/queue_bridges/index.md)
