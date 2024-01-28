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

• **new DefaultLogger**(`log`): [`DefaultLogger`](purista_core.DefaultLogger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `log` | `Logger` |

#### Returns

[`DefaultLogger`](purista_core.DefaultLogger.md)

#### Overrides

[Logger](purista_core.Logger.md).[constructor](purista_core.Logger.md#constructor)

#### Defined in

[DefaultLogger/DefaultLogger.impl.ts:7](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L7)

## Properties

### log

• `Private` **log**: `Logger`

#### Defined in

[DefaultLogger/DefaultLogger.impl.ts:7](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L7)

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

[DefaultLogger/DefaultLogger.impl.ts:43](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L43)

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

[DefaultLogger/DefaultLogger.impl.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L19)

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

[DefaultLogger/DefaultLogger.impl.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L11)

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

[DefaultLogger/DefaultLogger.impl.ts:59](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L59)

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

[DefaultLogger/DefaultLogger.impl.ts:35](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L35)

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

[DefaultLogger/DefaultLogger.impl.ts:51](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L51)

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

[DefaultLogger/DefaultLogger.impl.ts:27](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L27)
