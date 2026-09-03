---
title: Deliver queue jobs through Redis
description: Enable Redis-backed queues with leases, delayed delivery, dead-letter inspection, and stable idempotency keys.
order: 722
---

```bash title="Install @purista/redis-queue-bridge"
npm install @purista/redis-queue-bridge
```

Provision Redis with TLS, authentication, persistence/backup, and capacity for queue payloads and delayed-job sorted sets. Then construct and wire the bridge:

```ts title="src/index.ts"
import { RedisQueueBridge } from '@purista/redis-queue-bridge'

const queueBridge = new RedisQueueBridge({
  config: { url: process.env.REDIS_URL },
  keyPrefix: 'incident:queue:',
})
await queueBridge.start()

const service = await incidentV1Service.getInstance(eventBridge, { queueBridge })
```

The adapter supports FIFO work, delayed delivery, lease recovery, dead-letter
queues, and strict enqueue idempotency when callers provide an
`idempotencyKey`. A duplicate enqueue then returns the original job ID; it does
not make worker execution or a downstream side effect exactly once. Use
`scheduleBatchSize` and `recoveryBatchSize` to bound each bridge maintenance
pass when queue volume requires it. Verify duplicate enqueue, crash recovery,
and DLQ repair. Protect broker storage and backups because jobs may contain
business data.

## Configure Redis ownership and maintenance

| Option | Default | Effect |
| --- | --- | --- |
| `config` | Node Redis defaults | Passed to `createClient`; provide the Redis URL, TLS, authentication, and reconnect policy owned by the environment. |
| `keyPrefix` | `purista:queue:` | Prefixes every hash, list, and sorted-set key. Treat a change as a queue-data migration, not a cosmetic rename. |
| `scheduleBatchSize` | `50` | Maximum due scheduled jobs released in one maintenance pass. Increase only after observing a backlog and Redis latency. |
| `recoveryBatchSize` | `50` | Maximum expired leases recovered in one pass. Keep it bounded to avoid a restart/recovery stampede. |

The bridge serializes payload, parameters, and headers as JSON. Its fallback
job defaults are ten attempts and a 15-minute lease, but a queue definition or
enqueue request may supply the job’s `maxAttempts` and `leaseTtlMs`. Redis
enforces an idempotency key only at enqueue time; a worker that loses a lease
can still repeat its business side effect.

Next: [chapter overview](/handbook/framework/connect-distributed-infrastructure/queue-delivery/).
