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

Common queue bridge packages:
- `@purista/nats-queue-bridge`
- `@purista/redis-queue-bridge`

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
- Use streams for incremental delivery, not durability.
- Let adapter capability validation fail fast when strict guarantees are unavailable.

## Anti-Patterns
- hiding broker clients in handlers
- using subscriptions as queue workers
- using streams as retry state
- coupling service design to one route tree before the domain boundary is clear
