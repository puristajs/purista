[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/nats-config-store](../modules/purista_nats_config_store.md) / NatsConfigStore

# Class: NatsConfigStore

[@purista/nats-config-store](../modules/purista_nats_config_store.md).NatsConfigStore

A config store for using NATS (with JetStream) as storage.
JetStream must be enabled at the NATS broker.

**`Example`**

* ```typescript
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

## Hierarchy

- [`ConfigStoreBaseClass`](purista_core.ConfigStoreBaseClass.md)\<[`NatsConfigStoreConfig`](../modules/purista_nats_config_store.md#natsconfigstoreconfig)\>

  ↳ **`NatsConfigStore`**

## Table of contents

### Constructors

- [constructor](purista_nats_config_store.NatsConfigStore.md#constructor)

### Properties

- [cache](purista_nats_config_store.NatsConfigStore.md#cache)
- [config](purista_nats_config_store.NatsConfigStore.md#config)
- [connection](purista_nats_config_store.NatsConfigStore.md#connection)
- [kv](purista_nats_config_store.NatsConfigStore.md#kv)
- [logger](purista_nats_config_store.NatsConfigStore.md#logger)
- [name](purista_nats_config_store.NatsConfigStore.md#name)
- [sc](purista_nats_config_store.NatsConfigStore.md#sc)

### Methods

- [destroy](purista_nats_config_store.NatsConfigStore.md#destroy)
- [getConfig](purista_nats_config_store.NatsConfigStore.md#getconfig)
- [getConfigImpl](purista_nats_config_store.NatsConfigStore.md#getconfigimpl)
- [getStore](purista_nats_config_store.NatsConfigStore.md#getstore)
- [removeConfig](purista_nats_config_store.NatsConfigStore.md#removeconfig)
- [removeConfigImpl](purista_nats_config_store.NatsConfigStore.md#removeconfigimpl)
- [setConfig](purista_nats_config_store.NatsConfigStore.md#setconfig)
- [setConfigImpl](purista_nats_config_store.NatsConfigStore.md#setconfigimpl)

## Constructors

### constructor

• **new NatsConfigStore**(`config?`): [`NatsConfigStore`](purista_nats_config_store.NatsConfigStore.md)

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

[`NatsConfigStore`](purista_nats_config_store.NatsConfigStore.md)

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[constructor](purista_core.ConfigStoreBaseClass.md#constructor)

#### Defined in

[nats-config-store/src/NatsConfigStore.impl.ts:37](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L37)

## Properties

### cache

• **cache**: [`ConfigStoreCacheMap`](../modules/purista_core.md#configstorecachemap)

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[cache](purista_core.ConfigStoreBaseClass.md#cache)

#### Defined in

core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:12

___

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

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[config](purista_core.ConfigStoreBaseClass.md#config)

#### Defined in

core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:10

___

### connection

• **connection**: `undefined` \| `NatsConnection`

#### Defined in

[nats-config-store/src/NatsConfigStore.impl.ts:32](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L32)

___

### kv

• **kv**: `undefined` \| `KV`

#### Defined in

[nats-config-store/src/NatsConfigStore.impl.ts:35](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L35)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[logger](purista_core.ConfigStoreBaseClass.md#logger)

#### Defined in

core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:9

___

### name

• **name**: `string`

name of store

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[name](purista_core.ConfigStoreBaseClass.md#name)

#### Defined in

core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:11

___

### sc

• **sc**: `Codec`\<`unknown`\>

#### Defined in

[nats-config-store/src/NatsConfigStore.impl.ts:34](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L34)

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

disconnects and shuts down the config store

#### Returns

`Promise`\<`void`\>

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[destroy](purista_core.ConfigStoreBaseClass.md#destroy)

#### Defined in

[nats-config-store/src/NatsConfigStore.impl.ts:114](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L114)

___

### getConfig

▸ **getConfig**(`...configNames`): `Promise`\<`Record`\<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...configNames` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[getConfig](purista_core.ConfigStoreBaseClass.md#getconfig)

#### Defined in

core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:15

___

### getConfigImpl

▸ **getConfigImpl**(`...stateNames`): `Promise`\<`Record`\<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...stateNames` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[getConfigImpl](purista_core.ConfigStoreBaseClass.md#getconfigimpl)

#### Defined in

[nats-config-store/src/NatsConfigStore.impl.ts:73](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L73)

___

### getStore

▸ **getStore**(): `Promise`\<`KV`\>

#### Returns

`Promise`\<`KV`\>

#### Defined in

[nats-config-store/src/NatsConfigStore.impl.ts:45](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L45)

___

### removeConfig

▸ **removeConfig**(`configName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `configName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[removeConfig](purista_core.ConfigStoreBaseClass.md#removeconfig)

#### Defined in

core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:17

___

### removeConfigImpl

▸ **removeConfigImpl**(`stateName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[removeConfigImpl](purista_core.ConfigStoreBaseClass.md#removeconfigimpl)

#### Defined in

[nats-config-store/src/NatsConfigStore.impl.ts:90](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L90)

___

### setConfig

▸ **setConfig**(`configName`, `configValue`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `configName` | `string` |
| `configValue` | `unknown` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[setConfig](purista_core.ConfigStoreBaseClass.md#setconfig)

#### Defined in

core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:19

___

### setConfigImpl

▸ **setConfigImpl**(`stateName`, `stateValue`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |
| `stateValue` | `unknown` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[setConfigImpl](purista_core.ConfigStoreBaseClass.md#setconfigimpl)

#### Defined in

[nats-config-store/src/NatsConfigStore.impl.ts:102](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L102)
