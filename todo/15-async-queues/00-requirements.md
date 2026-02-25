# Async Queue Requirements

## Product requirements

- Enable durable, asynchronous command handling so CQRS write models can accept work even when the consumer is offline or busy.
- Support user-configurable workers (pull-based and loop-based) so services decide how aggressively to drain queues.
- Provide first-class abstractions for enqueueing from commands, subscriptions, streams, or HTTP bridges without touching vendor SDKs.
- Allow lightweight preprocessing/validation/transformation before a job is persisted so incompatible payloads never enter a queue.
- Preserve Purista guarantees (schema-derived types, builders, OpenAPI exposure, hooks) for queue definitions and workers.
- Ship a queue lifecycle state machine with resilient defaults (visibility timeout, retries, dead-letter routing) that builders can optionally override without reimplementing the contract.
- Surface queue state (pending, inflight, dead-letter) to services so they can expose diagnostics via commands or HTTP APIs.
- Support sequential, pull-based worker pools (e.g., fleets of AI agents) so each worker can claim one job at a time and avoid push-based overload.

## Technical requirements

- Provide a default in-memory `QueueBridge` so services can develop and test without external dependencies, mirroring `DefaultEventBridge`.
- Define a queue message envelope with trace/correlation IDs, retry counters, lease/visibility timestamps, payload, parameters, and custom headers.
- Provide a `QueueBridge` abstraction similar to `EventBridge` that can target Redis core lists, NATS JetStream, AWS SQS/FIFO, Azure Storage Queues, and other providers that expose pull + lease semantics; explicitly skip push-only transports such as RabbitMQ/AMQP exchanges.
- QueueBridge lifecycle mirrors EventBridge wiring: independent `{ queueBridge }` injection on `serviceBuilder.getInstance`, matching `start/destroy/isHealthy` semantics, so developers can mix transports (e.g., AMQP EventBridge + Redis QueueBridge) without coupling the packages.
- Support manual lease acknowledgement so long-running jobs do not disappear yet can be reclaimed on failure/timeouts.
- Allow extendable retry strategies (exponential backoff, fixed interval, custom function) and dead-letter routing.
- Provide transformation hooks both before enqueue (mutate payload/params) and before execute (normalize again) with schema validation toggles.
- Support job-level idempotency keys plus optional dedup windows for providers that can enforce it.
- Workers must be able to run in three modes: `continuous` (pull immediately), `interval` (fixed cadence), and `sequential` (start next when previous finishes).
- Ensure concurrency controls per worker (max parallel inflight jobs, per-partition ordering, FIFO when required).
- Provide health indicators for queues (lag, retry spike, stuck lease count) and feed them into the Service health endpoint.
- Integrate with OpenTelemetry (enqueue span, dequeue span, processing span) and propagate context via the queue envelope.
- HTTP async exposure must follow a standard contract: enqueue routes return `202 Accepted` with a job handle plus canonical error codes (`400/422`, `401/403`, `429`, `500`, `503`), and optional `Location` header for polling status endpoints.
- Commands, subscriptions, and streams gain `.canEnqueue()` declarations so context helpers can enforce runtime guards, emit telemetry, and provide typed DX; associated test helpers must expose queue stubs for verification.
- Queue bridges only target providers that natively satisfy pull-based consumption, leases/visibility, and durable ack semantics—no emulation layers for push-only transports or delayed delivery hacks.
- Dead-letter behavior must support per-queue/per-provider naming defaults while remaining configurable so deployments can align with existing operations conventions.
- Security/access control mirrors commands: builders wire `.canEnqueue`/`.authorize` hooks, contexts receive auth info, and queue workers respect scopes/tenants before processing.

## Reliability requirements

- At-least-once delivery by default with the option to configure effectively-once when provider supports deduplication + idempotent handlers.
- Automatic lease renewal/heartbeat to keep work assigned during long operations, plus auto-requeue if heartbeat is missed.
- Dead-letter queues must retain original payload + failure metadata for inspection/replay.
- Contract should specify what happens when preprocessing fails (reject job before persistence and return typed error to caller).
- Provide guardrails for poison messages (max attempts, circuit breaker on repeated failures, manual pause/resume per worker).
- Bridge packages must expose configurable dead-letter names/targets with sensible defaults and integrate with EventBridge only when teams opt into emitting remediation events; otherwise observability relies on OpenTelemetry spans/metrics rather than synthetic DL events.

## Developer experience requirements

- Builders must infer types from schemas and expose typed `context.queue.enqueue('MyQueue', payload, options)` helpers.
- CLI should be able to scaffold queue definitions and workers, similar to commands/subscriptions.
- Provide a minimal in-memory queue bridge for local testing and `vitest` usage.
- Deliver handbook/docs updates describing when to prefer commands, queues, streams, or subscriptions.
- Maintain backward compatibility: existing services without queues continue to compile/run unchanged.
- `purista add queue` and `purista add queue-worker` commands must prompt for queue name, worker mode, optional producer scaffolding, and generate files wired into `ServiceBuilder`.
- Test helpers (command/subscription/stream contexts) must surface queue mocks so unit tests can assert enqueue behavior without touching providers; integration harnesses must include default queue bridge wiring for e2e coverage.
