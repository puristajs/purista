[PURISTA API - v1.4.3](../README.md) / [@purista/core](../modules/purista_core.md) / Logger

# Class: Logger

[@purista/core](../modules/purista_core.md).Logger

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

▸ `Abstract` **debug**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any` |

#### Returns

`void`

#### Defined in

[core/src/core/types/Logger.ts:20](https://github.com/sebastianwessel/purista/blob/c89c5bf/packages/core/src/core/types/Logger.ts#L20)

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

[core/src/core/types/Logger.ts:18](https://github.com/sebastianwessel/purista/blob/c89c5bf/packages/core/src/core/types/Logger.ts#L18)

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

[core/src/core/types/Logger.ts:17](https://github.com/sebastianwessel/purista/blob/c89c5bf/packages/core/src/core/types/Logger.ts#L17)

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

[core/src/core/types/Logger.ts:22](https://github.com/sebastianwessel/purista/blob/c89c5bf/packages/core/src/core/types/Logger.ts#L22)

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

[core/src/core/types/Logger.ts:16](https://github.com/sebastianwessel/purista/blob/c89c5bf/packages/core/src/core/types/Logger.ts#L16)

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

[core/src/core/types/Logger.ts:21](https://github.com/sebastianwessel/purista/blob/c89c5bf/packages/core/src/core/types/Logger.ts#L21)

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

[core/src/core/types/Logger.ts:19](https://github.com/sebastianwessel/purista/blob/c89c5bf/packages/core/src/core/types/Logger.ts#L19)
