[**@purista/nats-config-store v2.0.5**](README.md)

***

[PURISTA API](../../packages.md) / @purista/nats-config-store

# @purista/nats-config-store

A config store for using NATS (with JetStream) as storage.
JetStream must be enabled at the NATS broker.

## Example

```typescript
const config = {
  port: 8222
}

const store = new NatsConfigStore(config)

await store.setConfig('configKey',{ myConfig: 'value' })

let value = await store.getConfig('configKey')
console.log(value) // outputs: { configKey: { myConfig: 'value' } }

await store.removeConfig('configKey')

value = await store.getConfig('configKey')
console.log(value) // outputs: undefined
```

## Classes

- [NatsConfigStore](classes/NatsConfigStore.md)

## Type Aliases

- [NatsConfigStoreConfig](type-aliases/NatsConfigStoreConfig.md)

## Variables

- [puristaVersion](variables/puristaVersion.md)
