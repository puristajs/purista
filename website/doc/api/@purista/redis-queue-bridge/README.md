[**PURISTA API**](../../README.md)

***

[PURISTA API](../../packages.md) / @purista/redis-queue-bridge

# @purista/redis-queue-bridge

A pull-based queue bridge that persists jobs inside Redis lists. It implements the `QueueBridge` interface from `@purista/core` and exposes the same leasing semantics as the default in-memory bridge.

- FIFO semantics backed by `LPUSH`/`BRPOPLPUSH`
- Delayed delivery via a Redis sorted set
- Lease renewal + crash recovery using per-lease bookkeeping
- Dead-letter queue stored in Redis for later inspection

## Usage

```ts
import { RedisQueueBridge } from '@purista/redis-queue-bridge'

const queueBridge = new RedisQueueBridge({
	config: {
		url: 'redis://127.0.0.1:6379'
	}
})
```

Inject the bridge into a service via `ServiceBuilder.defineResource('queueBridge', queueBridge)` or provide it during service construction.

## Classes

- [RedisQueueBridge](classes/RedisQueueBridge.md)

## Type Aliases

- [RedisQueueBridgeOptions](type-aliases/RedisQueueBridgeOptions.md)
