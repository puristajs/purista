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

[DefaultConfigStore/DefaultConfigStore.impl.ts:29](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L29)

## Properties

### cache

• **cache**: [`ConfigStoreCacheMap`](../modules/purista_core.md#configstorecachemap)

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[cache](purista_core.ConfigStoreBaseClass.md#cache)

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:18](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L18)

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

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:14](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L14)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[logger](purista_core.ConfigStoreBaseClass.md#logger)

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:13](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L13)

___

### map

• `Private` **map**: `Map`\<`string`, `unknown`\>

#### Defined in

[DefaultConfigStore/DefaultConfigStore.impl.ts:28](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L28)

___

### name

• **name**: `string`

name of store

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[name](purista_core.ConfigStoreBaseClass.md#name)

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:16](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L16)

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

disconnects and shuts down the config store

#### Returns

`Promise`\<`void`\>

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[destroy](purista_core.ConfigStoreBaseClass.md#destroy)

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

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[getConfig](purista_core.ConfigStoreBaseClass.md#getconfig)

#### Defined in

[DefaultConfigStore/DefaultConfigStore.impl.ts:41](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L41)

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

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[removeConfig](purista_core.ConfigStoreBaseClass.md#removeconfig)

#### Defined in

[DefaultConfigStore/DefaultConfigStore.impl.ts:61](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L61)

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

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[setConfig](purista_core.ConfigStoreBaseClass.md#setconfig)

#### Defined in

[DefaultConfigStore/DefaultConfigStore.impl.ts:53](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L53)

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

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:66](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L66)
