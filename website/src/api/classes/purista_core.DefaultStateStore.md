[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / DefaultStateStore

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

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `Object` | - |
| `config.enableGet?` | `boolean` | Enable generally get method |
| `config.enableRemove?` | `boolean` | Enable generally remove method |
| `config.enableSet?` | `boolean` | Enable generally set method |
| `config.logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `config.logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[constructor](purista_core.StateStoreBaseClass.md#constructor)

#### Defined in

[DefaultStateStore/DefaultStateStore.impl.ts:13](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L13)

## Properties

### config

• **config**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `enableGet?` | `boolean` | Enable generally get method |
| `enableRemove?` | `boolean` | Enable generally remove method |
| `enableSet?` | `boolean` | Enable generally set method |
| `logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[config](purista_core.StateStoreBaseClass.md#config)

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:13](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L13)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[logger](purista_core.StateStoreBaseClass.md#logger)

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L12)

___

### map

• `Private` **map**: `Map`<`string`, `unknown`\>

#### Defined in

[DefaultStateStore/DefaultStateStore.impl.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L12)

___

### name

• **name**: `string`

name of store

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[name](purista_core.StateStoreBaseClass.md#name)

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:15](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L15)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

disconnects and shuts down the state store

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[destroy](purista_core.StateStoreBaseClass.md#destroy)

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

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[getState](purista_core.StateStoreBaseClass.md#getstate)

#### Defined in

[DefaultStateStore/DefaultStateStore.impl.ts:25](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L25)

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

[DefaultStateStore/DefaultStateStore.impl.ts:45](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L45)

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

[DefaultStateStore/DefaultStateStore.impl.ts:37](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L37)
