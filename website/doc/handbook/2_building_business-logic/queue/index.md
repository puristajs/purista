---
order: 200450
title: Async queues
description: Define pull-based queues and workers that reuse PURISTA's builder patterns.
---

# Async queues

Queues complement commands, streams, and subscriptions when you need pull-based workloads (for example CQRS write models, ML agents, or expensive background tasks). A queue definition describes the payload/parameter schema, lifecycle defaults (visibility timeout, retries, heartbeats), and optional dead-letter routing. Queue workers pull jobs via a queue bridge, acknowledge progress, and emit telemetry just like commands.

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

## Guarding enqueue access

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

## Provider bridges

`@purista/core` ships with an in-memory `DefaultQueueBridge` for local dev/tests. Production deployments should wire a provider-specific bridge (for example `@purista/redis-queue-bridge`) using the same interface (enqueue, leaseNext, ack, nack, moveToDeadLetter, metrics). Bridges advertise their capabilities so builders can warn when a lifecycle feature (delay, FIFO, leases) is unsupported.
