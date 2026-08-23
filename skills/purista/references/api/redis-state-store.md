# @purista/redis-state-store API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 33dfc6c4700fa85e -->

Use this reference only when working with `@purista/redis-state-store`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [RedisStateStore](#redisstatestore)

## RedisStateStore

**class.** State store backed by Redis string keys. Source: `redis-state-store/src/RedisStateStore.impl.ts:44`.

**Verified example**

```typescript
const store = new RedisStateStore({
  retention: { default: { mode: 'expire', ttlMs: 24 * 60 * 60_000 } },
  config: { url: 'redis://localhost:6379' },
})

await store.setState('tenant:acme:prod:cart:session-123', { step: 'shipping' })
const state = await store.getState('tenant:acme:prod:cart:session-123')
await store.destroy()
```

**Public callable patterns**

- `destroy()` — Disconnects the Redis client if it is open.
- `getState(...stateNames)` — Get one or more state values by name.
- `removeState(stateName)` — Remove one state value by name.
- `setState(stateName, stateValue, options?)` — Store or replace one state value.

