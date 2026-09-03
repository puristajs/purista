---
title: Configure leases, retries, idempotency, and dead letters
description: Set a bounded recovery policy, choose a bridge that can meet it, and make business effects safe under repeated delivery.
order: 356
---

Queues are an at-least-once recovery mechanism unless the selected bridge and
workload prove something stronger. A job can run again after a crash, lease
expiry, retry, or redrive. Build idempotency around the durable business
operation, then use lifecycle configuration to bound recovery.

```ts title="src/service/report/v1/queue/generateReport.ts"
export const durableGenerateReportQueueBuilder = generateReportQueueBuilder
  .setLifecycleConfig({
    visibilityTimeoutMs: 120_000,
    maxAttempts: 5,
    retryWindowMs: 3_600_000,
    poisonMessageFailureThreshold: 3,
    poisonMessageAction: 'pause-worker',
  })
  .setDeadLetterOptions({ queueName: 'report.dead-letter' })
  .setQueueBridgeConfig({ prefetch: 1, orderingGuarantee: 'fifo' })
```

| Builder method | Parameters / default | Runtime effect and decision |
| --- | --- | --- |
| [`setLifecycleConfig(partial)`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#setlifecycleconfig) | Any subset of the lifecycle fields below. Omitted fields are copied from the Framework lifecycle defaults. | Replaces the prior lifecycle configuration with that merged value. Use it for a reviewed queue policy, not a per-job exception. |
| [`setExecutionProfile('longRunning', { maxRuntimeMs, strict? })`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#setexecutionprofile) | `maxRuntimeMs` is required; `strict` is optional. | Applies the built-in long-running policy and its cooperative cancellation/lease intent. Apply it before `setLifecycleConfig(...)` when a particular field needs an intentional override. |
| [`setDeadLetterOptions({ queueName? })`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#setdeadletteroptions) | Optional target queue name. | Requests that the bridge dead-letter failures there. With no name, the runtime derives a name from bridge conventions; this method does not create a queue or prove the provider supports dead letters. |
| [`setQueueBridgeConfig({ prefetch?, orderingGuarantee? })`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#setqueuebridgeconfig) | Merges into `prefetch: 1`, `orderingGuarantee: 'fifo'`. | Declares delivery requirements for bridge capability validation. It is not an implementation of concurrency, ordering, or priority. |

## Start from the actual defaults

| Lifecycle field | Default |
| --- | --- |
| visibility timeout / max lease extensions | 15 minutes / 3 |
| heartbeat / automatic heartbeat | 5 minutes / enabled |
| maximum attempts / retry window | 10 / 24 hours |
| retry strategy | exponential, 1 second to 2 minutes, multiplier 2, jitter 0.25 |
| poison-message threshold / action | 0 / `none` |

[`setLifecycleConfig(...)`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#setlifecycleconfig) merges the supplied fields with these defaults and
does not locally validate ranges. Use `setExecutionProfile('longRunning', {
maxRuntimeMs })` for cooperative long work: it applies a five-minute lease,
one-minute heartbeat, three attempts, 24-hour retry window, derived lease
extensions, and aborts the handler signal when a heartbeat lease extension
fails. It also requests cancellation when `maxRuntimeMs` elapses. `strict` is
recorded in the definition, but current generic startup validation does not
validate this profile's lease requirements; verify the selected bridge with an
integration test. Call the profile first and `setLifecycleConfig(...)`
afterwards only when intentionally overriding it.

## Separate framework requests from bridge guarantees

[`setQueueBridgeConfig({ prefetch, orderingGuarantee })`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#setqueuebridgeconfig) defaults to prefetch
`1` and FIFO. Every currently shipped QueueBridge advertises
`maxBatchSize: 1`; `prefetch > 1` therefore fails service startup with
`UnhandledError(501, 'queue "<name>" requests prefetch <n>, but <bridge>
supports at most 1')`.

When the bridge enables strict startup validation, core rejects three cases:
unsupported FIFO, prefetch beyond the bridge maximum, and a service-level
event-to-queue binding that requests strict idempotency from a bridge that
cannot enforce it. These checks do not prove partitioning, priority, delayed
delivery, dead-letter operations, or every long-running profile requirement.

| Failure class | Worker choice | Design requirement |
| --- | --- | --- |
| Transient dependency outage | throw or return retry | Stable external/business idempotency key and bounded policy. |
| Invalid or impossible work | fatal fail or direct dead-letter | Repair path, alert, and safe operator access. |
| Repeated same-reason poison job | threshold + `pause-worker` | Resume/repair process; the pause is local worker state, not a provider circuit breaker. |
| Long-running work | long-running profile + cooperative signal | Verify lease/heartbeat/shutdown behaviour with the selected bridge. |

The runtime derives a dead-letter name from bridge prefix/suffix when no target
is set. Actual retention, inspection, redrive, and purge are QueueBridge
operations. Verify them—and delayed delivery, idempotent enqueue, ordering, and
lease recovery—through the selected provider guide and integration tests.

`pause-worker` activates only when all three conditions hold: the configured
threshold is positive, the current attempt reaches it, and the message header
`x-purista-last-retry-reason` equals the current failure reason. The selected
bridge must preserve that retry header. Inspect local pause state with
`service.getQueueWorkerPauseState()`, pause deliberately with
`service.pauseQueueWorkers(queueName, reason)`, and resume only after repair
with `service.resumeQueueWorkers(queueName)`. A paused queue remains paused for
that service process until resumed.

For the full contract, see [QueueDefinitionBuilder](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/) and [QueueBridge](/handbook/api/interfaces/_purista_core.QueueBridge/).
