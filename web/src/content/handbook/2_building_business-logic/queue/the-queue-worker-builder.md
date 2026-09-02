---
title: The Queue Worker Builder
description: Configure workers, polling modes, leases, and failure handling for queues.
order: 203520
---

# The Queue Worker Builder

Workers consume jobs produced by queue definitions. Use `serviceBuilder.getQueueWorkerBuilder(queueId, description)` to declare mode, concurrency, and handler logic.

## CLI scaffolding

```bash
npm run add:queue-worker
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

- `context.job.complete(output?, headers?)` – acknowledge success. Optional output and response headers are available to HTTP status endpoints.
- `context.job.retry({ delayMs?, reason? })` – release the job back to the queue with optional delay.
- `context.job.extendLease(durationMs)` – extend the visibility timeout for long-running work. The argument is required.
- `context.job.moveToDeadLetter(reason?)` – skip retries and push to the DLQ.
- `context.job.fail(reason, fatal?)` – mark as failed (counts toward retry budget). Pass `fatal: true` to bypass retries and send directly to the DLQ.

All helpers emit OpenTelemetry spans so you get timing and failure statistics automatically.

## Outbound capabilities

Queue workers can call other PURISTA boundaries, but those calls should be declared on the worker builder so the handler context is typed and test helpers can expose matching stubs.

```ts
export const processJobWorkerBuilder = pingV1ServiceBuilder
  .getQueueWorkerBuilder('pingJob', 'Process queued pings')
  .canInvoke('NotificationService', '1', 'sendEmail', sendEmailOutputSchema, sendEmailPayloadSchema)
  .canConsumeStream('ReportService', '1', 'exportReport', reportChunkSchema, reportPayloadSchema)
  .canEnqueue('auditJob', auditPayloadSchema, auditParameterSchema)
  .canEmit('ping.processed', pingProcessedEventSchema)
  .canInvokeAgent('triagePing', '1', {
    outputSchema: triageOutputSchema,
    payloadSchema: triagePayloadSchema,
    parameterSchema: triageParameterSchema,
  })
  .setHandler(async function (context) {
    await context.service.NotificationService['1'].sendEmail({ id: context.message.id })
    await context.queue.enqueue.auditJob({ id: context.message.id })
    await context.emit('ping.processed', { jobId: context.message.id })
    const triage = await context.agent['triagePing.1'].run({ jobId: context.message.id })

    return { status: 'success', output: triage }
  })
```

Use address-first `.canInvokeAgent(service, version, target, contract)` or
`.canInvokeWorkflow(...)` for mounted Harness targets. Calls cross EventBridge
for same-service and cross-service targets. Create a command wrapper only when
the application needs a distinct command contract.

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

Workers share the same service resources defined through the `ServiceBuilder`. Inject DB clients, model clients, and other adapters via `serviceBuilder.addResource(...)`; they become available as `context.resources.<name>` inside the worker.

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
