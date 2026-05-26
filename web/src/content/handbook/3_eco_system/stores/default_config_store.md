---
title: Default Config Store
description: In-memory config store for local development and testing — ships with @purista/core.
order: 302100
---

# Default Config Store

`DefaultConfigStore` is bundled with `@purista/core`. It holds values in memory, needs no external dependency, and resets on every restart — making it perfect for local development and unit tests.

> **Not for production.** Any value written is lost when the process exits. Use a durable adapter (Redis, NATS, AWS SSM) in staging and production.

## Capabilities

| Feature | Support |
|---|---|
| Read (`getConfig`) | ✅ |
| Write (`setConfig`) | ✅ (configurable) |
| Delete (`removeConfig`) | ✅ (configurable) |
| Persistence across restarts | ❌ |
| External dependency | ❌ |

## Setup

No extra package needed — `DefaultConfigStore` is part of `@purista/core`.

```typescript
import { DefaultConfigStore } from '@purista/core'

const configStore = new DefaultConfigStore({
  enableGet: true,
  enableSet: true,
  enableRemove: true,
  // Seed initial values for testing:
  config: {
    apiBaseUrl: 'http://localhost:3000',
    retryLimit: 3,
  },
})

const myService = await myV1Service.getInstance(eventBridge, { configStore })
```

## Usage inside a handler

```typescript
.setCommandFunction(async function (context, payload) {
  const { apiBaseUrl } = await context.configs.getConfig('apiBaseUrl')

  await context.configs.setConfig('featureFlags', { newCheckout: true })

  await context.configs.removeConfig('deprecatedKey')
})
```

## When to use

- Local development: seed values via the `config` option rather than connecting to a remote store
- Unit tests: inject known values and assert that business logic reads them correctly
- In-process demos and examples

## Related

- [Config Store overview](../stores.md)
- [Redis Config Store](./redis_config_store.md)
- [AWS SSM Config Store](./aws_config_store.md)
- [NATS Config Store](./nats_config_store.md)
