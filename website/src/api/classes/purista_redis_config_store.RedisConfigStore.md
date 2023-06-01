[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/redis-config-store](../modules/purista_redis_config_store.md) / RedisConfigStore

# Class: RedisConfigStore<M, F, S\>

[@purista/redis-config-store](../modules/purista_redis_config_store.md).RedisConfigStore

A config store for using redis as storage.
Config values are stored as stringified JSON.

Per default, setting/changing and removal of values are enabled.

**`Example`**

```typescript
const config = {
 enableGet: true, // optional, default is true
 enableRemove: true, // optional, default is true
 enableSet: true, // optional, default is true
 url: 'redis://alice:foobared@awesome.redis.server:6379'
}

const store = new RedisConfigStore({ config })

await store.setConfig('configKey',{ myConfig: 'value' })

let value = await store.getConfig('configKey')
console.log(value) // outputs: { configKey: { myConfig: 'value' } }

await store.removeConfig('configKey')

value = await store.getConfig('configKey')
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

- `ConfigStoreBaseClass`<[`RedisStoreConfig`](../modules/purista_redis_config_store.md#redisstoreconfig)<`M`, `F`, `S`\>\>

  ↳ **`RedisConfigStore`**

## Table of contents

### Constructors

- [constructor](purista_redis_config_store.RedisConfigStore.md#constructor)

### Properties

- [client](purista_redis_config_store.RedisConfigStore.md#client)
- [config](purista_redis_config_store.RedisConfigStore.md#config)
- [logger](purista_redis_config_store.RedisConfigStore.md#logger)
- [name](purista_redis_config_store.RedisConfigStore.md#name)

### Methods

- [destroy](purista_redis_config_store.RedisConfigStore.md#destroy)
- [getConfig](purista_redis_config_store.RedisConfigStore.md#getconfig)
- [removeConfig](purista_redis_config_store.RedisConfigStore.md#removeconfig)
- [setConfig](purista_redis_config_store.RedisConfigStore.md#setconfig)

## Constructors

### constructor

• **new RedisConfigStore**<`M`, `F`, `S`\>(`config?`)

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
| `config.config?` | `RedisClientOptions`<`M`, `F`, `S`\> | - |
| `config.enableGet?` | `boolean` | Enable generally get method |
| `config.enableRemove?` | `boolean` | Enable generally remove method |
| `config.enableSet?` | `boolean` | Enable generally set method |
| `config.logLevel?` | `LogLevelName` | A log level for new logger if logger is not set |
| `config.logger?` | `Logger` | A logger instance |

#### Overrides

ConfigStoreBaseClass&lt;RedisStoreConfig&lt;M, F, S\&gt;\&gt;.constructor

#### Defined in

[redis-config-store/src/RedisConfigStore.impl.ts:45](https://github.com/sebastianwessel/purista/blob/master/packages/redis-config-store/src/RedisConfigStore.impl.ts#L45)

## Properties

### client

• **client**: `RedisClientType`<`M`, `F`, `S`\>

#### Defined in

[redis-config-store/src/RedisConfigStore.impl.ts:43](https://github.com/sebastianwessel/purista/blob/master/packages/redis-config-store/src/RedisConfigStore.impl.ts#L43)

___

### config

• **config**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `RedisClientOptions`<`M`, `F`, `S`\> | - |
| `enableGet?` | `boolean` | Enable generally get method |
| `enableRemove?` | `boolean` | Enable generally remove method |
| `enableSet?` | `boolean` | Enable generally set method |
| `logLevel?` | `LogLevelName` | A log level for new logger if logger is not set |
| `logger?` | `Logger` | A logger instance |

#### Inherited from

ConfigStoreBaseClass.config

#### Defined in

core/lib/types/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:10

___

### logger

• **logger**: `Logger`

#### Inherited from

ConfigStoreBaseClass.logger

#### Defined in

core/lib/types/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:9

___

### name

• **name**: `string`

#### Inherited from

ConfigStoreBaseClass.name

#### Defined in

core/lib/types/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:11

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

ConfigStoreBaseClass.destroy

#### Defined in

[redis-config-store/src/RedisConfigStore.impl.ts:109](https://github.com/sebastianwessel/purista/blob/master/packages/redis-config-store/src/RedisConfigStore.impl.ts#L109)

___

### getConfig

▸ **getConfig**(`...configNames`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...configNames` | `string`[] |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Overrides

ConfigStoreBaseClass.getConfig

#### Defined in

[redis-config-store/src/RedisConfigStore.impl.ts:51](https://github.com/sebastianwessel/purista/blob/master/packages/redis-config-store/src/RedisConfigStore.impl.ts#L51)

___

### removeConfig

▸ **removeConfig**(`configName`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `configName` | `string` |

#### Returns

`Promise`<`void`\>

#### Overrides

ConfigStoreBaseClass.removeConfig

#### Defined in

[redis-config-store/src/RedisConfigStore.impl.ts:74](https://github.com/sebastianwessel/purista/blob/master/packages/redis-config-store/src/RedisConfigStore.impl.ts#L74)

___

### setConfig

▸ **setConfig**(`configName`, `configValue`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `configName` | `string` |
| `configValue` | `unknown` |

#### Returns

`Promise`<`void`\>

#### Overrides

ConfigStoreBaseClass.setConfig

#### Defined in

[redis-config-store/src/RedisConfigStore.impl.ts:92](https://github.com/sebastianwessel/purista/blob/master/packages/redis-config-store/src/RedisConfigStore.impl.ts#L92)
