---
title: Queue Bridges
description: Choose the right PURISTA queue bridge for pull-based workloads.
order: 301500
---

# Queue Bridges

Queue bridges provide the persistence, leasing, and dead-letter mechanics for pull-based workloads. They are independent from event bridges, so you can mix RabbitMQ/MQTT/NATS for push traffic with any queue backend you prefer.

## Support matrix

| bridge | durability | delayed delivery | DLQ | lease expiry recovery | idempotency enforcement | recommended use cases |
| --- | --- | --- | --- | --- | --- | --- |
| [DefaultQueueBridge](./default_queue_bridge.md) | in-memory per service instance | yes (timer based) | yes (in-memory) | yes, within the current process | no | unit tests, local dev, single-instance cron-like jobs |
| [RedisQueueBridge](./redis_queue_bridge.md) | Redis persistence | yes (sorted set scheduling) | yes (separate Redis keys) | yes, with atomic recovery / requeue scripts and orphan-processing recovery | no | production CQRS, AI job pools, delayed processing |
| [NatsQueueBridge](./nats_queue_bridge.md) | JetStream persistence | yes (scheduled stream + due-job release) | yes (dedicated DLQ streams) | yes, via JetStream ack timeout redelivery | no | production event-native workloads already standardized on NATS |

Current queue bridges pass idempotency keys through to queue messages, but they do not claim strict provider-level dedupe. Keep `idempotencyMode: 'advisory'` unless a bridge explicitly advertises `idempotencyEnforcement: true`.

### Capability flags

| capability | Default | Redis | NATS |
| --- | ---: | ---: | ---: |
| `delayedDelivery` | yes | yes | yes |
| `providerManagedDelayedDelivery` | no | yes | yes |
| `fifoOrdering` | yes | yes | yes |
| `deadLetterInspectSupported` | yes | yes | yes |
| `deadLetterReplaySupported` | yes | yes | yes |
| `deadLetterPurgeSupported` | yes | yes | yes |
| `leaseInspectionSupported` | no | yes | yes |
| `idempotencyEnforcement` | no | no | no |
| `strictStartupValidation` | yes | yes | yes |

Future adapters will live in `packages/<provider>-queue-bridge` once that provider offers reliable pull + lease semantics (e.g., SQS, Azure Storage Queues).

## Selection checklist

- **Durability:** Do you need jobs to survive restarts? Pick Redis or another persistent backend.
- **Visibility / leases:** Ensure the bridge exposes `leaseTtlMs` and `extendLease` support for long-running work.
- **Delayed delivery:** If your workflow requires scheduled jobs, verify the bridge has native delay or sorted-set scheduling.
- **Lease recovery:** Confirm expired leases are requeued or dead-lettered deterministically.
- **Operations:** Consider monitoring (metrics, DLQ inspection/replay/purge APIs) and whether your ops team already runs the backing service.

## Safe defaults

| default | value | effect |
| --- | --- | --- |
| worker mode | `sequential` + `prefetch: 1` | conservative processing with minimal duplicate pressure |
| retry budget | `maxAttempts: 10` | bounded retries before dead-letter |
| retry timing | exponential backoff (1s initial, max 120s, jitter) | avoids hot retry loops by default |
| retry window | `retryWindowMs: 24h` | stale jobs stop retrying forever |
| poison handling | `poisonMessageFailureThreshold: 0` + `poisonMessageAction: 'none'` | no automatic worker pause unless explicitly enabled |
| startup validation | strict where bridge advertises `strictStartupValidation` | unsupported guarantees fail fast |

- Queue worker failures retry with lifecycle policy until `maxAttempts` or `retryWindowMs` is exceeded; after that the runtime dead-letters the job.
- `context.job.moveToDeadLetter(reason?)` is always available to bypass retries intentionally.
- Enable poison controls per queue lifecycle to auto-pause workers on repeated identical failures.

## Operator workflow

- Inspect DLQ entries with the queue bridge when `deadLetterInspectSupported` is true.
- Redrive DLQ entries back into the queue with `redriveDeadLetter(...)` after the root cause is fixed.
- Purge DLQ entries only when they are confirmed as non-replayable poison messages.
- Pause queue workers when repeated poison failures threaten stability: `service.pauseQueueWorkers(queueName, reason)`.
- Resume after remediation with `service.resumeQueueWorkers(queueName)`.
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
