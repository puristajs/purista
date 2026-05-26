---
title: Default Secret Store
description: In-memory secret store for local development and testing — ships with @purista/core.
order: 302200
---

# Default Secret Store

`DefaultSecretStore` is bundled with `@purista/core`. It holds secrets in memory with no external dependency. Values are lost on restart.

> **Never use in production.** Secrets stored here are unencrypted in process memory and disappear on restart. Use a proper secret backend (AWS Secrets Manager, HashiCorp Vault, Azure Key Vault, etc.) for staging and production.

## Capabilities

| Feature | Support |
|---|---|
| Read (`getSecret`) | ✅ |
| Write (`setSecret`) | ✅ (configurable) |
| Delete (`removeSecret`) | ✅ (configurable) |
| Encryption at rest | ❌ |
| Persistence across restarts | ❌ |
| External dependency | ❌ |

## Setup

No extra package needed — `DefaultSecretStore` is part of `@purista/core`.

```typescript
import { DefaultSecretStore } from '@purista/core'

const secretStore = new DefaultSecretStore({
  enableGet: true,
  enableSet: true,
  enableRemove: true,
  // Seed known values for unit tests:
  config: {
    myApiKey: 'test-key-123',
    dbPassword: 'test-password',
  },
})

const myService = await myV1Service.getInstance(eventBridge, { secretStore })
```

## Usage inside a handler

```typescript
.setCommandFunction(async function (context, payload) {
  const { myApiKey } = await context.secrets.getSecret('myApiKey')
  // use myApiKey to authenticate with an external service
})
```

## When to use

- Unit tests: inject known secrets and assert business logic uses them correctly
- Local development: avoid connecting to a real secret store during iteration
- CI pipelines: seed secrets as environment variables via the `config` option

## Related

- [Secret Store overview](../stores.md)
- [AWS Secrets Manager](./aws_secret_store.md)
- [HashiCorp Vault](./vault_secret_store.md)
- [Azure Key Vault](./azure_secret_store.md)
