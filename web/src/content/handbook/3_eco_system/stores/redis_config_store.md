---
title: Redis Config Store
description: Store config values in Redis — fast, widely deployed, simple key-value JSON storage.
order: 302110
---

# Redis Config Store

`@purista/redis-config-store` stores config values as JSON strings in Redis. It is a good choice when Redis is already in your stack and you want a simple, fast config backend without additional infrastructure.

## Capabilities

| Feature | Support |
|---|---|
| Read (`getConfig`) | ✅ (enabled by default) |
| Write (`setConfig`) | ✅ (opt-in) |
| Delete (`removeConfig`) | ✅ (opt-in) |
| Persistence across restarts | ✅ (Redis persistence) |
| TTL / expiry | via Redis directly |
| Cluster / Sentinel | ✅ (node-redis) |

## Install

```bash
npm install @purista/redis-config-store
```

## Setup

```typescript
import { RedisConfigStore } from '@purista/redis-config-store'

const configStore = new RedisConfigStore({
  config: {
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  },
  // By default only reads are enabled.
  // Enable writes and deletes explicitly when your services need them:
  enableSet: true,
  enableRemove: true,
})

const myService = await myV1Service.getInstance(eventBridge, { configStore })
```

The `config` object is passed directly to [node-redis](https://redis.js.org) — all connection options (TLS, authentication, cluster, Sentinel) are supported.

## Usage inside a handler

```typescript
.setCommandFunction(async function (context, payload) {
  // Read one or more keys — returns a keyed object
  const { apiBaseUrl, retryLimit } = await context.configs.getConfig('apiBaseUrl', 'retryLimit')

  // Write a value at runtime
  await context.configs.setConfig('featureFlags', { newCheckout: true })

  // Remove a key
  await context.configs.removeConfig('deprecatedKey')
})
```

## Feature flags

```typescript
enableGet: true,     // allow reading  (default: true)
enableSet: true,     // allow writing  (default: false)
enableRemove: true,  // allow deleting (default: false)
```

Disable write operations on services that should only read config to enforce least-privilege at the application layer.

## Operational tips

- Store config under a consistent key prefix per environment (`prod:config:`, `staging:config:`) to avoid collisions
- Enable Redis persistence (RDB or AOF) so values survive broker restarts
- Use Redis ACLs to restrict which services can write to the config namespace
- The Redis connection is established lazily on first use; connection errors are logged with full span context

## Related

- [Config Store overview](../stores.md)
- [Default Config Store](./default_config_store.md)
- [NATS Config Store](./nats_config_store.md)
- [AWS SSM Config Store](./aws_config_store.md)
