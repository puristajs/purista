[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / ConfigStoreBaseClass

# Class: ConfigStoreBaseClass\<ConfigType\>

[@purista/core](../modules/purista_core.md).ConfigStoreBaseClass

Base class for config store adapters

## Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | extends `Record`\<`string`, `unknown`\> = {} |

## Hierarchy

- **`ConfigStoreBaseClass`**

  ↳ [`DefaultConfigStore`](purista_core.DefaultConfigStore.md)

## Implements

- [`ConfigStore`](../interfaces/purista_core.ConfigStore.md)

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

• **new ConfigStoreBaseClass**\<`ConfigType`\>(`name`, `config`): [`ConfigStoreBaseClass`](purista_core.ConfigStoreBaseClass.md)\<`ConfigType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | extends `Record`\<`string`, `unknown`\> = {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `config` | \{ [K in string \| number \| symbol]: (Object & ConfigType)[K] } |

#### Returns

[`ConfigStoreBaseClass`](purista_core.ConfigStoreBaseClass.md)\<`ConfigType`\>

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:20](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L20)

## Properties

### cache

• **cache**: [`ConfigStoreCacheMap`](../modules/purista_core.md#configstorecachemap)

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:18](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L18)

___

### config

• **config**: \{ [K in string \| number \| symbol]: (Object & ConfigType)[K] }

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:14](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L14)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:13](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L13)

___

### name

• **name**: `string`

name of store

#### Implementation of

[ConfigStore](../interfaces/purista_core.ConfigStore.md).[name](../interfaces/purista_core.ConfigStore.md#name)

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:16](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L16)

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

disconnects and shuts down the config store

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ConfigStore](../interfaces/purista_core.ConfigStore.md).[destroy](../interfaces/purista_core.ConfigStore.md#destroy)

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:82](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L82)

___

### getConfig

▸ **getConfig**(`...configNames`): `Promise`\<`Record`\<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...configNames` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

#### Implementation of

ConfigStore.getConfig

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:41](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L41)

___

### getConfigImpl

▸ **getConfigImpl**(`..._configNames`): `Promise`\<`Record`\<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `..._configNames` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:35](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L35)

___

### removeConfig

▸ **removeConfig**(`configName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `configName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

ConfigStore.removeConfig

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:56](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L56)

___

### removeConfigImpl

▸ **removeConfigImpl**(`_configName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_configName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:50](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L50)

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

#### Implementation of

ConfigStore.setConfig

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:72](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L72)

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

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:66](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L66)
