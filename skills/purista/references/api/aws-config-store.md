# @purista/aws-config-store API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 33dfc6c4700fa85e -->

Use this reference only when working with `@purista/aws-config-store`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [AWSConfigStore](#awsconfigstore)

## AWSConfigStore

**class.** Config store backed by AWS Systems Manager Parameter Store. Source: `aws-config-store/src/AWSConfigStore.impl.ts:40`.

**Verified example**

```typescript
const store = new AWSConfigStore({
  client: { region: 'eu-central-1' },
  cacheTtl: 60_000,
})

await store.setConfig('/tenants/acme/prod/app/theme', 'dark')
const config = await store.getConfig('/tenants/acme/prod/app/theme')
```

**Public callable patterns**

- `destroy()` — Shutdown hook for store adapters.
- `getConfig(...configNames)` — Returns the values for given config properties.
- `removeConfig(configName)` — Removes the config item given by config name.
- `setConfig(configName, configValue)` — Sets a config value.

