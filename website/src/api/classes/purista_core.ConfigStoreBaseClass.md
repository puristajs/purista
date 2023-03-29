[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / ConfigStoreBaseClass

# Class: ConfigStoreBaseClass<ConfigType\>

[@purista/core](../modules/purista_core.md).ConfigStoreBaseClass

Base class for config store adapters

## Type parameters

| Name |
| :------ |
| `ConfigType` |

## Hierarchy

- **`ConfigStoreBaseClass`**

  ↳ [`DefaultConfigStore`](purista_core.DefaultConfigStore.md)

## Implements

- [`ConfigStore`](../interfaces/purista_core.ConfigStore.md)

## Table of contents

### Constructors

- [constructor](purista_core.ConfigStoreBaseClass.md#constructor)

### Properties

- [config](purista_core.ConfigStoreBaseClass.md#config)
- [logger](purista_core.ConfigStoreBaseClass.md#logger)
- [name](purista_core.ConfigStoreBaseClass.md#name)

### Methods

- [destroy](purista_core.ConfigStoreBaseClass.md#destroy)
- [getConfig](purista_core.ConfigStoreBaseClass.md#getconfig)
- [removeConfig](purista_core.ConfigStoreBaseClass.md#removeconfig)
- [setConfig](purista_core.ConfigStoreBaseClass.md#setconfig)

## Constructors

### constructor

• **new ConfigStoreBaseClass**<`ConfigType`\>(`name`, `config?`)

#### Type parameters

| Name |
| :------ |
| `ConfigType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `config?` | [`StoreBaseConfig`](../modules/purista_core.md#storebaseconfig)<`ConfigType`\> |

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:17](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L17)

## Properties

### config

• **config**: [`StoreBaseConfig`](../modules/purista_core.md#storebaseconfig)<`ConfigType`\>

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:13](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L13)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:12](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L12)

___

### name

• **name**: `string`

name of store

#### Implementation of

[ConfigStore](../interfaces/purista_core.ConfigStore.md).[name](../interfaces/purista_core.ConfigStore.md#name)

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:15](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L15)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

disconnects and shuts down the config store

#### Returns

`Promise`<`void`\>

#### Implementation of

[ConfigStore](../interfaces/purista_core.ConfigStore.md).[destroy](../interfaces/purista_core.ConfigStore.md#destroy)

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:61](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L61)

___

### getConfig

▸ **getConfig**(`..._configNames`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `..._configNames` | `string`[] |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Implementation of

ConfigStore.getConfig

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:31](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L31)

___

### removeConfig

▸ **removeConfig**(`_configName`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_configName` | `string` |

#### Returns

`Promise`<`void`\>

#### Implementation of

ConfigStore.removeConfig

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:41](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L41)

___

### setConfig

▸ **setConfig**(`_configName`, `_configValue`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_configName` | `string` |
| `_configValue` | `unknown` |

#### Returns

`Promise`<`void`\>

#### Implementation of

ConfigStore.setConfig

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:51](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L51)
