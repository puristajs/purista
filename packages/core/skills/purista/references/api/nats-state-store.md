# @purista/nats-state-store API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 527f17db6c2c34eb -->

Use this reference only when working with `@purista/nats-state-store`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [NatsStateStore](#natsstatestore)

## NatsStateStore

**class.** State store backed by a NATS JetStream key-value bucket. Source: `nats-state-store/src/NatsStateStore.impl.ts:34`.

**Verified example**

```typescript
const store = new NatsStateStore({
  servers: 'nats://localhost:4222',
  keyValueStoreName: 'purista-state-store',
})

await store.setState('tenant.acme.prod.cart.session-123', { step: 'shipping' })
const state = await store.getState('tenant.acme.prod.cart.session-123')
await store.destroy()
```

**Public callable patterns**

- `destroy()` — Drains and closes the NATS connection and clears cached handles.
- `getState(...stateNames)` — Get one or more state values by name.
- `getStore()` — Returns a healthy JetStream key-value bucket handle.
- `removeState(stateName)` — Remove one state value by name.
- `setState(stateName, stateValue, options?)` — Store or replace one state value.

