---
title: NATS State Store
description: Store runtime state in NATS JetStream KV — ideal for NATS-first stacks with built-in replication and watch support.
order: 302320
---

# NATS State Store

`@purista/nats-state-store` uses [NATS JetStream Key-Value](https://docs.nats.io/nats-concepts/jetstream/key-value-store) as the state backend. If your services already communicate over NATS, this keeps your infrastructure footprint small — one technology covers messaging, config, and state.

> **JetStream required.** NATS must be started with JetStream enabled (`nats-server -js`).

## Capabilities

| Feature | Support |
|---|---|
| Read (`getState`) | ✅ |
| Write (`setState`) | ✅ |
| Delete (`removeState`) | ✅ |
| Persistence across restarts | ✅ (JetStream) |
| Watch / reactive updates | ✅ (JetStream KV watchers) |
| Replication | ✅ (JetStream clustering) |
| StateStore retention | ❌ (bucket max age is not per-key sliding expiry) |

## Install

```bash
npm install @purista/nats-state-store
```

## Setup

```typescript
import { NatsStateStore } from '@purista/nats-state-store'

const stateStore = new NatsStateStore({
  servers: process.env.NATS_URL ?? 'nats://localhost:4222',
  // JetStream KV bucket name (created automatically if it does not exist):
  keyValueStoreName: 'purista-state',
})

const myService = await myV1Service.getInstance(eventBridge, { stateStore })
```

All [NATS JavaScript client](https://github.com/nats-io/nats.js) connection options are supported — TLS, credentials files, cluster seed URLs.

## Usage inside a handler

```typescript
.setCommandFunction(async function (context, payload) {
  await context.states.setState('lastProcessedAt', new Date().toISOString())
  const { lastProcessedAt } = await context.states.getState('lastProcessedAt')

  await context.states.removeState('expiredKey')
})
```

## Operational tips

- Use separate KV buckets per service or environment to avoid key collisions and simplify access control
- Set `replicas: 3` on the JetStream KV bucket for HA in production NATS clusters
- A bucket-level max age applies to every entry in the bucket. It cannot satisfy
  PURISTA's per-key, write-refreshing retention contract; use Redis or a
  TTL-capable Dapr component when a handler needs `retention: { mode: 'expire' }`
- NATS JetStream KV watchers enable real-time state change notifications across services — useful for reactive architectures

## Related

- [State Store overview](../stores.md)
- [Default State Store](./default_state_store.md)
- [Redis State Store](./redis_state_store.md)
- [Dapr State Store](./dapr_state_store.md)
- [StateStore retention](../../2_building-business-logic/stores/state-stores.md#retention)
