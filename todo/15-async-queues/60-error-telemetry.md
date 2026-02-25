# Error Handling & Telemetry

## Error handling

- **Pre-enqueue validation failure**: builder throws `QueuePreprocessError`, caller receives typed command error (StatusCode 422) and nothing is persisted.
- **Enqueue transport failure**: runtime wraps provider error into `QueueBridgeUnavailableError` so caller can fallback or surface `503`.
- **Worker handler throw**: default policy is `retry` unless `.retryOnUnhandledError(false)` is set, in which case the job dead-letters immediately.
- **Visibility timeout hit**: runtime detects expired leases, logs with `warn` level, increments `queue.visibility_timeouts` metric, and requeues job with incremented attempt.
- **Max attempts exceeded**: runtime updates OpenTelemetry spans/metrics (`queue.dead_letter_total`) and, if the queue opted in, emits a custom event via EventBridge so downstream automation can react. When no event name is configured we rely purely on telemetry/metrics—no implicit events fire—aligning with the operator feedback that observability should remain inside OpenTelemetry unless teams explicitly need remediation workflows.
- **Poison batch detection**: if more than `N` consecutive jobs from the same queue fail with the same error code, runtime auto-pauses the worker (no new leases) and emits `QueueWorkerPaused` event. Requires manual resume via CLI/command.

## OpenTelemetry integration

| Operation       | Span name            | Attributes                                                                                       |
|-----------------|----------------------|--------------------------------------------------------------------------------------------------|
| Enqueue         | `queue.enqueue`      | `queue.name`, `queue.job_id`, `queue.delay_ms`, `queue.bridge`, `queue.dedup_key`                |
| Lease/Pull      | `queue.lease`        | `queue.name`, `queue.bridge`, `queue.batch_size`, `queue.wait_time_ms`                           |
| Process handler | `queue.process`      | `queue.name`, `queue.job_id`, `queue.attempt`, `queue.partition_key`, `queue.handler`, `retry`   |
| Ack/Nack        | `queue.ack` / `queue.nack` | `queue.name`, `queue.job_id`, `queue.outcome`, `queue.delay_ms`, `queue.dead_letter`        |

- Trace context from enqueue spans propagates via the envelope (traceId, spanId) and is restored before executing the worker handler.
- `context.wrapInSpan` remains available to queue handlers for nested operations.

## Metrics

Expose via existing service metrics endpoint:

- `purista_queue_depth{queue="name"}`: pending jobs.
- `purista_queue_inflight{queue="name"}`: number of leased jobs currently running on this instance.
- `purista_queue_dead_letter_total{queue="name"}`.
- `purista_queue_retry_total{queue="name"}` (labeled by reason/category).
- `purista_queue_visibility_timeout_total{queue="name"}`.
- `purista_queue_processing_duration_bucket{queue="name"}` histogram to monitor SLAs.

## Health & readiness

- `Service.isHealthy()` checks queue metrics: if dead-letter count spikes beyond configured threshold or visibility timeouts accumulate, health transitions to `warn` (logs) or `error` (fail readiness) depending on severity.
- QueueBridge exposes `isReady()` + `isHealthy()` similar to EventBridge; Service health aggregator folds new signals in.
- Provide optional self-healing: if backlog exceeds `maxLagThreshold`, runtime can scale worker concurrency up (bounded by config) or emit `QueueLag` events for orchestrators to react.
- Dead-letter events, when enabled, follow the default naming template `queue.<queueName>.deadLettered` and include `queueName`, `jobId`, `attempt`, and `reason`. Queue definitions and provider bridges can override this name to align with organizational standards. Providers without EventBridge hooks simply skip emission and rely entirely on metrics/logs.
