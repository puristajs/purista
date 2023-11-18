[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/redis-state-store](../modules/purista_redis_state_store.md) / RedisStateStore

# Class: RedisStateStore\<M, F, S\>

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
console.log(value) // outputs: { stateKey: { myState: 'value' } }

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

- `StateStoreBaseClass`\<[`RedisStoreConfig`](../modules/purista_redis_state_store.md#redisstoreconfig)\<`M`, `F`, `S`\>\>

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

• **new RedisStateStore**\<`M`, `F`, `S`\>(`config?`): [`RedisStateStore`](purista_redis_state_store.RedisStateStore.md)\<`M`, `F`, `S`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | extends `RedisModules` = `RedisModules` |
| `F` | extends `RedisFunctions` = `RedisFunctions` |
| `S` | extends `RedisScripts` = `RedisScripts` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `Object` | - |
| `config.cacheTtl?` | `number` | Cache time to live in ms |
| `config.config?` | `RedisClientOptions`\<`M`, `F`, `S`\> | - |
| `config.enableCache?` | `boolean` | Enable cache |
| `config.enableGet?` | `boolean` | Enable generally get method |
| `config.enableRemove?` | `boolean` | Enable generally remove method |
| `config.enableSet?` | `boolean` | Enable generally set method |
| `config.logLevel?` | `LogLevelName` | A log level for new logger if logger is not set |
| `config.logger?` | `Logger` | A logger instance |

#### Returns

[`RedisStateStore`](purista_redis_state_store.RedisStateStore.md)\<`M`, `F`, `S`\>

#### Overrides

StateStoreBaseClass\&lt;RedisStoreConfig\&lt;M, F, S\&gt;\&gt;.constructor

#### Defined in

[redis-state-store/src/RedisStateStore.impl.ts:45](https://github.com/sebastianwessel/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L45)

## Properties

### client

• **client**: `RedisClientType`\<`M`, `F`, `S`\>

#### Defined in

[redis-state-store/src/RedisStateStore.impl.ts:43](https://github.com/sebastianwessel/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L43)

___

### config

• **config**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheTtl?` | `number` | Cache time to live in ms |
| `config?` | `RedisClientOptions`\<`M`, `F`, `S`\> | - |
| `enableCache?` | `boolean` | Enable cache |
| `enableGet?` | `boolean` | Enable generally get method |
| `enableRemove?` | `boolean` | Enable generally remove method |
| `enableSet?` | `boolean` | Enable generally set method |
| `logLevel?` | `LogLevelName` | A log level for new logger if logger is not set |
| `logger?` | `Logger` | A logger instance |

#### Inherited from

StateStoreBaseClass.config

#### Defined in

core/lib/types/core/StateStore/StateStoreBaseClass.impl.d.ts:10

___

### logger

• **logger**: `Logger`

#### Inherited from

StateStoreBaseClass.logger

#### Defined in

core/lib/types/core/StateStore/StateStoreBaseClass.impl.d.ts:9

___

### name

• **name**: `string`

#### Inherited from

StateStoreBaseClass.name

#### Defined in

core/lib/types/core/StateStore/StateStoreBaseClass.impl.d.ts:11

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Overrides

StateStoreBaseClass.destroy

#### Defined in

[redis-state-store/src/RedisStateStore.impl.ts:109](https://github.com/sebastianwessel/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L109)

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

StateStoreBaseClass.getState

#### Defined in

[redis-state-store/src/RedisStateStore.impl.ts:51](https://github.com/sebastianwessel/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L51)

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

StateStoreBaseClass.removeState

#### Defined in

[redis-state-store/src/RedisStateStore.impl.ts:74](https://github.com/sebastianwessel/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L74)

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

StateStoreBaseClass.setState

#### Defined in

[redis-state-store/src/RedisStateStore.impl.ts:92](https://github.com/sebastianwessel/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L92)
