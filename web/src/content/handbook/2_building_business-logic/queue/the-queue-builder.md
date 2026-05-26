---
title: The Queue Builder
description: Declare pull-based queues, schemas, lifecycle defaults, and enqueue permissions.
order: 203510
---

# The Queue Builder

Use `serviceBuilder.getQueueBuilder(queueId, description)` to define the payload/parameter contract and lifecycle configuration for a queue.

## CLI scaffolding

```bash
purista add queue
```

The CLI asks for:

- queue name/description
- payload and parameter schema filenames
- whether to scaffold a producer command
- default lifecycle overrides (visibility timeout, retry budget, DLQ suffix)

It wires `.canEnqueue(...)` declarations into the generated command/subscription and registers the queue with the service.

## Example

```ts
export const pingJobQueueBuilder = pingV1ServiceBuilder
  .getQueueBuilder('pingJob', 'Process async ping requests')
  .addPayloadSchema(pingJobPayloadSchema)
  .addParameterSchema(pingJobParameterSchema)
  .setLifecycleConfig({
    visibilityTimeoutMs: 60_000,
    maxAttempts: 5,
    heartbeatIntervalMs: 15_000,
  })
```

### Lifecycle options

| option | description |
| --- | --- |
| `visibilityTimeoutMs` | Lease duration before the job becomes available again. |
| `heartbeatIntervalMs` | Recommended cadence for worker heartbeats (`context.job.extendLease`). |
| `maxAttempts` | Retry budget before moving to the DLQ. |
| `deadLetterQueueName` | Override the default `<queueId>.dead-letter`. |

## Grant enqueue access

Queues are only accessible from handlers that declare `.canEnqueue('queueId', payloadSchema, parameterSchema)`. This generates typed helpers (`context.queue.enqueue.queueId`) and enforces runtime checks.

```ts
export const pingAsyncCommandBuilder = pingV1ServiceBuilder
  .getCommandBuilder('pingAsync', 'Async ping endpoint')
  .addPayloadSchema(pingAsyncPayloadSchema)
  .addParameterSchema(pingAsyncParameterSchema)
  .canEnqueue('pingJob', pingJobPayloadSchema, pingJobParameterSchema)
  .setCommandFunction(async function (context, payload, parameter) {
    return context.queue.enqueue.pingJob(payload, parameter)
  })
```

## Schedule delayed jobs

`context.queue.scheduleAt.<queueId>(runAt, payload, parameter)` queues work at a specific timestamp (milliseconds or Date). Use this for cron-like tasks or retriable workflows.

```ts
await context.queue.scheduleAt.pingJob(Date.now() + 5 * 60_000, payload, parameter)
```

## Tips

- Reference schemas exported by the CLI to keep TypeScript inference in sync.
- Override lifecycle settings per queue when workloads differ (fast retries for email notifications vs. long leases for ML inference).
- Combine `.canInvoke` and `.canEnqueue` so commands can orchestrate both synchronous invocations and async jobs.

## Related docs

- [Queue worker builder](./the-queue-worker-builder.md)
- [Async HTTP exposure](./queue-http-exposure.md)
- [Enterprise long-running queues](../../6_integrations/enterprise_interoperability/long-running-queues.md)
- [Queue bridge overview](../../3_eco_system/queue_bridges/index.md)
