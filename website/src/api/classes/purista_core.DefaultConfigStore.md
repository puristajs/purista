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
- [map](purista_core.DefaultConfigStore.md#map)
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
| `config?` | [`StoreBaseConfig`](../modules/purista_core.md#storebaseconfig)<[`DefaultConfigStoreConfig`](../modules/purista_core.md#defaultconfigstoreconfig)\> |

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[constructor](purista_core.ConfigStoreBaseClass.md#constructor)

#### Defined in

[packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts:27](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L27)

## Properties

### config

• **config**: [`StoreBaseConfig`](../modules/purista_core.md#storebaseconfig)<[`DefaultConfigStoreConfig`](../modules/purista_core.md#defaultconfigstoreconfig)\>

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[config](purista_core.ConfigStoreBaseClass.md#config)

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:13](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L13)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[logger](purista_core.ConfigStoreBaseClass.md#logger)

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:12](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L12)

___

### map

• `Private` **map**: `Map`<`string`, `unknown`\>

#### Defined in

[packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts:26](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L26)

___

### name

• **name**: `string`

name of store

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[name](purista_core.ConfigStoreBaseClass.md#name)

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:15](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L15)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

disconnects and shuts down the config store

#### Returns

`Promise`<`void`\>

#### Inherited from

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[destroy](purista_core.ConfigStoreBaseClass.md#destroy)

#### Defined in

[packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:61](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L61)

___

### getConfig

▸ **getConfig**(`...configNames`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...configNames` | `string`[] |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[getConfig](purista_core.ConfigStoreBaseClass.md#getconfig)

#### Defined in

[packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts:39](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L39)

___

### removeConfig

▸ **removeConfig**(`configName`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `configName` | `string` |

#### Returns

`Promise`<`void`\>

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[removeConfig](purista_core.ConfigStoreBaseClass.md#removeconfig)

#### Defined in

[packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts:59](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L59)

___

### setConfig

▸ **setConfig**(`configName`, `configValue`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `configName` | `string` |
| `configValue` | `unknown` |

#### Returns

`Promise`<`void`\>

#### Overrides

[ConfigStoreBaseClass](purista_core.ConfigStoreBaseClass.md).[setConfig](purista_core.ConfigStoreBaseClass.md#setconfig)

#### Defined in

[packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts:51](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L51)
