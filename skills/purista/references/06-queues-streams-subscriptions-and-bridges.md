# Queues, Streams, Subscriptions, and Bridges

Use this reference when deciding synchronous vs asynchronous paths.

## Decision rules
- subscription: react to an event already emitted elsewhere
- stream: incremental client-facing or downstream-facing delivery
- queue: durable unit of work
- queue worker: code that executes queue work

## Durable workflow rule
If the work must survive restarts, retries, or external failures, use queue-backed execution. Do not fake durability with prompt state.

## Bridge rule
EventBridge and QueueBridge are runtime infrastructure. Service definitions stay neutral until the instance is created.

## Anti-patterns
- using streams for durable work
- using subscriptions for long-running retries without queue backing
- treating queue workers as unowned scripts instead of service-owned capabilities
