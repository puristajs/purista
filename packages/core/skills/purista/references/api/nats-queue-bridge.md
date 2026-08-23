# @purista/nats-queue-bridge API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 33dfc6c4700fa85e -->

Use this reference only when working with `@purista/nats-queue-bridge`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [NatsQueueBridge](#natsqueuebridge)

## NatsQueueBridge

**class.** Strict QueueBridge implementation backed by NATS JetStream streams and KV. Source: `NatsQueueBridge.impl.ts:87`.

**Verified example**

```typescript
import { NatsQueueBridge } from '@purista/nats-queue-bridge'

const queueBridge = new NatsQueueBridge({
  connectionOptions: { servers: 'nats://localhost:4222' },
  defaultMaxAttempts: 5,
})

await queueBridge.start()
```

**Public callable patterns**

- `ack(queueName, leaseId)` — Acknowledges successful processing and removes the local lease tracking.
- `destroy()` — Drains and closes the NATS connection and clears local lease/consumer caches.
- `enqueue(options)` — Enqueues a job, optionally scheduled for later delivery.
- `extendLease(queueName, leaseId, extensionMs)` — Extends a currently tracked lease.
- `inspectLeases(queueName, options?)` — Returns leases currently tracked by this bridge instance.
- `isHealthy()` — Performs a lightweight connection flush to verify broker health.
- `isReady()` — Indicates whether the bridge has an open NATS connection.
- `leaseNext(queueName, options?)` — Leases the next available job from a queue.
- `metrics(queueName)` — Returns broker-derived queue metrics for pending, in-flight, and dead-lettered jobs.
- `moveToDeadLetter(queueName, message, reason?)` — Moves a message directly to the queue dead-letter stream.
- `nack(queueName, leaseId, request)` — Retries or dead-letters a leased job.
- `peekDeadLetter(queueName, options?)` — Reads dead-lettered jobs without redriving or deleting them.
- `purgeDeadLetter(queueName)` — Deletes all jobs in the queue dead-letter stream and returns the deleted count.
- `redriveDeadLetter(queueName, options?)` — Redrives dead-lettered jobs back to the pending queue and removes them from the dead-letter stream.
- `start()` — Connects to NATS and initializes JetStream clients.

