[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/dapr-sdk](../modules/purista_dapr_sdk.md) / DaprConfigStore

# Class: DaprConfigStore

[@purista/dapr-sdk](../modules/purista_dapr_sdk.md).DaprConfigStore

DaprConfigStore is an adapter which connects to the config store provided by the underlaying Dapr infrastructure

## Hierarchy

- [`ConfigStoreBaseClass`](purista_core.ConfigStoreBaseClass.md)\<[`DaprConfigStoreConfig`](../modules/purista_dapr_sdk.md#daprconfigstoreconfig)\>

  ↳ **`DaprConfigStore`**

## Table of contents

### Constructors

- [constructor](purista_dapr_sdk.DaprConfigStore.md#constructor)

### Properties

- [cache](purista_dapr_sdk.DaprConfigStore.md#cache)
- [client](purista_dapr_sdk.DaprConfigStore.md#client)
- [config](purista_dapr_sdk.DaprConfigStore.md#config)
- [logger](purista_dapr_sdk.DaprConfigStore.md#logger)
- [name](purista_dapr_sdk.DaprConfigStore.md#name)

### Methods

- [destroy](purista_dapr_sdk.DaprConfigStore.md#destroy)
- [getConfig](purista_dapr_sdk.DaprConfigStore.md#getconfig)
- [getConfigImpl](purista_dapr_sdk.DaprConfigStore.md#getconfigimpl)
- [removeConfig](purista_dapr_sdk.DaprConfigStore.md#removeconfig)
- [removeConfigImpl](purista_dapr_sdk.DaprConfigStore.md#removeconfigimpl)
- [setConfig](purista_dapr_sdk.DaprConfigStore.md#setconfig)
- [setConfigImpl](purista_dapr_sdk.DaprConfigStore.md#setconfigimpl)

## Constructors

### constructor

• **new DaprConfigStore**(`config?`): [`DaprConfigStore`](purista_dapr_sdk.DaprConfigStore.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `Object` | - |
| `config.cacheTtl?` | `number` | Cache time to live in ms |
| `config.clientConfig?` | [`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig) | The Dapr client config to interact with Dapr sidecar |
| `config.configStoreName?` | `string` | The name of the config store |
| `config.enableCache?` | `boolean` | Enable cache |
| `config.enableGet?` | `boolean` | Enable generally get method |
| `config.enableRemove?` | `boolean` | Enable generally remove method |
| `config.enableSet?` | `boolean` | Enable generally set method |
| `config.logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `config.logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |

#### Returns

[`DaprConfigStore`](purista_dapr_sdk.DaprConfigStore.md)

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[constructor](purista_core.ConfigStoreBaseClass.md#constructor)

#### Defined in

[dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts#L19)

## Properties

### cache

• **cache**: [`ConfigStoreCacheMap`](../modules/purista_core.md#configstorecachemap)

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[cache](purista_core.ConfigStoreBaseClass.md#cache)

#### Defined in

core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:12

___

### client

• `Private` **client**: [`HttpClient`](purista_core.HttpClient.md)\<[`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig)\>

#### Defined in

[dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts:17](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts#L17)

___

### config

• **config**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheTtl?` | `number` | Cache time to live in ms |
| `clientConfig?` | [`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig) | The Dapr client config to interact with Dapr sidecar |
| `configStoreName?` | `string` | The name of the config store |
| `enableCache?` | `boolean` | Enable cache |
| `enableGet?` | `boolean` | Enable generally get method |
| `enableRemove?` | `boolean` | Enable generally remove method |
| `enableSet?` | `boolean` | Enable generally set method |
| `logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[config](purista_core.ConfigStoreBaseClass.md#config)

#### Defined in

core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:10

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

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

disconnects and shuts down the config store

#### Returns

`Promise`\<`void`\>

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[destroy](purista_core.ConfigStoreBaseClass.md#destroy)

#### Defined in

core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:20

___

### getConfig

▸ **getConfig**(`...configNames`): `Promise`\<`Record`\<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...configNames` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[getConfig](purista_core.ConfigStoreBaseClass.md#getconfig)

#### Defined in

[dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts:54](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts#L54)

___

### getConfigImpl

▸ **getConfigImpl**(`..._configNames`): `Promise`\<`Record`\<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `..._configNames` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[getConfigImpl](purista_core.ConfigStoreBaseClass.md#getconfigimpl)

#### Defined in

core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:14

___

### removeConfig

▸ **removeConfig**(`_configName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_configName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[removeConfig](purista_core.ConfigStoreBaseClass.md#removeconfig)

#### Defined in

[dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts:90](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts#L90)

___

### removeConfigImpl

▸ **removeConfigImpl**(`_configName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_configName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[removeConfigImpl](purista_core.ConfigStoreBaseClass.md#removeconfigimpl)

#### Defined in

core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:16

___

### setConfig

▸ **setConfig**(`_configName`, `_configValue`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_configName` | `string` |
| `_configValue` | `unknown` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[setConfig](purista_core.ConfigStoreBaseClass.md#setconfig)

#### Defined in

[dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts:82](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts#L82)

___

### setConfigImpl

▸ **setConfigImpl**(`_configName`, `_configValue`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_configName` | `string` |
| `_configValue` | `unknown` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[setConfigImpl](purista_core.ConfigStoreBaseClass.md#setconfigimpl)

#### Defined in

core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:18
