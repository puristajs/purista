[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/aws-config-store](../modules/purista_aws_config_store.md) / AWSConfigStore

# Class: AWSConfigStore

[@purista/aws-config-store](../modules/purista_aws_config_store.md).AWSConfigStore

The config store adapter for AWS System Manager.
It will store, retrive, update or remove configs in AWS System Manager.

For performance reasons, and to reduce costs, the config values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.
If the cache is enabled, you can set the ttl for cached config values via config cacheTtl (in ms).

This will return the cached config if available and if ttl is not exceeded.
If a config value exceeds the ttl, it does not automatically get removed from cache.
It will be removed/overwritten on next get request.

## Hierarchy

- [`ConfigStoreBaseClass`](purista_core.ConfigStoreBaseClass.md)\<[`AWSConfigStoreConfig`](../modules/purista_aws_config_store.md#awsconfigstoreconfig)\>

  ↳ **`AWSConfigStore`**

## Table of contents

### Constructors

- [constructor](purista_aws_config_store.AWSConfigStore.md#constructor)

### Properties

- [cache](purista_aws_config_store.AWSConfigStore.md#cache)
- [client](purista_aws_config_store.AWSConfigStore.md#client)
- [config](purista_aws_config_store.AWSConfigStore.md#config)
- [logger](purista_aws_config_store.AWSConfigStore.md#logger)
- [name](purista_aws_config_store.AWSConfigStore.md#name)

### Methods

- [destroy](purista_aws_config_store.AWSConfigStore.md#destroy)
- [getConfig](purista_aws_config_store.AWSConfigStore.md#getconfig)
- [getConfigImpl](purista_aws_config_store.AWSConfigStore.md#getconfigimpl)
- [removeConfig](purista_aws_config_store.AWSConfigStore.md#removeconfig)
- [removeConfigImpl](purista_aws_config_store.AWSConfigStore.md#removeconfigimpl)
- [setConfig](purista_aws_config_store.AWSConfigStore.md#setconfig)
- [setConfigImpl](purista_aws_config_store.AWSConfigStore.md#setconfigimpl)

## Constructors

### constructor

• **new AWSConfigStore**(`config`): [`AWSConfigStore`](purista_aws_config_store.AWSConfigStore.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Object` | - |
| `config.cacheTtl?` | `number` | Cache time to live in ms |
| `config.client` | `SSMClientConfig` | AWS client options |
| `config.enableCache?` | `boolean` | Enable cache |
| `config.enableGet?` | `boolean` | Enable generally get method |
| `config.enableRemove?` | `boolean` | Enable generally remove method |
| `config.enableSet?` | `boolean` | Enable generally set method |
| `config.logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `config.logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |

#### Returns

[`AWSConfigStore`](purista_aws_config_store.AWSConfigStore.md)

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[constructor](purista_core.ConfigStoreBaseClass.md#constructor)

#### Defined in

[aws-config-store/src/AWSConfigStore.impl.ts:29](https://github.com/sebastianwessel/purista/blob/master/packages/aws-config-store/src/AWSConfigStore.impl.ts#L29)

## Properties

### cache

• **cache**: [`ConfigStoreCacheMap`](../modules/purista_core.md#configstorecachemap)

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[cache](purista_core.ConfigStoreBaseClass.md#cache)

#### Defined in

core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:12

___

### client

• **client**: `SSMClient`

#### Defined in

[aws-config-store/src/AWSConfigStore.impl.ts:27](https://github.com/sebastianwessel/purista/blob/master/packages/aws-config-store/src/AWSConfigStore.impl.ts#L27)

___

### config

• **config**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheTtl?` | `number` | Cache time to live in ms |
| `client` | `SSMClientConfig` | AWS client options |
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

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[getConfig](purista_core.ConfigStoreBaseClass.md#getconfig)

#### Defined in

core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:15

___

### getConfigImpl

▸ **getConfigImpl**(`...configNames`): `Promise`\<`Record`\<`string`, `undefined` \| `string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...configNames` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `undefined` \| `string`\>\>

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[getConfigImpl](purista_core.ConfigStoreBaseClass.md#getconfigimpl)

#### Defined in

[aws-config-store/src/AWSConfigStore.impl.ts:34](https://github.com/sebastianwessel/purista/blob/master/packages/aws-config-store/src/AWSConfigStore.impl.ts#L34)

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

▸ **removeConfigImpl**(`configName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `configName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[removeConfigImpl](purista_core.ConfigStoreBaseClass.md#removeconfigimpl)

#### Defined in

[aws-config-store/src/AWSConfigStore.impl.ts:55](https://github.com/sebastianwessel/purista/blob/master/packages/aws-config-store/src/AWSConfigStore.impl.ts#L55)

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

▸ **setConfigImpl**(`configName`, `configValue`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `configName` | `string` |
| `configValue` | `string` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[setConfigImpl](purista_core.ConfigStoreBaseClass.md#setconfigimpl)

#### Defined in

[aws-config-store/src/AWSConfigStore.impl.ts:63](https://github.com/sebastianwessel/purista/blob/master/packages/aws-config-store/src/AWSConfigStore.impl.ts#L63)
