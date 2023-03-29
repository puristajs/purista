[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / DefaultConfigStore

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

- [`ConfigStoreBaseClass`](purista_core.ConfigStoreBaseClass.md)<[`DefaultConfigStoreConfig`](../modules/purista_core.md#defaultconfigstoreconfig)\>

  ↳ **`DefaultConfigStore`**

## Table of contents

### Constructors

- [constructor](purista_core.DefaultConfigStore.md#constructor)

### Properties

- [config](purista_core.DefaultConfigStore.md#config)
- [logger](purista_core.DefaultConfigStore.md#logger)
- [name](purista_core.DefaultConfigStore.md#name)

### Methods

- [destroy](purista_core.DefaultConfigStore.md#destroy)
- [getConfig](purista_core.DefaultConfigStore.md#getconfig)
- [removeConfig](purista_core.DefaultConfigStore.md#removeconfig)
- [setConfig](purista_core.DefaultConfigStore.md#setconfig)

## Constructors

### constructor

• **new DefaultConfigStore**(`config?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`StoreBaseConfig`](../modules/purista_core.md#storebaseconfig)<`never`\> |

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[constructor](purista_core.ConfigStoreBaseClass.md#constructor)

#### Defined in

[packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts:26](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L26)

## Properties

### config

• **config**: [`StoreBaseConfig`](../modules/purista_core.md#storebaseconfig)<[`DefaultConfigStoreConfig`](../modules/purista_core.md#defaultconfigstoreconfig)\>

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[config](purista_core.ConfigStoreBaseClass.md#config)

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:14](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L14)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[logger](purista_core.ConfigStoreBaseClass.md#logger)

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:12](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L12)

___

### name

• **name**: `string`

name of store

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[name](purista_core.ConfigStoreBaseClass.md#name)

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:16](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L16)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

disconnects and shuts down the config store

#### Returns

`Promise`<`void`\>

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[destroy](purista_core.ConfigStoreBaseClass.md#destroy)

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:62](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L62)

___

### getConfig

▸ **getConfig**(`..._configNames`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `..._configNames` | `string`[] |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[getConfig](purista_core.ConfigStoreBaseClass.md#getconfig)

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:32](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L32)

___

### removeConfig

▸ **removeConfig**(`_configName`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_configName` | `string` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[removeConfig](purista_core.ConfigStoreBaseClass.md#removeconfig)

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:42](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L42)

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

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[setConfig](purista_core.ConfigStoreBaseClass.md#setconfig)

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:52](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L52)
