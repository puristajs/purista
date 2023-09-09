[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / StateStoreBaseClass

# Class: StateStoreBaseClass<ConfigType\>

[@purista/core](../modules/purista_core.md).StateStoreBaseClass

Base class for config store implementations

## Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | extends `Record`<`string`, `unknown`\> = {} |

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

• **new StateStoreBaseClass**<`ConfigType`\>(`name`, `config`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | extends `Record`<`string`, `unknown`\> = {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `config` | { [K in string \| number \| symbol]: (Object & ConfigType)[K] } |

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:17](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L17)

## Properties

### config

• **config**: { [K in string \| number \| symbol]: (Object & ConfigType)[K] }

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:13](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L13)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L12)

___

### name

• **name**: `string`

name of store

#### Implementation of

[StateStore](../interfaces/purista_core.StateStore.md).[name](../interfaces/purista_core.StateStore.md#name)

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:15](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L15)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

disconnects and shuts down the state store

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateStore](../interfaces/purista_core.StateStore.md).[destroy](../interfaces/purista_core.StateStore.md#destroy)

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:70](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L70)

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

[core/StateStore/StateStoreBaseClass.impl.ts:32](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L32)

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

[core/StateStore/StateStoreBaseClass.impl.ts:45](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L45)

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

[core/StateStore/StateStoreBaseClass.impl.ts:58](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L58)
