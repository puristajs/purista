[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / ConfigStoreBaseClass

# Class: ConfigStoreBaseClass\<ConfigStoreConfigType\>

[@purista/core](../modules/purista_core.md).ConfigStoreBaseClass

Base class for config store adapters.
The actual store implementation must overwrite the protected methods:

- `getConfigImpl`
- `setConfigImpl`
- `removeConfigImpl`

__DO NOT OVERWRITE__: the regular methods getConfig, setConfig or removeConfig

## Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigStoreConfigType` | extends `Record`\<`string`, `unknown`\> = {} |

## Hierarchy

- **`ConfigStoreBaseClass`**

  ↳ [`DefaultConfigStore`](purista_core.DefaultConfigStore.md)

## Table of contents

### Constructors

- [constructor](purista_core.ConfigStoreBaseClass.md#constructor)

### Properties

- [cache](purista_core.ConfigStoreBaseClass.md#cache)
- [config](purista_core.ConfigStoreBaseClass.md#config)
- [logger](purista_core.ConfigStoreBaseClass.md#logger)
- [name](purista_core.ConfigStoreBaseClass.md#name)

### Methods

- [destroy](purista_core.ConfigStoreBaseClass.md#destroy)
- [getConfig](purista_core.ConfigStoreBaseClass.md#getconfig)
- [getConfigImpl](purista_core.ConfigStoreBaseClass.md#getconfigimpl)
- [removeConfig](purista_core.ConfigStoreBaseClass.md#removeconfig)
- [removeConfigImpl](purista_core.ConfigStoreBaseClass.md#removeconfigimpl)
- [setConfig](purista_core.ConfigStoreBaseClass.md#setconfig)
- [setConfigImpl](purista_core.ConfigStoreBaseClass.md#setconfigimpl)

## Constructors

### constructor

• **new ConfigStoreBaseClass**\<`ConfigStoreConfigType`\>(`name`, `config`): [`ConfigStoreBaseClass`](purista_core.ConfigStoreBaseClass.md)\<`ConfigStoreConfigType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigStoreConfigType` | extends `Record`\<`string`, `unknown`\> = {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `config` | \{ [K in string \| number \| symbol]: (Object & ConfigStoreConfigType)[K] } |

#### Returns

[`ConfigStoreBaseClass`](purista_core.ConfigStoreBaseClass.md)\<`ConfigStoreConfigType`\>

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L28)

## Properties

### cache

• **cache**: [`ConfigStoreCacheMap`](../modules/purista_core.md#configstorecachemap)

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L26)

___

### config

• **config**: \{ [K in string \| number \| symbol]: (Object & ConfigStoreConfigType)[K] }

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L22)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L21)

___

### name

• **name**: `string`

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L24)

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:126](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L126)

___

### getConfig

▸ **getConfig**\<`ConfigNames`\>(`...configNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`ConfigNames`\>\>

Returns the values for given config properties.
This function **SHOULD NOT** be overwritten by store implementation.
For implementation overwrite protected `getConfigImpl`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigNames` | extends `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...configNames` | `ConfigNames` |

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`ConfigNames`\>\>

an object of { [configName]: value | undefined }

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:62](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L62)

___

### getConfigImpl

▸ **getConfigImpl**\<`ConfigNames`\>(`...configNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`ConfigNames`\>\>

This method must be overwritten by actual store implementation.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigNames` | extends `string`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...configNames` | `ConfigNames` | list of config items |

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`ConfigNames`\>\>

an object of { [configName]: value | undefined }

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:49](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L49)

___

### removeConfig

▸ **removeConfig**(`configName`): `Promise`\<`void`\>

Removes the config item given by config name.
This function **SHOULD NOT** be overwritten by store implementation.
For implementation overwrite protected `removeConfigImpl`

#### Parameters

| Name | Type |
| :------ | :------ |
| `configName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:89](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L89)

___

### removeConfigImpl

▸ **removeConfigImpl**(`configName`): `Promise`\<`void`\>

This method must be overwritten by actual store implementation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `configName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:79](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L79)

___

### setConfig

▸ **setConfig**(`configName`, `configValue`): `Promise`\<`void`\>

Sets a config value
This function **SHOULD NOT** be overwritten by store implementation.
For implementation overwrite protected `setConfigImpl`

#### Parameters

| Name | Type |
| :------ | :------ |
| `configName` | `string` |
| `configValue` | `unknown` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:116](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L116)

___

### setConfigImpl

▸ **setConfigImpl**(`_configName`, `_configValue`): `Promise`\<`void`\>

This method must be overwritten by actual store implementation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `_configName` | `string` |
| `_configValue` | `unknown` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:105](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L105)
