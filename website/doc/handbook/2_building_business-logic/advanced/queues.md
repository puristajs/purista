---
title: Queue internals & delivery tuning
description: Dive into lifecycle configuration, leases, retries, and DLQ observability for PURISTA queues.
order: 299920
---

# Queue internals & delivery tuning

The default queue builder hides most operational knobs, but production workloads often need precise control over leases, retries, and monitoring. This chapter explains how to tune those settings and what the runtime does under the hood.

## Lifecycle configuration

Every queue definition can override the lifecycle defaults defined in `defaultQueueLifecycleConfig`:

| setting | default | impact |
| --- | ---: | --- |
| `visibilityTimeoutMs` | 15 minutes | How long a leased job stays invisible before it is re-queued. Increase for long-running jobs, decrease for quick bursts. |
| `maxLeaseExtensions` | 3 | Upper bound for `context.job.extendLease(ms)` before the runtime considers the job stuck. |
| `heartbeatIntervalMs` | 5 minutes | How often the worker auto-extends leases when `autoHeartbeat` is true. Disable auto heartbeats for jobs that manage leases manually. |
| `retryWindowMs` | 24 hours | Rolling time window for exponential backoff. After the window elapses, the retry strategy restarts with the initial delay. |
| `maxAttempts` | 10 | Number of `nack` retries before a job is moved to the DLQ. You can also override per enqueue call. |
| `retryStrategy` | `{ initialDelayMs: 1s, maxDelayMs: 120s, multiplier: 2, jitterFactor: 0.25 }` | Controls the delay that `context.job.retry()` applies when you do not specify a custom `delayMs`. |

These values are applied when you call `.setLifecycleConfig(...)` on the queue builder. The CLI prompts for overrides so you can document changes as part of the scaffolded codebase.

## Job context helpers

Inside a worker handler (`setHandler(async function (context, message) { ... })`), the following helpers exist:

- `context.job.complete(payload?)`: acknowledge the lease, optionally returning a payload that can be used by HTTP status endpoints.
- `context.job.retry({ delayMs?, reason? })`: negative acknowledge / requeue with optional delay. Retries count toward `maxAttempts`.
- `context.job.extendLease(ms)`: extend the visibility timeout proactively when a job is known to take longer.
- `context.job.moveToDeadLetter(reason?)`: skip retries entirely and send the job to the DLQ (useful for poison-pill scenarios).

Each method emits OpenTelemetry spans/tags so you can observe queue health in tracing tools.

## Dead-letter queues & observability

Queue bridges expose `metrics(queueName)` and, when supported, `deadLetterInspectable`:

- `pending`, `inflight`, `deadLetter`, `retries`, `oldestAgeMs` help you decide when to scale workers or investigate stuck jobs.
- When `deadLetterInspectable` is true (Default and Redis bridges support it), DLQ contents can be listed or re-processed via bridge-specific tooling.
- Emit custom events or alerts in your worker when `context.job.retry()` hits `maxAttempts` so SREs see DLQ growth before SLAs are impacted.

## Delivery semantics

Queues are **at-least-once by design**: if a worker crashes before calling `complete`, the job is re-queued. Make handlers idempotent (use idempotency keys, versioned state, or side-effect guards) to avoid duplicated work when retries happen. Combine queue lifecycles with the event bridge semantics documented in [Delivery semantics and reliability](./delivery-semantics-and-reliability.md) for a full end-to-end picture.
