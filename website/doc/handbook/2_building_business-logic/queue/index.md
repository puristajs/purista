---
order: 203500
title: Queues
description: Define pull-based queues and workers, wire them via the CLI, and expose async HTTP endpoints.
---

# Queues

Queues complement commands, streams, and subscriptions when you need **pull-based workloads** (CQRS write models, AI agent pools, delayed jobs, or any task where consumers decide when to fetch the next unit of work). A queue definition describes payload/parameter schemas, lifecycle defaults (visibility timeout, retries, heartbeats), and optional dead-letter routing. Workers lease jobs from a queue bridge, acknowledge progress, and emit telemetry just like commands.

> 💡 **Start with the CLI:**  
> Use `purista add queue` to scaffold a queue definition, worker, and an optional producer command. The wizard wires schemas, `.canEnqueue(...)` guards, tests, and service registration so you can focus on business logic instead of boilerplate. Run `purista add queue-worker` whenever you want to add additional worker variants (interval vs sequential, different concurrency, etc.).

## Declaring queues

Use the service builder to create queue definitions. They behave like other builders: schemas drive TS types, tags, and OpenAPI metadata, while guard hooks run before persisting payloads.

```ts
const pingJobQueueBuilder = pingV1ServiceBuilder
  .getQueueBuilder('pingJob', 'Processes async ping requests')
  .addPayloadSchema(pingV1PingJobQueuePayloadSchema)
  .addParameterSchema(pingV1PingJobQueueParameterSchema)
  .setLifecycleConfig({ visibilityTimeoutMs: 60_000 })
```

Register the queue in your service (or let the CLI do it via `purista add queue`). The default queue bridge is in-memory for local development, and you can inject another bridge (for example Redis) via `ServiceBuilder.defineResource('queueBridge', ...)`.

## Architecture fit & CQRS relation

Queues sit **between synchronous commands and subscription-driven pushes**:

- Commands emit jobs into a queue when the client should receive a fast `202 Accepted` response, or when the remaining work is CPU/IO heavy.
- Streams/subscriptions remain push-based and react to events immediately.
- Queues enable **pull semantics** so workers scale horizontally and each consumer can choose when to take the next job (classic CQRS “write → async projection” flow).

This makes queues a natural fit for:

- HTTP endpoints that must respond quickly but kick off longer-running batches (document processing, AI orchestration, billing retries).
- Fan-out job pools where you want to limit concurrency per tenant/worker.
- Workflows where a failure should delay retries without blocking traffic (dead-letter queues, exponential backoff).

The queue bridge sits inside the service runtime next to the event bridge. Commands/subscriptions get a `context.queue` helper (see below), while queue workers are registered inside the same service builder. In other words, queues reuse the same service boundaries, tracing, security context, and resource injection you already use for synchronous handlers.

## Guarding enqueue access & HTTP exposure

Commands, subscriptions, and streams declare `.canEnqueue('queueName', payloadSchema, parameterSchema)` just like `.canInvoke`. The declaration enables typed helpers (`context.queue.enqueue.pingJob`) and enforces runtime security: attempts to enqueue an undeclared queue throw `UnhandledError`.

```ts
export const pingAsyncCommandBuilder = pingV1ServiceBuilder
  .getCommandBuilder('pingAsync', 'Async ping endpoint')
  .addPayloadSchema(pingAsyncPayloadSchema)
  .addParameterSchema(pingAsyncParameterSchema)
  .canEnqueue('pingJob', pingV1PingJobQueuePayloadSchema, pingV1PingJobQueueParameterSchema)
  .exposeAsHttpEndpoint('POST', 'ping/async', undefined, undefined, undefined, undefined, { mode: 'async' })
  .setCommandFunction(async function (context, payload, parameter) {
    const job = await context.queue.enqueue.pingJob(payload, parameter)
    return { jobId: job.jobId, queueName: job.queueName, statusUrl: `/api/v1/ping/status/${job.jobId}` }
  })
```

The HTTP adapter uses `mode: 'async'` to return `202 Accepted` plus a polling document (`jobId`, `queueId`, `statusUrl`). Follow-up status handlers respond with `200` (completed), `202` (still processing), `303` (external redirect), `410` (expired), or `500` (failed) depending on the queue lifecycle state.

When exposing async endpoints:

- Return a lightweight envelope `{ queueId, jobId, statusUrl }`.
- Implement a status command/endpoint that reads queue metrics/job state so polling clients know when to retry or surface errors.
- Prefer `context.queue.scheduleAt(queueName, runAt, payload)` when you need delayed start times (cron-style tasks).

## Workers and leases

Queue workers are defined via `.getQueueWorkerBuilder(queueName, description)` and support three modes:

- `continuous`: keep polling with a short backoff
- `interval`: run every N milliseconds
- `sequential`: fetch the next job only after the previous handler finished

```ts
export const pingJobWorkerQueueWorkerBuilder = pingV1ServiceBuilder
  .getQueueWorkerBuilder('pingJob', 'Ping job worker')
  .setMode('sequential')
  .setHandler(async function (context, job) {
    context.logger.info({ jobId: job.id }, 'processing async ping')
    await context.job.complete()
  })
```

Handlers receive the queue context (`context.job`) with helpers to `complete`, `extendLease`, `retry`, or `moveToDeadLetter`. If a worker crashes or misses its heartbeat, the queue bridge automatically re-queues the job after the visibility timeout. Dead-letter queue names default to `<queueId>.dead-letter` but can be overridden per queue or provider.

## Provider bridges & ecosystem

- `@purista/core` ships with the in-memory `DefaultQueueBridge`. It’s deterministic and perfect for unit tests/local dev.
- `@purista/redis-queue-bridge` implements the queue bridge contract on top of Redis lists/BLPOP and supports retries, visibility extensions, DLQs, and metrics.
- Future bridge packages will live under `packages/<provider>-queue-bridge` and follow the same contract (`enqueue`, `leaseNext`, `ack`, `nack`, `moveToDeadLetter`, `metrics`).

Each bridge advertises its capabilities (delayed delivery, FIFO, native DLQ, etc.). Builders surface warnings when you try to use a lifecycle feature that the selected bridge cannot provide—no hidden emulation.

See [Event Bridges](../../3_eco_system/eventbridges/index.md#queue-bridge-support) for the up-to-date matrix of queue bridge packages and how they align with existing event bridges.

## Injecting queue bridges independently

Queue bridges are independent from event bridges. This lets you deploy, for example, RabbitMQ for synchronous messaging while delegating pull-based workloads to Redis:

```ts
import { AmqpBridge } from '@purista/amqpbridge'
import { RedisQueueBridge } from '@purista/redis-queue-bridge'
import { myServiceV1Service } from './my-service'

const eventBridge = new AmqpBridge({ /* ... */ })
const queueBridge = new RedisQueueBridge({ /* ... */ })

const service = await myServiceV1Service.getInstance(eventBridge, {
  logger,
  queueBridge,
})
await service.start()
```

If you omit `queueBridge`, the service falls back to the in-memory default bridge so tests and local dev work without extra infrastructure. Because the abstractions are orthogonal, you can combine any event bridge with any queue bridge as long as both share the same service runtime.
