[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / StateStoreBaseClass

# Class: StateStoreBaseClass<ConfigType\>

[@purista/core](../modules/purista_core.md).StateStoreBaseClass

Base class for config store implementations

## Type parameters

| Name |
| :------ |
| `ConfigType` |

## Hierarchy

- **`StateStoreBaseClass`**

  ↳ [`DefaultStateStore`](purista_core.DefaultStateStore.md)

## Implements

- [`StateStore`](../interfaces/purista_core.StateStore.md)

## Table of contents

### Constructors

- [constructor](purista_core.StateStoreBaseClass.md#constructor)

### Properties

- [config](purista_core.StateStoreBaseClass.md#config)
- [logger](purista_core.StateStoreBaseClass.md#logger)
- [name](purista_core.StateStoreBaseClass.md#name)

### Methods

- [destroy](purista_core.StateStoreBaseClass.md#destroy)
- [getState](purista_core.StateStoreBaseClass.md#getstate)
- [removeState](purista_core.StateStoreBaseClass.md#removestate)
- [setState](purista_core.StateStoreBaseClass.md#setstate)

## Constructors

### constructor

• **new StateStoreBaseClass**<`ConfigType`\>(`name`, `config?`)

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

[packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:17](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L17)

## Properties

### config

• **config**: [`StoreBaseConfig`](../modules/purista_core.md#storebaseconfig)<`ConfigType`\>

#### Defined in

[packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:13](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L13)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Defined in

[packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:12](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L12)

___

### name

• **name**: `string`

name of store

#### Implementation of

[StateStore](../interfaces/purista_core.StateStore.md).[name](../interfaces/purista_core.StateStore.md#name)

#### Defined in

[packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:15](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L15)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

disconnects and shuts down the state store

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateStore](../interfaces/purista_core.StateStore.md).[destroy](../interfaces/purista_core.StateStore.md#destroy)

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

#### Implementation of

StateStore.getState

#### Defined in

[packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:32](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L32)

___

### removeState

▸ **removeState**(`stateName`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |

#### Returns

`Promise`<`void`\>

#### Implementation of

StateStore.removeState

#### Defined in

[packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:43](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L43)

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

#### Implementation of

StateStore.setState

#### Defined in

[packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:54](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L54)
