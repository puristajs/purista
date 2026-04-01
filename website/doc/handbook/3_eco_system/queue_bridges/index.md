---
title: Queue Bridges
description: Choose the right PURISTA queue bridge for pull-based workloads.
order: 301500
---

# Queue Bridges

Queue bridges provide the persistence, leasing, and dead-letter mechanics for pull-based workloads. They are independent from event bridges, so you can mix RabbitMQ/MQTT/NATS for push traffic with any queue backend you prefer.

## Support matrix

| bridge | durability | delayed delivery | DLQ | lease expiry recovery | recommended use cases |
| --- | --- | --- | --- | --- |
| [DefaultQueueBridge](./default_queue_bridge.md) | in-memory per service instance | yes (timer based) | yes (in-memory) | yes, within the current process | unit tests, local dev, single-instance cron-like jobs |
| [RedisQueueBridge](./redis_queue_bridge.md) | Redis persistence | yes (sorted set scheduling) | yes (separate Redis keys) | yes, atomic claim + requeue | production CQRS, AI job pools, delayed processing |

Future adapters will live in `packages/<provider>-queue-bridge` once that provider offers reliable pull + lease semantics (e.g., SQS, JetStream, Azure Storage Queues).

## Selection checklist

- **Durability:** Do you need jobs to survive restarts? Pick Redis or another persistent backend.
- **Visibility / leases:** Ensure the bridge exposes `leaseTtlMs` and `extendLease` support for long-running work.
- **Delayed delivery:** If your workflow requires scheduled jobs, verify the bridge has native delay or sorted-set scheduling.
- **Lease recovery:** Confirm expired leases are requeued or dead-lettered deterministically.
- **Operations:** Consider monitoring (metrics, DLQ inspection APIs) and whether your ops team already runs the backing service.

## Wiring queue bridges

```ts
const eventBridge = new AmqpBridge({ /* ... */ })
const queueBridge = new RedisQueueBridge({ keyPrefix: 'acme:queue:' })

const service = await myServiceV1Service.getInstance(eventBridge, {
  queueBridge,
  logger,
})
await service.start()
```

- Omit `queueBridge` to fall back to the default in-memory bridge.
- Share one queue bridge instance among services that should consume the same queues.
- Configure lifecycle defaults per queue; bridge-level options cover client config, DLQ suffixes, recovery batch sizes, etc.
- Service health resolves the configured dead-letter queue target and includes that backlog in queue health calculations.

## Related docs

- [Default queue bridge](./default_queue_bridge.md)
- [Redis queue bridge](./redis_queue_bridge.md)
- [Queues overview](../../2_building_business-logic/queue/index.md)
- [Event bridges](../eventbridges/index.md)
