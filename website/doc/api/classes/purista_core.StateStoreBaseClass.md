[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / StateStoreBaseClass

# Class: StateStoreBaseClass\<StateStoreConfigType\>

[@purista/core](../modules/purista_core.md).StateStoreBaseClass

Base class for config store implementations
The actual store implementation must overwrite the protected methods:

- `getStateImpl`
- `setStateImpl`
- `removeStateImpl`

__DO NOT OVERWRITE__: the regular methods getState, setState or removeState

## Type parameters

| Name | Type |
| :------ | :------ |
| `StateStoreConfigType` | extends `Record`\<`string`, `unknown`\> = {} |

## Hierarchy

- **`StateStoreBaseClass`**

  ↳ [`DefaultStateStore`](purista_core.DefaultStateStore.md)

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
- [getStateImpl](purista_core.StateStoreBaseClass.md#getstateimpl)
- [removeState](purista_core.StateStoreBaseClass.md#removestate)
- [removeStateImpl](purista_core.StateStoreBaseClass.md#removestateimpl)
- [setState](purista_core.StateStoreBaseClass.md#setstate)
- [setStateImpl](purista_core.StateStoreBaseClass.md#setstateimpl)

## Constructors

### constructor

• **new StateStoreBaseClass**\<`StateStoreConfigType`\>(`name`, `config`): [`StateStoreBaseClass`](purista_core.StateStoreBaseClass.md)\<`StateStoreConfigType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `StateStoreConfigType` | extends `Record`\<`string`, `unknown`\> = {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `config` | \{ [K in string \| number \| symbol]: (Object & StateStoreConfigType)[K] } |

#### Returns

[`StateStoreBaseClass`](purista_core.StateStoreBaseClass.md)\<`StateStoreConfigType`\>

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:24](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L24)

## Properties

### config

• **config**: \{ [K in string \| number \| symbol]: (Object & StateStoreConfigType)[K] }

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:20](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L20)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L19)

___

### name

• **name**: `string`

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:22](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L22)

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:82](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L82)

___

### getState

▸ **getState**\<`StateNames`\>(`...stateNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`StateNames`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `StateNames` | extends `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...stateNames` | `StateNames` |

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`StateNames`\>\>

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:43](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L43)

___

### getStateImpl

▸ **getStateImpl**\<`StateNames`\>(`...stateNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`StateNames`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `StateNames` | extends `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...stateNames` | `StateNames` |

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`StateNames`\>\>

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:38](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L38)

___

### removeState

▸ **removeState**(`stateName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:58](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L58)

___

### removeStateImpl

▸ **removeStateImpl**(`stateName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:56](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L56)

___

### setState

▸ **setState**(`stateName`, `stateValue`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |
| `stateValue` | `unknown` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:72](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L72)

___

### setStateImpl

▸ **setStateImpl**(`stateName`, `stateValue`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |
| `stateValue` | `unknown` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:69](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L69)
