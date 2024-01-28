[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/nats-state-store](../modules/purista_nats_state_store.md) / NatsStateStore

# Class: NatsStateStore

[@purista/nats-state-store](../modules/purista_nats_state_store.md).NatsStateStore

A state store for using NATS (with JetStream) as storage.

**`Example`**

* ```typescript
const config = {
  port: 8222
}

const store = new NatsStateStore({ config })

await store.setState('stateKey',{ myState: 'value' })

let value = await store.getState('stateKey')
console.log(value) // outputs: { stateKey: { myState: 'value' } }

await store.removeState('stateKey')

value = await store.getState('stateKey')
console.log(value) // outputs: undefined

```

## Hierarchy

- [`StateStoreBaseClass`](purista_core.StateStoreBaseClass.md)\<[`NatsStateStoreConfig`](../modules/purista_nats_state_store.md#natsstatestoreconfig)\>

  ↳ **`NatsStateStore`**

## Table of contents

### Constructors

- [constructor](purista_nats_state_store.NatsStateStore.md#constructor)

### Properties

- [config](purista_nats_state_store.NatsStateStore.md#config)
- [connection](purista_nats_state_store.NatsStateStore.md#connection)
- [kv](purista_nats_state_store.NatsStateStore.md#kv)
- [logger](purista_nats_state_store.NatsStateStore.md#logger)
- [name](purista_nats_state_store.NatsStateStore.md#name)
- [sc](purista_nats_state_store.NatsStateStore.md#sc)

### Methods

- [destroy](purista_nats_state_store.NatsStateStore.md#destroy)
- [getState](purista_nats_state_store.NatsStateStore.md#getstate)
- [getStore](purista_nats_state_store.NatsStateStore.md#getstore)
- [removeState](purista_nats_state_store.NatsStateStore.md#removestate)
- [setState](purista_nats_state_store.NatsStateStore.md#setstate)

## Constructors

### constructor

• **new NatsStateStore**(`config?`): [`NatsStateStore`](purista_nats_state_store.NatsStateStore.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `Object` | - |
| `config.cacheTtl?` | `number` | Cache time to live in ms |
| `config.enableCache?` | `boolean` | Enable cache |
| `config.enableGet?` | `boolean` | Enable generally get method |
| `config.enableRemove?` | `boolean` | Enable generally remove method |
| `config.enableSet?` | `boolean` | Enable generally set method |
| `config.keyValueStoreName?` | `string` | - |
| `config.logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `config.logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |

#### Returns

[`NatsStateStore`](purista_nats_state_store.NatsStateStore.md)

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[constructor](purista_core.StateStoreBaseClass.md#constructor)

#### Defined in

[nats-state-store/src/NatsStateStore.impl.ts:37](https://github.com/sebastianwessel/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L37)

## Properties

### config

• **config**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheTtl?` | `number` | Cache time to live in ms |
| `enableCache?` | `boolean` | Enable cache |
| `enableGet?` | `boolean` | Enable generally get method |
| `enableRemove?` | `boolean` | Enable generally remove method |
| `enableSet?` | `boolean` | Enable generally set method |
| `keyValueStoreName` | `string` | - |
| `logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[config](purista_core.StateStoreBaseClass.md#config)

#### Defined in

core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:10

___

### connection

• **connection**: `undefined` \| `NatsConnection`

#### Defined in

[nats-state-store/src/NatsStateStore.impl.ts:32](https://github.com/sebastianwessel/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L32)

___

### kv

• **kv**: `undefined` \| `KV`

#### Defined in

[nats-state-store/src/NatsStateStore.impl.ts:35](https://github.com/sebastianwessel/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L35)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[logger](purista_core.StateStoreBaseClass.md#logger)

#### Defined in

core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:9

___

### name

• **name**: `string`

name of store

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[name](purista_core.StateStoreBaseClass.md#name)

#### Defined in

core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:11

___

### sc

• **sc**: `Codec`\<`unknown`\>

#### Defined in

[nats-state-store/src/NatsStateStore.impl.ts:34](https://github.com/sebastianwessel/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L34)

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

disconnects and shuts down the state store

#### Returns

`Promise`\<`void`\>

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[destroy](purista_core.StateStoreBaseClass.md#destroy)

#### Defined in

[nats-state-store/src/NatsStateStore.impl.ts:126](https://github.com/sebastianwessel/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L126)

___

### getState

▸ **getState**(`...stateNames`): `Promise`\<`Record`\<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...stateNames` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[getState](purista_core.StateStoreBaseClass.md#getstate)

#### Defined in

[nats-state-store/src/NatsStateStore.impl.ts:73](https://github.com/sebastianwessel/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L73)

___

### getStore

▸ **getStore**(): `Promise`\<`KV`\>

#### Returns

`Promise`\<`KV`\>

#### Defined in

[nats-state-store/src/NatsStateStore.impl.ts:45](https://github.com/sebastianwessel/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L45)

___

### removeState

▸ **removeState**(`stateName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[removeState](purista_core.StateStoreBaseClass.md#removestate)

#### Defined in

[nats-state-store/src/NatsStateStore.impl.ts:94](https://github.com/sebastianwessel/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L94)

___

### setState

▸ **setState**(`stateName`, `stateValue`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |
| `stateValue` | `unknown` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[setState](purista_core.StateStoreBaseClass.md#setstate)

#### Defined in

[nats-state-store/src/NatsStateStore.impl.ts:110](https://github.com/sebastianwessel/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L110)
