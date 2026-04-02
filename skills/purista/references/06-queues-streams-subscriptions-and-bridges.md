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

## Reliability rule
- subscriptions are for bounded reactive delivery, not for long-lived workflow retry loops
- queues are the production path for leases, retry budgets, delayed execution, dead-letter handling, and operator replay
- adapter capabilities must stay truthful; strict mode should fail fast when a requested guarantee is unavailable

## Defaults rule
- prefer safe defaults that give bounded retry, stable dead-letter naming, and predictable operator behavior
- keep broker-specific tuning optional and local to the adapter package
- remove dead knobs rather than documenting configuration that the runtime ignores

## Anti-patterns
- using streams for durable work
- using subscriptions for long-running retries without queue backing
- treating queue workers as unowned scripts instead of service-owned capabilities
- pretending a transport supports queue-grade semantics when it only provides best-effort push delivery
