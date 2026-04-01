---
title: Redis Queue Bridge
description: Durable pull-based queues backed by native Redis lists and sorted sets.
order: 301520
---

# Redis Queue Bridge

`@purista/redis-queue-bridge` provides a production-ready queue backend that relies on Redis core primitives (`LPUSH`, `BRPOP`, sorted sets for scheduling) instead of Redis Streams. Use it when you need durable pull-based workloads that survive restarts and support delayed delivery.

## Capabilities

| feature | support |
| --- | --- |
| Durability | ✅ (Redis persistence / replication) |
| Delayed delivery | ✅ (sorted-set scheduler) |
| Dead-letter queue | ✅ (dedicated Redis keys or custom suffix) |
| Lease extension | ✅ (`PEXPIRE` heartbeat + extendLease) |
| Lease expiry recovery | ✅ (atomic claim of expired leases before requeue) |
| Metrics | ✅ (`context.queue.metrics.<queueId>`) |

## Configuration

```ts
import { RedisQueueBridge } from '@purista/redis-queue-bridge'

const queueBridge = new RedisQueueBridge({
  url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  keyPrefix: 'acme:queue:',
  deadLetterSuffix: '.dlq',
  defaultVisibilityTimeoutMs: 15 * 60_000,
})

const service = await myServiceV1Service.getInstance(eventBridge, { queueBridge, logger })
await service.start()
```

- Set a key prefix per environment/tenant to avoid collisions.
- Enable Redis persistence/replication for true durability.
- Keep one dead-letter suffix convention per environment; runtime storage, metrics, and service health now use the same resolved target name.
- Override lifecycle defaults per queue when workloads differ (long-running AI jobs vs. short webhooks).

## Operational tips

- Use Redis ACLs or network policies so only the queue bridge can touch the key prefix.
- Monitor queue metrics (`pending`, `inFlight`, `deadLetter`, `oldestAgeMs`) to scale worker pools or alert on DLQ growth.
- Combine Redis Sentinel/Cluster for HA; delayed jobs and expired leases are claimed atomically before being requeued.
- Keep DLQ keys small by draining them through tooling or an administrative worker.

## Related links

- [Queues overview](../../2_building_business-logic/queue/index.md)
- [Queue builder](../../2_building_business-logic/queue/the-queue-builder.md)
- [Default queue bridge](./default_queue_bridge.md)
