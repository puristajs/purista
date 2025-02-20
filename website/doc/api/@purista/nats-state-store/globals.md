[**@purista/nats-state-store v2.0.5**](README.md)

***

[PURISTA API](../../packages.md) / @purista/nats-state-store

# @purista/nats-state-store

A state store for using NATS (with JetStream) as storage.

## Example

```typescript
const config = {
  port: 8222
}

const store = new NatsStateStore(config)

await store.setState('stateKey',{ myState: 'value' })

let value = await store.getState('stateKey')
console.log(value) // outputs: { stateKey: { myState: 'value' } }

await store.removeState('stateKey')

value = await store.getState('stateKey')
console.log(value) // outputs: undefined

```

## Classes

- [NatsStateStore](classes/NatsStateStore.md)

## Type Aliases

- [NatsStateStoreConfig](type-aliases/NatsStateStoreConfig.md)

## Variables

- [puristaVersion](variables/puristaVersion.md)
