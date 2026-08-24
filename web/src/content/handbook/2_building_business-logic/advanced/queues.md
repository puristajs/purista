---
title: Queue internals & delivery tuning
description: Dive into lifecycle configuration, leases, retries, and DLQ observability for PURISTA queues.
order: 299920
---

# Queue internals & delivery tuning

The default queue builder hides most operational knobs, but production workloads often need precise control over leases, retries, and monitoring. This chapter explains how to tune those settings and what the runtime does under the hood.

## Event bridge subscriptions vs. queue workers

PURISTA offers two distinct delivery models. Choosing the right one depends on your workload.

| | Event bridge subscription | Queue worker |
|---|---|---|
| **Delivery model** | Push — broker pushes messages to the handler | Pull — worker claims and leases a job |
| **Concurrency** | Controlled by broker prefetch | Controlled by worker pool size |
| **Backpressure** | Limited; broker may overwhelm slow consumers | Built-in via visibility timeout and lease model |
| **Retry granularity** | Broker-level (nack → requeue) | Fine-grained per-job lifecycle API |
| **Dead-letter handling** | Broker DLX / DLQ (bridge-dependent) | First-class `QueueBridge` DLQ APIs |
| **When to use** | Event fan-out, notifications, real-time reactions | Long-running jobs, rate-limited work, human-review flows |

## Available queue bridges

| Bridge | Package | Use case |
|---|---|---|
| `DefaultQueueBridge` | `@purista/core` | In-memory, local development and testing only — no persistence |
| `RedisQueueBridge` | `@purista/redis-queue-bridge` | Production workloads on Redis infrastructure |
| `NatsQueueBridge` | `@purista/nats-queue-bridge` | Production workloads on NATS infrastructure |

::: warning
`DefaultQueueBridge` stores jobs in process memory. All jobs are lost on process exit. Use `RedisQueueBridge` or `NatsQueueBridge` in production.
:::

## Lifecycle configuration

Every queue definition can override the lifecycle defaults defined in `defaultQueueLifecycleConfig`:

| setting | default | impact |
| --- | ---: | --- |
| `visibilityTimeoutMs` | 15 minutes | How long a leased job stays invisible before it is re-queued. Increase for long-running jobs, decrease for quick bursts. |
| `maxLeaseExtensions` | 3 | Upper bound for `context.job.extendLease(ms)` before the runtime considers the job stuck. |
| `heartbeatIntervalMs` | 5 minutes | How often the worker auto-extends leases when `autoHeartbeat` is true. Disable auto heartbeats for jobs that manage leases manually. |
| `retryWindowMs` | 24 hours | Rolling time window for retries. After the window elapses, the runtime stops retrying and dead-letters the job. |
| `maxAttempts` | 10 | Number of `nack` retries before a job is moved to the DLQ. You can also override per enqueue call. |
| `retryStrategy` | `{ initialDelayMs: 1s, maxDelayMs: 120s, multiplier: 2, jitterFactor: 0.25 }` | Controls the delay that `context.job.retry()` applies when you do not specify a custom `delayMs`. |

These values are applied when you call `.setLifecycleConfig(...)` on the queue builder. The CLI prompts for overrides so you can document changes as part of the scaffolded codebase.

## Job context helpers

Inside a worker handler (`setHandler(async function (context, job) { ... })`), where `job.payload` holds the typed message payload, the following helpers exist:

- `context.job.complete(output?, headers?)`: acknowledge the lease, optionally returning an output value and response headers available to HTTP status endpoints.
- `context.job.retry({ delayMs?, reason? })`: negative acknowledge / requeue with optional delay. Retries count toward `maxAttempts`.
- `context.job.fail(reason, fatal?)`: mark the job as failed. Fatal failures go straight to the DLQ; non-fatal failures follow the retry policy.
- `context.job.extendLease(durationMs)`: extend the visibility timeout proactively when a job is known to take longer.
- `context.job.moveToDeadLetter(reason?)`: skip retries entirely and send the job to the DLQ (useful for poison-pill scenarios).
- `context.job.cancelRequested`: boolean flag that becomes `true` when an operator requests cancellation. Check this in long-running loops to exit early and call `context.job.fail('cancelled')` or `context.job.moveToDeadLetter('cancelled')` as appropriate.

Each method emits OpenTelemetry spans/tags so you can observe queue health in tracing tools.

## Dead-letter queues & observability

Queue bridges expose `metrics(queueName)` and, when supported, operator-grade DLQ APIs:

- `pending`, `inflight`, `deadLetter`, `retries`, `oldestAgeMs` help you decide when to scale workers or investigate stuck jobs.
- When `deadLetterInspectSupported` is true, use `peekDeadLetter(queueName, options?)` to list DLQ entries.
- When `deadLetterReplaySupported` is true, use `redriveDeadLetter(queueName, options?)` to replay a bounded set of DLQ entries.
- When `deadLetterPurgeSupported` is true, use `purgeDeadLetter(queueName)` to clear operator-confirmed poison messages.
- Emit custom events or alerts in your worker when `context.job.retry()` hits `maxAttempts` so SREs see DLQ growth before SLAs are impacted.

For runtime operators:

- pause workers explicitly with `service.pauseQueueWorkers(queueName, reason?)`
- inspect paused workers with `service.getQueueWorkerPauseState()`
- resume workers with `service.resumeQueueWorkers(queueName)`

## DLQ operator workflow

Use DLQs as operator inboxes, not silent sinks:

1. inspect entries with `peekDeadLetter(queueName, { limit })`
2. identify poison messages by `x-purista-dead-letter-reason` and application-specific headers
3. replay only the entries that are now safe via `redriveDeadLetter(queueName, { limit })`
4. purge confirmed poison batches with `purgeDeadLetter(queueName)` once the incident is closed

If you need long-lived replay tooling, workflow-specific remediation, or human approval, prefer queue-backed workloads over subscription retries.

## Health model integration

Queue pause state is now reflected in service health:

- paused queues appear under `ServiceHealthState.pausedQueueWorkers`
- paused subscription consumers appear under `ServiceHealthState.pausedSubscriptionConsumers`
- service health is `warn` while paused entries exist

## Safe defaults

- New queues default to `prefetch: 1` and FIFO-style processing.
- The runtime validates queue bridge capabilities on startup when the selected bridge advertises `strictStartupValidation`.
- If you do not specify a custom queue bridge, the in-memory `DefaultQueueBridge` is suitable for local development and tests only.
- Production-safe choices today are `RedisQueueBridge` and `NatsQueueBridge`; pick based on the platform your operators already run.

## Delivery semantics

Queues are **at-least-once by design**: if a worker crashes before calling `complete`, the job is re-queued. Make handlers idempotent (use idempotency keys, versioned state, or side-effect guards) to avoid duplicated work when retries happen. Combine queue lifecycles with the event bridge semantics documented in [Delivery semantics and reliability](./delivery-semantics-and-reliability.md) for a full end-to-end picture.

For Redis specifically, PURISTA uses a `pending` list, a `processing` list, and a `scheduled` sorted set. The bridge now applies atomic recovery scripts for delayed release, lease expiry, nack/requeue, and DLQ redrive, and it recovers orphaned `processing` entries when a worker crashes between claim and lease metadata registration.

For the enterprise event-to-queue storyline, see [Enterprise interoperability](/handbook/6_integrations/enterprise_interoperability/).
