[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / DefaultStateStore

# Class: DefaultStateStore

[@purista/core](../modules/purista_core.md).DefaultStateStore

The DefaultStateStore is a placeholder which offers all needed methods.
Getters and setters will throw a UnhandledError with status `Not implemented`

## Hierarchy

- [`StateStoreBaseClass`](purista_core.StateStoreBaseClass.md)\<[`DefaultStateStoreConfig`](../modules/purista_core.md#defaultstatestoreconfig)\>

  ↳ **`DefaultStateStore`**

## Implements

- [`StateStore`](../interfaces/purista_core.StateStore.md)

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
- [getStateImpl](purista_core.DefaultStateStore.md#getstateimpl)
- [removeState](purista_core.DefaultStateStore.md#removestate)
- [removeStateImpl](purista_core.DefaultStateStore.md#removestateimpl)
- [setState](purista_core.DefaultStateStore.md#setstate)
- [setStateImpl](purista_core.DefaultStateStore.md#setstateimpl)

## Constructors

### constructor

• **new DefaultStateStore**(`config?`): [`DefaultStateStore`](purista_core.DefaultStateStore.md)

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

[`DefaultStateStore`](purista_core.DefaultStateStore.md)

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[constructor](purista_core.StateStoreBaseClass.md#constructor)

#### Defined in

[DefaultStateStore/DefaultStateStore.impl.ts:15](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L15)

## Properties

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

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[config](purista_core.StateStoreBaseClass.md#config)

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:20](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L20)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[logger](purista_core.StateStoreBaseClass.md#logger)

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L19)

___

### map

• `Private` **map**: `Map`\<`string`, `unknown`\>

#### Defined in

[DefaultStateStore/DefaultStateStore.impl.ts:14](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L14)

___

### name

• **name**: `string`

name of store

#### Implementation of

[StateStore](../interfaces/purista_core.StateStore.md).[name](../interfaces/purista_core.StateStore.md#name)

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[name](purista_core.StateStoreBaseClass.md#name)

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:22](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L22)

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

disconnects and shuts down the state store

#### Returns

`Promise`\<`void`\>

#### Implementation of

[StateStore](../interfaces/purista_core.StateStore.md).[destroy](../interfaces/purista_core.StateStore.md#destroy)

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[destroy](purista_core.StateStoreBaseClass.md#destroy)

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

#### Implementation of

StateStore.getState

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[getState](purista_core.StateStoreBaseClass.md#getstate)

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

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[getStateImpl](purista_core.StateStoreBaseClass.md#getstateimpl)

#### Defined in

[DefaultStateStore/DefaultStateStore.impl.ts:25](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L25)

___

### removeState

▸ **removeState**(`stateName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

StateStore.removeState

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[removeState](purista_core.StateStoreBaseClass.md#removestate)

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

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[removeStateImpl](purista_core.StateStoreBaseClass.md#removestateimpl)

#### Defined in

[DefaultStateStore/DefaultStateStore.impl.ts:39](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L39)

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

#### Implementation of

StateStore.setState

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[setState](purista_core.StateStoreBaseClass.md#setstate)

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

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[setStateImpl](purista_core.StateStoreBaseClass.md#setstateimpl)

#### Defined in

[DefaultStateStore/DefaultStateStore.impl.ts:35](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L35)
