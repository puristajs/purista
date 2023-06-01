[PURISTA API](../README.md) / [Modules](../modules.md) / @purista/nats-config-store

# Module: @purista/nats-config-store

A config store for using NATS (with JetStream) as storage.
JetStream must be enabled at the NATS broker.

**`Example`**

```typescript
const config = {
  port: 8222
}

const store = new NatsConfigStore({ config })

await store.setConfig('configKey',{ myConfig: 'value' })

let value = await store.getConfig('configKey')
console.log(value) // outputs: { configKey: { myConfig: 'value' } }

await store.removeConfig('configKey')

value = await store.getConfig('configKey')
console.log(value) // outputs: undefined
```

## Table of contents

### Classes

- [NatsConfigStore](../classes/purista_nats_config_store.NatsConfigStore.md)

### Type Aliases

- [NatsConfigStoreConfig](purista_nats_config_store.md#natsconfigstoreconfig)

## Type Aliases

### NatsConfigStoreConfig

Ƭ **NatsConfigStoreConfig**: `Prettify`<{ `keyValueStoreName`: `string`  } & `ConnectionOptions` & `Partial`<`KvOptions`\>\>

#### Defined in

[nats-config-store/src/types/NatsConfigStoreConfig.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/types/NatsConfigStoreConfig.ts#L4)
