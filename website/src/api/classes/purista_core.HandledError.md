[PURISTA API - v1.4.9](../README.md) / [@purista/core](../modules/purista_core.md) / HandledError

# Class: HandledError

[@purista/core](../modules/purista_core.md).HandledError

A handled error is an error which is handled or thrown by business logic.
It is wanted to expose it the outside world.
Scenarios are input validation failures or "404 Not Found" errors which should be returned to the caller.

## Hierarchy

- `Error`

  ↳ **`HandledError`**

## Table of contents

### Constructors

- [constructor](purista_core.HandledError.md#constructor)

### Properties

- [data](purista_core.HandledError.md#data)
- [errorCode](purista_core.HandledError.md#errorcode)
- [traceId](purista_core.HandledError.md#traceid)

### Methods

- [getErrorResponse](purista_core.HandledError.md#geterrorresponse)
- [toString](purista_core.HandledError.md#tostring)
- [fromMessage](purista_core.HandledError.md#frommessage)

## Constructors

### constructor

• **new HandledError**(`errorCode`, `message?`, `data?`, `traceId?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorCode` | [`StatusCode`](../enums/purista_core.StatusCode.md) |
| `message?` | `string` |
| `data?` | `unknown` |
| `traceId?` | `string` |

#### Overrides

Error.constructor

#### Defined in

[core/src/core/Error/HandledError.impl.ts:10](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Error/HandledError.impl.ts#L10)

## Properties

### data

• `Optional` **data**: `unknown`

#### Defined in

[core/src/core/Error/HandledError.impl.ts:10](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Error/HandledError.impl.ts#L10)

___

### errorCode

• **errorCode**: [`StatusCode`](../enums/purista_core.StatusCode.md)

#### Defined in

[core/src/core/Error/HandledError.impl.ts:10](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Error/HandledError.impl.ts#L10)

___

### traceId

• `Optional` **traceId**: `string`

#### Defined in

[core/src/core/Error/HandledError.impl.ts:10](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Error/HandledError.impl.ts#L10)

## Methods

### getErrorResponse

▸ **getErrorResponse**(): `Readonly`<[`ErrorResponse`](../modules/purista_core.md#errorresponse)\>

Returns error response object

#### Returns

`Readonly`<[`ErrorResponse`](../modules/purista_core.md#errorresponse)\>

ErrorResponse

#### Defined in

[core/src/core/Error/HandledError.impl.ts:28](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Error/HandledError.impl.ts#L28)

___

### toString

▸ **toString**(): `string`

Returns stringified error response object

#### Returns

`string`

ErrorResponse as string

#### Defined in

[core/src/core/Error/HandledError.impl.ts:43](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Error/HandledError.impl.ts#L43)

___

### fromMessage

▸ `Static` **fromMessage**(`message`): [`HandledError`](purista_core.HandledError.md)

Create a error object from EBMessage error message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Readonly`<[`CommandErrorResponse`](../modules/purista_core.md#commanderrorresponse)\> | CommandErrorResponse |

#### Returns

[`HandledError`](purista_core.HandledError.md)

HandledError

#### Defined in

[core/src/core/Error/HandledError.impl.ts:20](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Error/HandledError.impl.ts#L20)
