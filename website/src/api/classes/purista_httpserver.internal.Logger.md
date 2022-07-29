[PURISTA API - v1.3.1](../README.md) / [@purista/httpserver](../modules/purista_httpserver.md) / [internal](../modules/purista_httpserver.internal.md) / Logger

# Class: Logger

[@purista/httpserver](../modules/purista_httpserver.md).[internal](../modules/purista_httpserver.internal.md).Logger

## Table of contents

### Constructors

- [constructor](purista_httpserver.internal.Logger.md#constructor)

### Methods

- [debug](purista_httpserver.internal.Logger.md#debug)
- [error](purista_httpserver.internal.Logger.md#error)
- [fatal](purista_httpserver.internal.Logger.md#fatal)
- [getChildLogger](purista_httpserver.internal.Logger.md#getchildlogger)
- [info](purista_httpserver.internal.Logger.md#info)
- [trace](purista_httpserver.internal.Logger.md#trace)
- [warn](purista_httpserver.internal.Logger.md#warn)

## Constructors

### constructor

• **new Logger**()

## Methods

### debug

▸ `Abstract` **debug**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any` |

#### Returns

`void`

#### Defined in

core/lib/types/core/types/Logger.d.ts:18

___

### error

▸ `Abstract` **error**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any` |

#### Returns

`void`

#### Defined in

core/lib/types/core/types/Logger.d.ts:16

___

### fatal

▸ `Abstract` **fatal**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any` |

#### Returns

`void`

#### Defined in

core/lib/types/core/types/Logger.d.ts:15

___

### getChildLogger

▸ `Abstract` **getChildLogger**(`options`): [`Logger`](purista_httpserver.internal.Logger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`LoggerOptions`](../modules/purista_httpserver.internal.md#loggeroptions) |

#### Returns

[`Logger`](purista_httpserver.internal.Logger.md)

#### Defined in

core/lib/types/core/types/Logger.d.ts:20

___

### info

▸ `Abstract` **info**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any` |

#### Returns

`void`

#### Defined in

core/lib/types/core/types/Logger.d.ts:14

___

### trace

▸ `Abstract` **trace**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any` |

#### Returns

`void`

#### Defined in

core/lib/types/core/types/Logger.d.ts:19

___

### warn

▸ `Abstract` **warn**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any` |

#### Returns

`void`

#### Defined in

core/lib/types/core/types/Logger.d.ts:17
