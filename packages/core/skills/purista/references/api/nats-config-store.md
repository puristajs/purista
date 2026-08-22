# @purista/nats-config-store API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 527f17db6c2c34eb -->

Use this reference only when working with `@purista/nats-config-store`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [NatsConfigStore](#natsconfigstore)

## NatsConfigStore

**class.** Config store backed by a NATS JetStream key-value bucket. Source: `nats-config-store/src/NatsConfigStore.impl.ts:32`.

**Verified example**

```typescript
const store = new NatsConfigStore({
  servers: 'nats://localhost:4222',
  keyValueStoreName: 'purista-config-store',
})

await store.setConfig('tenant.acme.prod.app.features', { checkout: true })
const config = await store.getConfig('tenant.acme.prod.app.features')
await store.destroy()
```

**Public callable patterns**

- `destroy()` — Drains and closes the NATS connection and clears cached handles.
- `getConfig(...configNames)` — Returns the values for given config properties.
- `getStore()` — Returns a healthy JetStream key-value bucket handle.
- `removeConfig(configName)` — Removes the config item given by config name.
- `setConfig(configName, configValue)` — Sets a config value.

