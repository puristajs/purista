# @purista/redis-config-store API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 527f17db6c2c34eb -->

Use this reference only when working with `@purista/redis-config-store`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [RedisConfigStore](#redisconfigstore)

## RedisConfigStore

**class.** Config store backed by Redis string keys. Source: `redis-config-store/src/RedisConfigStore.impl.ts:42`.

**Verified example**

```typescript
const store = new RedisConfigStore({
  config: { url: 'redis://localhost:6379' },
})

await store.setConfig('tenant:acme:prod:app:features', { checkout: true })
const config = await store.getConfig('tenant:acme:prod:app:features')
await store.destroy()
```

**Public callable patterns**

- `destroy()` — Disconnects the Redis client if it is open.
- `getConfig(...configNames)` — Returns the values for given config properties.
- `removeConfig(configName)` — Removes the config item given by config name.
- `setConfig(configName, configValue)` — Sets a config value.

