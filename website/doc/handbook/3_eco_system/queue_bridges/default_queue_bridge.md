---
title: Default Queue Bridge
description: In-memory queue bridge for local development and deterministic tests.
order: 301510
---

# Default Queue Bridge

`DefaultQueueBridge` ships with `@purista/core` and stores jobs in-memory inside each service instance.

## Capabilities

| feature | support |
| --- | --- |
| Durability | ❌ (restarts drop jobs) |
| Delayed delivery | ✅ (timer-based scheduling) |
| Dead-letter queue | ✅ (in-memory store) |
| Lease extension | ✅ |
| Lease expiry recovery | ✅ (requeue or DLQ inside the same process) |
| Lease inspection | ❌ |
| Idempotency enforcement | ❌ (keys are metadata only) |
| Metrics | ✅ (`context.queue.metrics.<queueId>`) |

## When to use

- Unit/integration tests without external dependencies.
- Local development or demos where determinism is more important than durability.
- Single-instance cron-like tasks.

## Configuration

No extra setup required—when you don’t pass a `queueBridge` to `serviceBuilder.getInstance`, the default bridge is injected automatically.

```ts
const service = await myServiceV1Service.getInstance(eventBridge, {
  logger,
  // queueBridge omitted -> defaults to in-memory bridge
})
```

## Tips

- Because jobs are in-memory, do not rely on this bridge in production or any environment with multiple instances.
- Expired leases are recovered when the queue is polled again, so worker crashes no longer strand jobs permanently inside the in-memory lease map.
- Long-running queues can extend leases, but a process restart drops pending and leased jobs.
- Strict idempotency is not available; use advisory idempotency plus idempotent handlers.
- Combine with Vitest to speed up queue-related tests (`DefaultQueueBridge` runs fully synchronously).
- Use Redis or another persistent bridge as soon as you need horizontal scaling or crash resilience.

## Related links

- [Redis queue bridge](./redis_queue_bridge.md)
- [Queues overview](../../2_building_business-logic/queue/index.md)
