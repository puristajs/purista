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
Schedules are exported contracts. PURISTA does not run production cron. Kubernetes CronJob export generates `batch/v1` manifests for cron schedules and requires an explicit trigger container/script. The trigger calls a PURISTA event, queue, or short command boundary. Do not target subscriptions directly.

## HTTP
Use `@purista/hono-http-server` for current HTTP server work. It exposes builder-declared commands and streams and generates OpenAPI metadata.

Streams can be delivered as:
- SSE `text/event-stream`
- aggregate JSON, when configured as aggregate

AI stream endpoints use provider-style SSE chunks described by `agentSseEventSchema`.

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
- Use schedules to describe external time triggers, not to run work in-process.
- Use streams for incremental delivery, not durability.
- Let adapter capability validation fail fast when strict guarantees are unavailable.

## Anti-Patterns
- hiding broker clients in handlers
- using subscriptions as queue workers
- using streams as retry state
- coupling service design to one route tree before the domain boundary is clear
