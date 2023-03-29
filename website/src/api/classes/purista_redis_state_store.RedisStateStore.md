[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/redis-state-store](../modules/purista_redis_state_store.md) / RedisStateStore

# Class: RedisStateStore<M, F, S\>

[@purista/redis-state-store](../modules/purista_redis_state_store.md).RedisStateStore

A state store for using redis as storage.
State values are stored as stringified JSON.

Per default, setting/changing and removal of values are enabled.

**`Example`**

```typescript
const config = {
 enableGet: true, // optional, default is true
 enableRemove: true, // optional, default is true
 enableSet: true, // optional, default is true
 url: 'redis://alice:foobared@awesome.redis.server:6379'
}

const store = new RedisStateStore({ config })

await store.setState('stateKey',{ myState: 'value' })

let value = await store.getState('stateKey')
console.log(value) // outputs: { myState: 'value' }

await store.removeState('stateKey')

value = await store.getState('stateKey')
console.log(value) // outputs: undefined
```

See documentation of underlaying redis lib package for detailed configuration options.

**`See`**

[NODE-REDIS](https://redis.js.org)

## Type parameters

| Name | Type |
| :------ | :------ |
| `M` | extends `RedisModules` = `RedisModules` |
| `F` | extends `RedisFunctions` = `RedisFunctions` |
| `S` | extends `RedisScripts` = `RedisScripts` |

## Hierarchy

- [`StateStoreBaseClass`](purista_redis_state_store.internal.StateStoreBaseClass.md)<`RedisClientOptions`<`M`, `F`, `S`\>\>

  ↳ **`RedisStateStore`**

## Table of contents

### Constructors

- [constructor](purista_redis_state_store.RedisStateStore.md#constructor)

### Properties

- [client](purista_redis_state_store.RedisStateStore.md#client)
- [config](purista_redis_state_store.RedisStateStore.md#config)
- [logger](purista_redis_state_store.RedisStateStore.md#logger)
- [name](purista_redis_state_store.RedisStateStore.md#name)

### Methods

- [destroy](purista_redis_state_store.RedisStateStore.md#destroy)
- [getState](purista_redis_state_store.RedisStateStore.md#getstate)
- [removeState](purista_redis_state_store.RedisStateStore.md#removestate)
- [setState](purista_redis_state_store.RedisStateStore.md#setstate)

## Constructors

### constructor

• **new RedisStateStore**<`M`, `F`, `S`\>(`config?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | extends `RedisModules` = `RedisModules` |
| `F` | extends `RedisFunctions` = `RedisFunctions` |
| `S` | extends `RedisScripts` = `RedisScripts` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`StoreBaseConfig`](../modules/purista_redis_state_store.internal.md#storebaseconfig)<`RedisClientOptions`<`M`, `F`, `S`\>\> |

#### Overrides

[StateStoreBaseClass](purista_redis_state_store.internal.StateStoreBaseClass.md).[constructor](purista_redis_state_store.internal.StateStoreBaseClass.md#constructor)

#### Defined in

[packages/state-store-redis/src/RedisStateStore.impl.ts:50](https://github.com/sebastianwessel/purista/blob/8c66693/packages/state-store-redis/src/RedisStateStore.impl.ts#L50)

## Properties

### client

• **client**: `RedisClientType`<`M`, `F`, `S`\>

#### Defined in

[packages/state-store-redis/src/RedisStateStore.impl.ts:48](https://github.com/sebastianwessel/purista/blob/8c66693/packages/state-store-redis/src/RedisStateStore.impl.ts#L48)

___

### config

• **config**: [`StoreBaseConfig`](../modules/purista_redis_state_store.internal.md#storebaseconfig)<`RedisClientOptions`<`M`, `F`, `S`\>\>

#### Inherited from

[StateStoreBaseClass](purista_redis_state_store.internal.StateStoreBaseClass.md).[config](purista_redis_state_store.internal.StateStoreBaseClass.md#config)

#### Defined in

packages/core/lib/core/StateStore/StateStoreBaseClass.impl.d.ts:10

___

### logger

• **logger**: [`Logger`](purista_redis_state_store.internal.Logger.md)

#### Inherited from

[StateStoreBaseClass](purista_redis_state_store.internal.StateStoreBaseClass.md).[logger](purista_redis_state_store.internal.StateStoreBaseClass.md#logger)

#### Defined in

packages/core/lib/core/StateStore/StateStoreBaseClass.impl.d.ts:9

___

### name

• **name**: `string`

name of store

#### Inherited from

[StateStoreBaseClass](purista_redis_state_store.internal.StateStoreBaseClass.md).[name](purista_redis_state_store.internal.StateStoreBaseClass.md#name)

#### Defined in

packages/core/lib/core/StateStore/StateStoreBaseClass.impl.d.ts:11

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

disconnects and shuts down the state store

#### Returns

`Promise`<`void`\>

#### Overrides

[StateStoreBaseClass](purista_redis_state_store.internal.StateStoreBaseClass.md).[destroy](purista_redis_state_store.internal.StateStoreBaseClass.md#destroy)

#### Defined in

[packages/state-store-redis/src/RedisStateStore.impl.ts:113](https://github.com/sebastianwessel/purista/blob/8c66693/packages/state-store-redis/src/RedisStateStore.impl.ts#L113)

___

### getState

▸ **getState**(`...stateNames`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...stateNames` | `string`[] |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Overrides

[StateStoreBaseClass](purista_redis_state_store.internal.StateStoreBaseClass.md).[getState](purista_redis_state_store.internal.StateStoreBaseClass.md#getstate)

#### Defined in

[packages/state-store-redis/src/RedisStateStore.impl.ts:55](https://github.com/sebastianwessel/purista/blob/8c66693/packages/state-store-redis/src/RedisStateStore.impl.ts#L55)

___

### removeState

▸ **removeState**(`stateName`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |

#### Returns

`Promise`<`void`\>

#### Overrides

[StateStoreBaseClass](purista_redis_state_store.internal.StateStoreBaseClass.md).[removeState](purista_redis_state_store.internal.StateStoreBaseClass.md#removestate)

#### Defined in

[packages/state-store-redis/src/RedisStateStore.impl.ts:78](https://github.com/sebastianwessel/purista/blob/8c66693/packages/state-store-redis/src/RedisStateStore.impl.ts#L78)

___

### setState

▸ **setState**(`stateName`, `stateValue`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |
| `stateValue` | `unknown` |

#### Returns

`Promise`<`void`\>

#### Overrides

[StateStoreBaseClass](purista_redis_state_store.internal.StateStoreBaseClass.md).[setState](purista_redis_state_store.internal.StateStoreBaseClass.md#setstate)

#### Defined in

[packages/state-store-redis/src/RedisStateStore.impl.ts:96](https://github.com/sebastianwessel/purista/blob/8c66693/packages/state-store-redis/src/RedisStateStore.impl.ts#L96)
