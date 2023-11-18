[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/dapr-sdk](../modules/purista_dapr_sdk.md) / DaprConfigStore

# Class: DaprConfigStore

[@purista/dapr-sdk](../modules/purista_dapr_sdk.md).DaprConfigStore

DaprConfigStore is an adapter which connects to the config store provided by the underlaying Dapr infrastructure

## Hierarchy

- `ConfigStoreBaseClass`\<[`DaprConfigStoreConfig`](../modules/purista_dapr_sdk.md#daprconfigstoreconfig)\>

  ↳ **`DaprConfigStore`**

## Table of contents

### Constructors

- [constructor](purista_dapr_sdk.DaprConfigStore.md#constructor)

### Properties

- [client](purista_dapr_sdk.DaprConfigStore.md#client)
- [config](purista_dapr_sdk.DaprConfigStore.md#config)
- [logger](purista_dapr_sdk.DaprConfigStore.md#logger)
- [name](purista_dapr_sdk.DaprConfigStore.md#name)

### Methods

- [destroy](purista_dapr_sdk.DaprConfigStore.md#destroy)
- [getConfig](purista_dapr_sdk.DaprConfigStore.md#getconfig)
- [removeConfig](purista_dapr_sdk.DaprConfigStore.md#removeconfig)
- [setConfig](purista_dapr_sdk.DaprConfigStore.md#setconfig)

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
| `config.logLevel?` | `LogLevelName` | A log level for new logger if logger is not set |
| `config.logger?` | `Logger` | A logger instance |

#### Returns

[`DaprConfigStore`](purista_dapr_sdk.DaprConfigStore.md)

#### Overrides

ConfigStoreBaseClass\&lt;DaprConfigStoreConfig\&gt;.constructor

#### Defined in

[dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts:17](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts#L17)

## Properties

### client

• `Private` **client**: `HttpClient`\<[`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig)\>

#### Defined in

[dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts:15](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts#L15)

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

▸ **destroy**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

ConfigStoreBaseClass.destroy

#### Defined in

core/lib/types/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:16

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

ConfigStoreBaseClass.getConfig

#### Defined in

[dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts:52](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts#L52)

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

ConfigStoreBaseClass.removeConfig

#### Defined in

[dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts:88](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts#L88)

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

ConfigStoreBaseClass.setConfig

#### Defined in

[dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts:80](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts#L80)
