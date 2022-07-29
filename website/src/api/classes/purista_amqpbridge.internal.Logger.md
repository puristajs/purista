[PURISTA API - v1.3.1](../README.md) / [@purista/amqpbridge](../modules/purista_amqpbridge.md) / [internal](../modules/purista_amqpbridge.internal.md) / Logger

# Class: Logger

[@purista/amqpbridge](../modules/purista_amqpbridge.md).[internal](../modules/purista_amqpbridge.internal.md).Logger

## Table of contents

### Constructors

- [constructor](purista_amqpbridge.internal.Logger.md#constructor)

### Methods

- [debug](purista_amqpbridge.internal.Logger.md#debug)
- [error](purista_amqpbridge.internal.Logger.md#error)
- [fatal](purista_amqpbridge.internal.Logger.md#fatal)
- [getChildLogger](purista_amqpbridge.internal.Logger.md#getchildlogger)
- [info](purista_amqpbridge.internal.Logger.md#info)
- [trace](purista_amqpbridge.internal.Logger.md#trace)
- [warn](purista_amqpbridge.internal.Logger.md#warn)

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

▸ `Abstract` **getChildLogger**(`options`): [`Logger`](purista_amqpbridge.internal.Logger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`LoggerOptions`](../modules/purista_amqpbridge.internal.md#loggeroptions) |

#### Returns

[`Logger`](purista_amqpbridge.internal.Logger.md)

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
