---
title: Default State Store
description: In-memory state store for local development and testing — ships with @purista/core.
order: 302300
---

# Default State Store

`DefaultStateStore` is bundled with `@purista/core`. It holds state values in memory with no external dependency. All state is lost when the process exits.

> **Not for production.** Use a durable adapter (Redis, NATS, Dapr) for any state that must survive restarts — sessions, counters, job records, or agent memory.

## Capabilities

| Feature | Support |
|---|---|
| Read (`getState`) | ✅ |
| Write (`setState`) | ✅ (configurable) |
| Delete (`removeState`) | ✅ (configurable) |
| Persistence across restarts | ❌ |
| External dependency | ❌ |

## Setup

No extra package needed — `DefaultStateStore` is part of `@purista/core`.

```typescript
import { DefaultStateStore } from '@purista/core'

const stateStore = new DefaultStateStore({
  enableGet: true,
  enableSet: true,
  enableRemove: true,
  // Seed initial state for testing:
  config: {
    lastProcessedId: '0',
    requestCount: 0,
  },
})

const myService = await myV1Service.getInstance(eventBridge, { stateStore })
```

## Usage inside a handler

```typescript
.setCommandFunction(async function (context, payload) {
  // Read state
  const { requestCount } = await context.states.getState('requestCount')

  // Update state
  await context.states.setState('requestCount', (requestCount ?? 0) + 1)

  // Remove state
  await context.states.removeState('oldJobId')
})
```

## When to use

- Unit tests: pre-seed state and assert that handlers read and update it correctly
- Local development: no Redis or NATS needed to iterate on stateful logic
- Stateless services: if your service genuinely has no persistent state needs, the default store satisfies the interface without overhead

## Related

- [State Store overview](../stores.md)
- [Redis State Store](./redis_state_store.md)
- [NATS State Store](./nats_state_store.md)
- [Dapr State Store](./dapr_state_store.md)
