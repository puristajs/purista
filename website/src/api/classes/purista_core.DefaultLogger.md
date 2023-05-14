[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / DefaultLogger

# Class: DefaultLogger

[@purista/core](../modules/purista_core.md).DefaultLogger

## Hierarchy

- [`Logger`](purista_core.Logger.md)

  ↳ **`DefaultLogger`**

## Implements

- [`ILogger`](../interfaces/purista_core.ILogger.md)

## Table of contents

### Constructors

- [constructor](purista_core.DefaultLogger.md#constructor)

### Properties

- [log](purista_core.DefaultLogger.md#log)

### Methods

- [debug](purista_core.DefaultLogger.md#debug)
- [error](purista_core.DefaultLogger.md#error)
- [fatal](purista_core.DefaultLogger.md#fatal)
- [getChildLogger](purista_core.DefaultLogger.md#getchildlogger)
- [info](purista_core.DefaultLogger.md#info)
- [trace](purista_core.DefaultLogger.md#trace)
- [warn](purista_core.DefaultLogger.md#warn)

## Constructors

### constructor

• **new DefaultLogger**(`log`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `log` | `Logger` |

#### Overrides

[Logger](purista_core.Logger.md).[constructor](purista_core.Logger.md#constructor)

#### Defined in

[DefaultLogger/DefaultLogger.impl.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L6)

## Properties

### log

• `Private` **log**: `Logger`

#### Defined in

[DefaultLogger/DefaultLogger.impl.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L6)

## Methods

### debug

▸ **debug**(`...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [`LogFnParamType`](../modules/purista_core.md#logfnparamtype) |

#### Returns

`void`

#### Implementation of

[ILogger](../interfaces/purista_core.ILogger.md).[debug](../interfaces/purista_core.ILogger.md#debug)

#### Overrides

[Logger](purista_core.Logger.md).[debug](purista_core.Logger.md#debug)

#### Defined in

[DefaultLogger/DefaultLogger.impl.ts:42](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L42)

___

### error

▸ **error**(`...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [`LogFnParamType`](../modules/purista_core.md#logfnparamtype) |

#### Returns

`void`

#### Implementation of

[ILogger](../interfaces/purista_core.ILogger.md).[error](../interfaces/purista_core.ILogger.md#error)

#### Overrides

[Logger](purista_core.Logger.md).[error](purista_core.Logger.md#error)

#### Defined in

[DefaultLogger/DefaultLogger.impl.ts:18](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L18)

___

### fatal

▸ **fatal**(`...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [`LogFnParamType`](../modules/purista_core.md#logfnparamtype) |

#### Returns

`void`

#### Implementation of

[ILogger](../interfaces/purista_core.ILogger.md).[fatal](../interfaces/purista_core.ILogger.md#fatal)

#### Overrides

[Logger](purista_core.Logger.md).[fatal](purista_core.Logger.md#fatal)

#### Defined in

[DefaultLogger/DefaultLogger.impl.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L10)

___

### getChildLogger

▸ **getChildLogger**(`options`): [`Logger`](purista_core.Logger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`LoggerOptions`](../modules/purista_core.md#loggeroptions) |

#### Returns

[`Logger`](purista_core.Logger.md)

#### Overrides

[Logger](purista_core.Logger.md).[getChildLogger](purista_core.Logger.md#getchildlogger)

#### Defined in

[DefaultLogger/DefaultLogger.impl.ts:58](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L58)

___

### info

▸ **info**(`...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [`LogFnParamType`](../modules/purista_core.md#logfnparamtype) |

#### Returns

`void`

#### Implementation of

[ILogger](../interfaces/purista_core.ILogger.md).[info](../interfaces/purista_core.ILogger.md#info)

#### Overrides

[Logger](purista_core.Logger.md).[info](purista_core.Logger.md#info)

#### Defined in

[DefaultLogger/DefaultLogger.impl.ts:34](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L34)

___

### trace

▸ **trace**(`...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [`LogFnParamType`](../modules/purista_core.md#logfnparamtype) |

#### Returns

`void`

#### Implementation of

[ILogger](../interfaces/purista_core.ILogger.md).[trace](../interfaces/purista_core.ILogger.md#trace)

#### Overrides

[Logger](purista_core.Logger.md).[trace](purista_core.Logger.md#trace)

#### Defined in

[DefaultLogger/DefaultLogger.impl.ts:50](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L50)

___

### warn

▸ **warn**(`...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [`LogFnParamType`](../modules/purista_core.md#logfnparamtype) |

#### Returns

`void`

#### Implementation of

[ILogger](../interfaces/purista_core.ILogger.md).[warn](../interfaces/purista_core.ILogger.md#warn)

#### Overrides

[Logger](purista_core.Logger.md).[warn](purista_core.Logger.md#warn)

#### Defined in

[DefaultLogger/DefaultLogger.impl.ts:26](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L26)
