---
title: NATS Config Store
description: Store config values in NATS JetStream KV — ideal for NATS-first stacks with real-time config propagation.
order: 302130
---

# NATS Config Store

`@purista/nats-config-store` uses [NATS JetStream Key-Value](https://docs.nats.io/nats-concepts/jetstream/key-value-store) as the config backend. If your services already communicate over NATS, this is the simplest choice — a single infrastructure dependency covers messaging, config, and state.

> **JetStream required.** NATS must be started with JetStream enabled (`nats-server -js`). Plain NATS (non-JetStream) is not sufficient.

## Capabilities

| Feature | Support |
|---|---|
| Read (`getConfig`) | ✅ |
| Write (`setConfig`) | ✅ (opt-in) |
| Delete (`removeConfig`) | ✅ (opt-in) |
| Persistence across restarts | ✅ (JetStream) |
| Watch / real-time propagation | ✅ (JetStream KV watchers) |
| Clustering | ✅ (NATS clustering) |

## Install

```bash
npm install @purista/nats-config-store
```

## Setup

```typescript
import { NatsConfigStore } from '@purista/nats-config-store'

const configStore = new NatsConfigStore({
  servers: process.env.NATS_URL ?? 'nats://localhost:4222',
  // JetStream KV bucket name (created automatically if it does not exist):
  // bucketName: 'purista-config',
  enableSet: true,
  enableRemove: true,
})

const myService = await myV1Service.getInstance(eventBridge, { configStore })
```

All [NATS JavaScript client](https://github.com/nats-io/nats.js) connection options are supported — TLS, authentication, cluster seed URLs, and more.

## Usage inside a handler

```typescript
.setCommandFunction(async function (context, payload) {
  const { apiBaseUrl, retryLimit } = await context.configs.getConfig('apiBaseUrl', 'retryLimit')

  await context.configs.setConfig('featureFlags', { newCheckout: true })

  await context.configs.removeConfig('deprecatedKey')
})
```

## Operational tips

- Use separate KV buckets per environment (`purista-config-prod`, `purista-config-staging`) for clean separation
- JetStream KV supports history — use `maxHistory` to retain previous values for audit purposes
- Enable JetStream replication (`replicas: 3`) in production for HA
- NATS JetStream watchers allow real-time config propagation to running services — useful for feature flags without restarts

## Related

- [Config Store overview](../stores.md)
- [Default Config Store](./default_config_store.md)
- [Redis Config Store](./redis_config_store.md)
- [AWS SSM Config Store](./aws_config_store.md)
- [Dapr Config Store](./dapr_config_store.md)
