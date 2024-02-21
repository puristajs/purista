[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / DefaultConfigStore

# Class: DefaultConfigStore

[@purista/core](../modules/purista_core.md).DefaultConfigStore

The DefaultConfigStore is a placeholder which offers all needed methods.
Getters and setters will throw a UnhandledError with status `Unauthorized`, when a disabled operation is called.

For development and testing purpose, you can initiate the store with values.

**`Example`**

```typescript
const store = new DefaultConfigStore({
   enableGet: true,
   enableRemove: true,
   enableSet: true,
   config: {
     initialValue: 'initial',
   },
})

console.log(await store.getConfig('initialValue') // outputs: { initialValue: 'initial' }
```

## Hierarchy

- [`ConfigStoreBaseClass`](purista_core.ConfigStoreBaseClass.md)\<[`DefaultConfigStoreConfig`](../modules/purista_core.md#defaultconfigstoreconfig)\>

  ↳ **`DefaultConfigStore`**

## Implements

- [`ConfigStore`](../interfaces/purista_core.ConfigStore.md)

## Table of contents

### Constructors

- [constructor](purista_core.DefaultConfigStore.md#constructor)

### Properties

- [cache](purista_core.DefaultConfigStore.md#cache)
- [config](purista_core.DefaultConfigStore.md#config)
- [logger](purista_core.DefaultConfigStore.md#logger)
- [map](purista_core.DefaultConfigStore.md#map)
- [name](purista_core.DefaultConfigStore.md#name)

### Methods

- [destroy](purista_core.DefaultConfigStore.md#destroy)
- [getConfig](purista_core.DefaultConfigStore.md#getconfig)
- [getConfigImpl](purista_core.DefaultConfigStore.md#getconfigimpl)
- [removeConfig](purista_core.DefaultConfigStore.md#removeconfig)
- [removeConfigImpl](purista_core.DefaultConfigStore.md#removeconfigimpl)
- [setConfig](purista_core.DefaultConfigStore.md#setconfig)
- [setConfigImpl](purista_core.DefaultConfigStore.md#setconfigimpl)

## Constructors

### constructor

• **new DefaultConfigStore**(`config?`): [`DefaultConfigStore`](purista_core.DefaultConfigStore.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `Object` | - |
| `config.cacheTtl?` | `number` | Cache time to live in ms |
| `config.enableCache?` | `boolean` | Enable cache |
| `config.enableGet?` | `boolean` | Enable generally get method |
| `config.enableRemove?` | `boolean` | Enable generally remove method |
| `config.enableSet?` | `boolean` | Enable generally set method |
| `config.logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `config.logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |

#### Returns

[`DefaultConfigStore`](purista_core.DefaultConfigStore.md)

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[constructor](purista_core.ConfigStoreBaseClass.md#constructor)

#### Defined in

[DefaultConfigStore/DefaultConfigStore.impl.ts:30](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L30)

## Properties

### cache

• **cache**: [`ConfigStoreCacheMap`](../modules/purista_core.md#configstorecachemap)

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[cache](purista_core.ConfigStoreBaseClass.md#cache)

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:26](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L26)

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
| `logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[config](purista_core.ConfigStoreBaseClass.md#config)

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:22](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L22)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[logger](purista_core.ConfigStoreBaseClass.md#logger)

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:21](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L21)

___

### map

• `Private` **map**: `Map`\<`string`, `unknown`\>

#### Defined in

[DefaultConfigStore/DefaultConfigStore.impl.ts:29](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L29)

___

### name

• **name**: `string`

name of store

#### Implementation of

[ConfigStore](../interfaces/purista_core.ConfigStore.md).[name](../interfaces/purista_core.ConfigStore.md#name)

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[name](purista_core.ConfigStoreBaseClass.md#name)

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:24](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L24)

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

disconnects and shuts down the config store

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ConfigStore](../interfaces/purista_core.ConfigStore.md).[destroy](../interfaces/purista_core.ConfigStore.md#destroy)

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[destroy](purista_core.ConfigStoreBaseClass.md#destroy)

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:126](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L126)

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

#### Implementation of

ConfigStore.getConfig

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[getConfig](purista_core.ConfigStoreBaseClass.md#getconfig)

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:62](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L62)

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

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[getConfigImpl](purista_core.ConfigStoreBaseClass.md#getconfigimpl)

#### Defined in

[DefaultConfigStore/DefaultConfigStore.impl.ts:40](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L40)

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

#### Implementation of

ConfigStore.removeConfig

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[removeConfig](purista_core.ConfigStoreBaseClass.md#removeconfig)

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:89](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L89)

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

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[removeConfigImpl](purista_core.ConfigStoreBaseClass.md#removeconfigimpl)

#### Defined in

[DefaultConfigStore/DefaultConfigStore.impl.ts:61](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L61)

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

#### Implementation of

ConfigStore.setConfig

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[setConfig](purista_core.ConfigStoreBaseClass.md#setconfig)

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:116](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L116)

___

### setConfigImpl

▸ **setConfigImpl**(`configName`, `configValue`): `Promise`\<`void`\>

This method must be overwritten by actual store implementation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `configName` | `string` |
| `configValue` | `unknown` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[setConfigImpl](purista_core.ConfigStoreBaseClass.md#setconfigimpl)

#### Defined in

[DefaultConfigStore/DefaultConfigStore.impl.ts:57](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L57)
