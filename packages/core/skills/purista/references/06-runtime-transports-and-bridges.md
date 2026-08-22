# Runtime Transports And Bridges

Use this reference when wiring delivery, HTTP, streams, queues, or brokers.

## EventBridge
EventBridge handles commands, events, subscriptions, and streams. It is not a durable work queue unless an adapter explicitly implements queue semantics elsewhere.

Common event bridge packages:
- `@purista/amqpbridge`
- `@purista/mqttbridge`
- `@purista/natsbridge`
- `@purista/dapr-sdk`

## QueueBridge
QueueBridge handles durable background work:
- enqueue
- lease
- ack/nack
- delayed execution
- retry policy
- dead-letter handling
- strict idempotency where the adapter advertises it

Common queue bridge packages:
- `@purista/nats-queue-bridge`
- `@purista/redis-queue-bridge`

Redis and NATS queue bridges enforce strict idempotency. Duplicate enqueue with the same queue and `idempotencyKey` returns the original enqueue result/job id. Missing keys still create independent jobs. `DefaultQueueBridge` remains advisory and reports `idempotencyEnforcement: false`.

## Schedulers
`@purista/core` provides a trigger-only Scheduler Runtime. Host it in a separate process with `SchedulerBuilder`, an EventBridge, and a SchedulerProvider; do not instantiate business services in that process. The Core runtime accepts five-field event schedules only, attaches `message.schedule.occurrenceId`, and has at-least-once delivery. `DefaultSchedulerProvider` is local/test only. A replicated host uses `@purista/redis-scheduler-provider` plus `.setStrict().setRequireDistributedClaims()`; it protects occurrence claims, while the configured EventBridge remains responsible for real transport delivery. `getRuntimeStatus()` is JSON-safe operator evidence for registration, last attempted/published occurrence, lag, pause state, and declared provider capabilities; it is not a live provider-health, ownership, or exactly-once claim. Kubernetes CronJob export remains available for an explicit external trigger container/script. Do not target subscriptions directly.

Generated projects provide `src/definitions.ts`, `export:definitions`, `export:schedules`, and a `start:scheduler` local host. The host reads `purista.schedules.json`, never imports a business service, and uses `DefaultSchedulerProvider`; it is useful only for local/test execution. A process-local `DefaultEventBridge` cannot carry those events to a separate application process. For production, generate the manifest during build/deployment, then configure the isolated host with a shared EventBridge plus an explicit durable distributed provider. Do not generate provider credentials, Redis prefixes, broker URLs, or authorization policy from framework defaults.

## HTTP
Use `@purista/hono-http-server` for current HTTP server work. It exposes builder-declared commands and streams and generates OpenAPI metadata.

Streams can be delivered as:
- SSE `text/event-stream`
- aggregate JSON, when configured as aggregate

AI stream endpoints use provider-style SSE chunks described by
`agentSseEventSchema`. Opted-in model stream deltas include `stream_id` for
chunk aggregation and `agent_id` / `workflow_id` / `model_alias` for source
attribution; client-facing labels remain application-owned.

## Runtime Wiring
Runtime infrastructure belongs in `getInstance(...)`, not in builder definitions:

```ts
await service.getInstance(eventBridge, {
  queueBridge,
  config,
  resources,
  logger,
  stateStore,
})
```

## Reliability Rules
- Use queues for long-running or retry-heavy work.
- Use subscriptions for bounded reactions.
- Use schedules to publish time-trigger events from a separate scheduler host; subscriptions and queues run the work.
- Use streams for incremental delivery, not durability.
- Let adapter capability validation fail fast when strict guarantees are unavailable.

## Anti-Patterns
- hiding broker clients in handlers
- using subscriptions as queue workers
- using streams as retry state
- coupling service design to one route tree before the domain boundary is clear
