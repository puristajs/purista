[PURISTA API](../README.md) / [Modules](../modules.md) / @purista/nats-state-store

# Module: @purista/nats-state-store

A state store for using NATS (with JetStream) as storage.

**`Example`**

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

## Table of contents

### Classes

- [NatsStateStore](../classes/purista_nats_state_store.NatsStateStore.md)

### Type Aliases

- [NatsStateStoreConfig](purista_nats_state_store.md#natsstatestoreconfig)

### Variables

- [puristaVersion](purista_nats_state_store.md#puristaversion)

## Type Aliases

### NatsStateStoreConfig

Ƭ **NatsStateStoreConfig**: [`Prettify`](purista_core.md#prettify)\<\{ `keyValueStoreName`: `string`  } & `ConnectionOptions` & `Partial`\<`KvOptions`\>\>

#### Defined in

[nats-state-store/src/types/NatsStateStoreConfig.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/nats-state-store/src/types/NatsStateStoreConfig.ts#L4)

## Variables

### puristaVersion

• `Const` **puristaVersion**: ``"1.9.1"``

#### Defined in

[nats-state-store/src/version.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/nats-state-store/src/version.ts#L1)
