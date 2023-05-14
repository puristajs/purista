[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / Logger

# Class: Logger

[@purista/core](../modules/purista_core.md).Logger

## Hierarchy

- **`Logger`**

  ↳ [`DefaultLogger`](purista_core.DefaultLogger.md)

  ↳ [`DefaultLogger`](purista_core.DefaultLogger.md)

## Table of contents

### Constructors

- [constructor](purista_core.Logger.md#constructor)

### Methods

- [debug](purista_core.Logger.md#debug)
- [error](purista_core.Logger.md#error)
- [fatal](purista_core.Logger.md#fatal)
- [getChildLogger](purista_core.Logger.md#getchildlogger)
- [info](purista_core.Logger.md#info)
- [trace](purista_core.Logger.md#trace)
- [warn](purista_core.Logger.md#warn)

## Constructors

### constructor

• **new Logger**()

## Methods

### debug

▸ `Abstract` **debug**(`...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [`LogFnParamType`](../modules/purista_core.md#logfnparamtype) |

#### Returns

`void`

#### Defined in

[core/types/Logger.ts:24](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/Logger.ts#L24)

___

### error

▸ `Abstract` **error**(`...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [`LogFnParamType`](../modules/purista_core.md#logfnparamtype) |

#### Returns

`void`

#### Defined in

[core/types/Logger.ts:22](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/Logger.ts#L22)

___

### fatal

▸ `Abstract` **fatal**(`...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [`LogFnParamType`](../modules/purista_core.md#logfnparamtype) |

#### Returns

`void`

#### Defined in

[core/types/Logger.ts:21](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/Logger.ts#L21)

___

### getChildLogger

▸ `Abstract` **getChildLogger**(`options`): [`Logger`](purista_core.Logger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`LoggerOptions`](../modules/purista_core.md#loggeroptions) |

#### Returns

[`Logger`](purista_core.Logger.md)

#### Defined in

[core/types/Logger.ts:26](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/Logger.ts#L26)

___

### info

▸ `Abstract` **info**(`...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [`LogFnParamType`](../modules/purista_core.md#logfnparamtype) |

#### Returns

`void`

#### Defined in

[core/types/Logger.ts:20](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/Logger.ts#L20)

___

### trace

▸ `Abstract` **trace**(`...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [`LogFnParamType`](../modules/purista_core.md#logfnparamtype) |

#### Returns

`void`

#### Defined in

[core/types/Logger.ts:25](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/Logger.ts#L25)

___

### warn

▸ `Abstract` **warn**(`...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [`LogFnParamType`](../modules/purista_core.md#logfnparamtype) |

#### Returns

`void`

#### Defined in

[core/types/Logger.ts:23](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/Logger.ts#L23)
