---
title: Redis State Store
description: Store runtime state in Redis — durable, fast, with atomic per-key expiry.
order: 302310
---

# Redis State Store

`@purista/redis-state-store` stores service state as JSON strings in Redis. It
is a common production choice when state must survive process restarts and
temporary values need atomic, per-key expiry.

## Capabilities

| Feature | Support |
|---|---|
| Read (`getState`) | ✅ (enabled by default) |
| Write (`setState`) | ✅ |
| Delete (`removeState`) | ✅ |
| StateStore retention | ✅ (atomic Redis `SET` with expiry) |
| Persistence across restarts | ✅ (Redis persistence) |
| Cluster / Sentinel | ✅ (node-redis) |

## Install

```bash
npm install @purista/redis-state-store
```

## Setup

```typescript
import { RedisStateStore } from '@purista/redis-state-store'

const stateStore = new RedisStateStore({
  config: {
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  },
  retention: {
    default: { mode: 'expire', ttlMs: 24 * 60 * 60_000 },
  },
})

const myService = await myV1Service.getInstance(eventBridge, { stateStore })
```

The `config` object is passed directly to [node-redis](https://redis.js.org) — TLS, authentication, cluster, and Sentinel options are all supported.

## Usage inside a handler

```typescript
.setCommandFunction(async function (context, payload) {
  // Track last-processed position
  await context.states.setState('lastProcessedAt', new Date().toISOString())
  const { lastProcessedAt } = await context.states.getState('lastProcessedAt')

  // Session state
  await context.states.setState(`session:${payload.userId}`, {
    cart: payload.cartItems,
    updatedAt: Date.now(),
  })

  // Clean up
  await context.states.removeState(`session:${payload.userId}`)
})
```

## Common patterns

**Rate limiting:**
```typescript
const key = `ratelimit:${context.message.principalId ?? 'anonymous'}`
const state = await context.states.getState(key)
const count = (state[key] as { count?: number } | undefined)?.count ?? 0
if (count >= 100) throw new HandledError(StatusCode.TooManyRequests, 'rate limit exceeded')
await context.states.setState(key, { count: count + 1 }, {
  retention: { mode: 'expire', ttlMs: 60_000 },
})
```

**Job status tracking:**
```typescript
await context.states.setState(`job:${jobId}`, { status: 'processing', startedAt: Date.now() })
// ... do work ...
await context.states.setState(`job:${jobId}`, { status: 'done', completedAt: Date.now() })
```

## Operational tips

- Use a consistent key prefix per service (`user-service:state:`) to avoid cross-service collisions
- Enable Redis persistence (RDB snapshots or AOF) so state survives Redis restarts
- Use Redis Sentinel or Cluster for HA in production
- Monitor Redis memory usage — unbounded state writes without expiry or cleanup policies will grow indefinitely
- Use PURISTA `retention`, not raw Redis expiry calls, so handlers remain store-independent

## Related

- [State Store overview](../stores.md)
- [Default State Store](./default_state_store.md)
- [NATS State Store](./nats_state_store.md)
- [Dapr State Store](./dapr_state_store.md)
- [StateStore retention](../../2_building-business-logic/stores/state-stores.md#retention)
