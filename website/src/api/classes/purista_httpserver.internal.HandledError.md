[PURISTA API - v1.4.3](../README.md) / [@purista/httpserver](../modules/purista_httpserver.md) / [internal](../modules/purista_httpserver.internal.md) / HandledError

# Class: HandledError

[@purista/httpserver](../modules/purista_httpserver.md).[internal](../modules/purista_httpserver.internal.md).HandledError

A handled error is an error which is handled or thrown by business logic.
It is wanted to expose it the outside world.
Scenarios are input validation failures or "404 Not Found" errors which should be returned to the caller.

## Hierarchy

- `Error`

  ↳ **`HandledError`**

## Table of contents

### Constructors

- [constructor](purista_httpserver.internal.HandledError.md#constructor)

### Properties

- [data](purista_httpserver.internal.HandledError.md#data)
- [errorCode](purista_httpserver.internal.HandledError.md#errorcode)
- [traceId](purista_httpserver.internal.HandledError.md#traceid)

### Methods

- [getErrorResponse](purista_httpserver.internal.HandledError.md#geterrorresponse)
- [toString](purista_httpserver.internal.HandledError.md#tostring)
- [fromMessage](purista_httpserver.internal.HandledError.md#frommessage)

## Constructors

### constructor

• **new HandledError**(`errorCode`, `message?`, `data?`, `traceId?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorCode` | [`StatusCode`](../enums/purista_httpserver.internal.StatusCode.md) |
| `message?` | `string` |
| `data?` | `unknown` |
| `traceId?` | `string` |

#### Overrides

Error.constructor

#### Defined in

core/lib/types/core/HandledError.impl.d.ts:11

## Properties

### data

• `Optional` **data**: `unknown`

#### Defined in

core/lib/types/core/HandledError.impl.d.ts:9

___

### errorCode

• **errorCode**: [`StatusCode`](../enums/purista_httpserver.internal.StatusCode.md)

#### Defined in

core/lib/types/core/HandledError.impl.d.ts:8

___

### traceId

• `Optional` **traceId**: `string`

#### Defined in

core/lib/types/core/HandledError.impl.d.ts:10

## Methods

### getErrorResponse

▸ **getErrorResponse**(): `Readonly`<[`ErrorResponse`](../modules/purista_httpserver.internal.md#errorresponse)\>

Returns error response object

#### Returns

`Readonly`<[`ErrorResponse`](../modules/purista_httpserver.internal.md#errorresponse)\>

ErrorResponse

#### Defined in

core/lib/types/core/HandledError.impl.d.ts:22

___

### toString

▸ **toString**(): `string`

Returns stringified error response object

#### Returns

`string`

ErrorResponse as string

#### Defined in

core/lib/types/core/HandledError.impl.d.ts:27

___

### fromMessage

▸ `Static` **fromMessage**(`message`): [`HandledError`](purista_httpserver.internal.HandledError.md)

Create a error object from EBMessage error message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Readonly`<[`CommandErrorResponse`](../modules/purista_httpserver.internal.md#commanderrorresponse-1)\> | CommandErrorResponse |

#### Returns

[`HandledError`](purista_httpserver.internal.HandledError.md)

HandledError

#### Defined in

core/lib/types/core/HandledError.impl.d.ts:17
