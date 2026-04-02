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
| [RedisQueueBridge](./redis_queue_bridge.md) | Redis persistence | yes (sorted set scheduling) | yes (separate Redis keys) | yes, with atomic recovery / requeue scripts and orphan-processing recovery | production CQRS, AI job pools, delayed processing |
| [NatsQueueBridge](./nats_queue_bridge.md) | JetStream persistence | yes (scheduled stream + due-job release) | yes (dedicated DLQ streams) | yes, via JetStream ack timeout redelivery | production event-native workloads already standardized on NATS |

Future adapters will live in `packages/<provider>-queue-bridge` once that provider offers reliable pull + lease semantics (e.g., SQS, Azure Storage Queues).

## Selection checklist

- **Durability:** Do you need jobs to survive restarts? Pick Redis or another persistent backend.
- **Visibility / leases:** Ensure the bridge exposes `leaseTtlMs` and `extendLease` support for long-running work.
- **Delayed delivery:** If your workflow requires scheduled jobs, verify the bridge has native delay or sorted-set scheduling.
- **Lease recovery:** Confirm expired leases are requeued or dead-lettered deterministically.
- **Operations:** Consider monitoring (metrics, DLQ inspection/replay/purge APIs) and whether your ops team already runs the backing service.

## Safe defaults

- PURISTA defaults queue workers to `prefetch: 1` and FIFO-style processing so a new queue starts conservatively and predictably.
- Queue worker failures retry with the lifecycle strategy until `maxAttempts` or `retryWindowMs` is exceeded; after that the runtime dead-letters the job.
- `context.job.moveToDeadLetter(reason?)` exists in every queue worker context, so poison messages can be handled explicitly without custom bridge code.
- Startup validation is strict by default for queue bridges that advertise `strictStartupValidation`, so unsupported ordering or prefetch assumptions fail during service startup instead of degrading silently.

## Operator workflow

- Inspect DLQ entries with the queue bridge when `deadLetterInspectSupported` is true.
- Redrive DLQ entries back into the queue with `redriveDeadLetter(...)` after the root cause is fixed.
- Purge DLQ entries only when they are confirmed as non-replayable poison messages.
- Prefer queue bridges over event bridges for replay-heavy, lease-sensitive workloads that need operator remediation.

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
- [NATS queue bridge](./nats_queue_bridge.md)
- [Queues overview](../../2_building_business-logic/queue/index.md)
- [Event bridges](../eventbridges/index.md)
