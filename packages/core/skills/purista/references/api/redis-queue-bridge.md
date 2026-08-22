# @purista/redis-queue-bridge API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 527f17db6c2c34eb -->

Use this reference only when working with `@purista/redis-queue-bridge`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [RedisQueueBridge](#redisqueuebridge)

## RedisQueueBridge

**class.** Strict QueueBridge implementation backed by Redis data structures. Source: `RedisQueueBridge.impl.ts:80`.

**Verified example**

```typescript
import { RedisQueueBridge } from '@purista/redis-queue-bridge'

const queueBridge = new RedisQueueBridge({
  config: { url: 'redis://localhost:6379' },
})

await queueBridge.start()
```

**Public callable patterns**

- `ack(queueName, leaseId)` — Acknowledges successful processing and removes the job and lease metadata.
- `destroy()` — Disconnects the Redis client if it is open.
- `enqueue(options)` — Enqueues a job, optionally scheduled for delayed delivery.
- `extendLease(queueName, leaseId, extensionMs)` — Extends a currently active lease by updating the stored expiry timestamp.
- `inspectLeases(queueName, options?)` — Lists active lease records for a queue from Redis lease metadata.
- `isHealthy()` — Performs a Redis `PING` to verify broker health.
- `isReady()` — Indicates whether the Redis client reports itself as ready.
- `leaseNext(queueName, options?)` — Leases the next available job from a queue.
- `metrics(queueName)` — Returns Redis-derived queue metrics for pending, in-flight, dead-letter, retry count, and oldest pending job age.
- `moveToDeadLetter(queueName, message, reason?)` — Appends a message to the queue dead-letter list.
- `nack(queueName, leaseId, request)` — Retries or dead-letters a leased job according to the retry request and the job's `maxAttempts` value.
- `peekDeadLetter(queueName, options?)` — Reads dead-lettered messages without removing them.
- `purgeDeadLetter(queueName)` — Removes all dead-lettered messages and returns the removed count.
- `redriveDeadLetter(queueName, options?)` — Moves dead-lettered messages back to the queue for processing.
- `start()` — Opens the Redis client connection.

