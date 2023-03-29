[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / DefaultStateStore

# Class: DefaultStateStore

[@purista/core](../modules/purista_core.md).DefaultStateStore

The DefaultStateStore is a placeholder which offers all needed methods.
Getters and setters will throw a UnhandledError with status `Not implemented`

## Hierarchy

- [`StateStoreBaseClass`](purista_core.StateStoreBaseClass.md)<[`DefaultStateStoreConfig`](../modules/purista_core.md#defaultstatestoreconfig)\>

  ↳ **`DefaultStateStore`**

## Table of contents

### Constructors

- [constructor](purista_core.DefaultStateStore.md#constructor)

### Properties

- [config](purista_core.DefaultStateStore.md#config)
- [logger](purista_core.DefaultStateStore.md#logger)
- [map](purista_core.DefaultStateStore.md#map)
- [name](purista_core.DefaultStateStore.md#name)

### Methods

- [destroy](purista_core.DefaultStateStore.md#destroy)
- [getState](purista_core.DefaultStateStore.md#getstate)
- [removeState](purista_core.DefaultStateStore.md#removestate)
- [setState](purista_core.DefaultStateStore.md#setstate)

## Constructors

### constructor

• **new DefaultStateStore**(`config?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`StoreBaseConfig`](../modules/purista_core.md#storebaseconfig)<[`DefaultStateStoreConfig`](../modules/purista_core.md#defaultstatestoreconfig)\> |

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[constructor](purista_core.StateStoreBaseClass.md#constructor)

#### Defined in

[packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts:13](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L13)

## Properties

### config

• **config**: [`StoreBaseConfig`](../modules/purista_core.md#storebaseconfig)<[`DefaultStateStoreConfig`](../modules/purista_core.md#defaultstatestoreconfig)\>

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[config](purista_core.StateStoreBaseClass.md#config)

#### Defined in

[packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:13](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L13)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[logger](purista_core.StateStoreBaseClass.md#logger)

#### Defined in

[packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:12](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L12)

___

### map

• `Private` **map**: `Map`<`string`, `unknown`\>

#### Defined in

[packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts:12](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L12)

___

### name

• **name**: `string`

name of store

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[name](purista_core.StateStoreBaseClass.md#name)

#### Defined in

[packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:15](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L15)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

disconnects and shuts down the state store

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[destroy](purista_core.StateStoreBaseClass.md#destroy)

#### Defined in

[packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:64](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L64)

___

### getState

▸ **getState**(`...stateNames`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...stateNames` | `string`[] |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[getState](purista_core.StateStoreBaseClass.md#getstate)

#### Defined in

[packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts:25](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L25)

___

### removeState

▸ **removeState**(`stateName`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |

#### Returns

`Promise`<`void`\>

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[removeState](purista_core.StateStoreBaseClass.md#removestate)

#### Defined in

[packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts:45](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L45)

___

### setState

▸ **setState**(`stateName`, `stateValue`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |
| `stateValue` | `unknown` |

#### Returns

`Promise`<`void`\>

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[setState](purista_core.StateStoreBaseClass.md#setstate)

#### Defined in

[packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts:37](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L37)
