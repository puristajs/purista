---
order: 203500
title: Queues
description: Overview of PURISTA queues, workers, and async HTTP patterns.
---

# Queues

Queues complement commands, streams, and subscriptions when you need **pull-based workloads** (CQRS projections, AI agent pools, delayed jobs). A queue definition describes payload/parameter schemas, lifecycle defaults (visibility timeout, retries, heartbeats), and optional dead-letter routing. Workers lease jobs from a queue bridge, acknowledge progress, and emit telemetry just like commands.

## CLI-first workflow

```bash
purista add queue
purista add queue-worker
```

The CLI scaffolds queue definitions, workers, optional producer commands, schemas, and Vitest specs. Run `purista add queue` to define payload/contracts + lifecycle defaults, then `purista add queue-worker` each time you need a new worker profile (sequential, interval, or continuous).

## Architectural context

- Queue definitions live next to commands/streams/subscriptions on the service builder and participate in the same schema + guard system (`.canEnqueue` mirrors `.canInvoke`).
- Queue bridges are independent from event bridges. Mix RabbitMQ/MQTT/NATS/Dapr for push traffic with Redis queues (or the default in-memory bridge) for pull workloads.
- Security/access control reuse the same guards/hooks as commands; if your command requires scopes or tenant checks, the `.canEnqueue` declaration enforces them before a payload ever leaves the handler.
- Inject the queue bridge alongside the event bridge when you instantiate a service:

```ts
const eventBridge = new AmqpBridge({ /* ... */ })
const queueBridge = new RedisQueueBridge({ keyPrefix: 'acme:queue:' })

const service = await myServiceV1Service.getInstance(eventBridge, {
  queueBridge,
  logger,
})
await service.start()
```

Leave `queueBridge` undefined to fall back to the in-memory `DefaultQueueBridge`.

## Lifecycle defaults & safety

Each queue has a lifecycle state machine (`pending → inFlight → completed | failed | deadLetter`) with robust defaults:

- `visibilityTimeoutMs = 15m`, `heartbeatIntervalMs = 5m` (renew leases automatically, but override for long jobs).
- `maxAttempts = 10`, exponential backoff with jitter, and provider-specific DLQ naming (override per queue if needed).
- Workers call `context.job.complete`, `retry`, `extendLease`, or `moveToDeadLetter` so no job stays stuck even if a worker crashes.

Override any of these via `.setLifecycleConfig(...)` on the queue builder; defaults keep things safe for most deployments.

## Async HTTP endpoints

Commands exposed with `{ mode: 'async' }` enqueue work, return `202 Accepted`, and respond with `{ queueId, jobId, statusUrl }`. A separate status command (usually `GET /status/:jobId`) reads queue metrics so clients know when to retry or surface errors. Use `context.queue.scheduleAt.<queueId>()` for delayed starts (cron-style tasks). See [Async HTTP exposure](./queue-http-exposure.md) for end-to-end examples.

## Key topics

- [Queue builder](./the-queue-builder.md) – declare schemas, lifecycle overrides, `.canEnqueue`, and CLI scaffolding.
- [Queue worker builder](./the-queue-worker-builder.md) – configure worker modes (sequential/interval/continuous), heartbeats, and failure handling.
- [Async HTTP exposure](./queue-http-exposure.md) – return `202 Accepted`, implement status polling commands, and schedule delayed jobs.

## Quick facts

- Queue bridges are independent from event bridges, so you can pair RabbitMQ for events with Redis queues (or vice versa).
- Default behavior falls back to the in-memory `DefaultQueueBridge`; inject `@purista/redis-queue-bridge` (or future adapters) for production durability.
- `.canEnqueue('queueId', payloadSchema, parameterSchema)` generates typed helpers (`context.queue.enqueue.queueId`) for commands, streams, and subscriptions.
- Queue test helpers/mocks run on the default bridge for deterministic unit tests.

## When to use queues

- You need pull-based scaling (workers decide when to fetch jobs).
- Clients must receive a fast response while heavy work continues asynchronously (`202 Accepted` pattern).
- You implement CQRS write → async projection flows or AI agent pools that process one task at a time.

## Common pitfalls

- Skipping `.canEnqueue(...)` so enqueue attempts throw at runtime.
- Returning entire payloads instead of a compact `{ queueId, jobId, statusUrl }` document.
- Forgetting to configure dead-letter routing / retry budgets.
- Expecting queue bridges to reuse event bridge settings (they are independent resources).

## Checklist

- Queue payload/parameter schemas defined and validated.
- `.canEnqueue` declared for every producer (command/subscription/stream).
- At least one worker registered with the desired mode (sequential, interval, or continuous).
- Queue bridge (default vs Redis) chosen intentionally and injected where needed.
- Status endpoint implemented for async HTTP exposure.
- Tests cover enqueue + worker flow (use DefaultQueueBridge for deterministic unit tests).

## Related resources

- [Queue builder](./the-queue-builder.md)
- [Queue worker builder](./the-queue-worker-builder.md)
- [Async HTTP exposure](./queue-http-exposure.md)
- [Queue bridge overview](../../3_eco_system/queue_bridges/index.md)
- [Expose commands as HTTP endpoints](../command/exposing-a-command-as-http-endpoint.md)
- [Service builder reference](../service/the-service-builder.md)
