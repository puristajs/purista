[PURISTA API - v1.4.9](../README.md) / [@purista/httpserver](../modules/purista_httpserver.md) / [internal](../modules/purista_httpserver.internal.md) / UnhandledError

# Class: UnhandledError

[@purista/httpserver](../modules/purista_httpserver.md).[internal](../modules/purista_httpserver.internal.md).UnhandledError

A unhandled error will be thrown if some error response is returned during invoking a service function
or when the invocation timed out.
This error is not handled by business logic and it is maybe unwanted to expose this error outside.

Unhandled error are automatically converted into "500 Internal Server Error" to the outside world.

## Hierarchy

- `Error`

  ↳ **`UnhandledError`**

## Table of contents

### Constructors

- [constructor](purista_httpserver.internal.UnhandledError.md#constructor)

### Properties

- [data](purista_httpserver.internal.UnhandledError.md#data)
- [errorCode](purista_httpserver.internal.UnhandledError.md#errorcode)
- [traceId](purista_httpserver.internal.UnhandledError.md#traceid)

### Methods

- [getErrorResponse](purista_httpserver.internal.UnhandledError.md#geterrorresponse)
- [intoHandledError](purista_httpserver.internal.UnhandledError.md#intohandlederror)
- [toString](purista_httpserver.internal.UnhandledError.md#tostring)
- [fromMessage](purista_httpserver.internal.UnhandledError.md#frommessage)

## Constructors

### constructor

• **new UnhandledError**(`errorCode?`, `message?`, `data?`, `traceId?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorCode?` | [`StatusCode`](../enums/purista_httpserver.internal.StatusCode.md) |
| `message?` | `string` |
| `data?` | `unknown` |
| `traceId?` | `string` |

#### Overrides

Error.constructor

#### Defined in

core/lib/core/Error/UnhandledError.impl.d.ts:15

## Properties

### data

• `Optional` **data**: `unknown`

#### Defined in

core/lib/core/Error/UnhandledError.impl.d.ts:13

___

### errorCode

• **errorCode**: [`StatusCode`](../enums/purista_httpserver.internal.StatusCode.md)

#### Defined in

core/lib/core/Error/UnhandledError.impl.d.ts:12

___

### traceId

• `Optional` **traceId**: `string`

#### Defined in

core/lib/core/Error/UnhandledError.impl.d.ts:14

## Methods

### getErrorResponse

▸ **getErrorResponse**(): `Readonly`<[`ErrorResponse`](../modules/purista_httpserver.internal.md#errorresponse)\>

Returns error response object

#### Returns

`Readonly`<[`ErrorResponse`](../modules/purista_httpserver.internal.md#errorresponse)\>

ErrorResponse

#### Defined in

core/lib/core/Error/UnhandledError.impl.d.ts:31

___

### intoHandledError

▸ **intoHandledError**(): [`HandledError`](purista_httpserver.internal.HandledError.md)

Create a handled error from unhandled error

#### Returns

[`HandledError`](purista_httpserver.internal.HandledError.md)

HandledError

#### Defined in

core/lib/core/Error/UnhandledError.impl.d.ts:26

___

### toString

▸ **toString**(): `string`

Returns stringified error response object

#### Returns

`string`

ErrorResponse as string

#### Defined in

core/lib/core/Error/UnhandledError.impl.d.ts:36

___

### fromMessage

▸ `Static` **fromMessage**(`message`): [`UnhandledError`](purista_httpserver.internal.UnhandledError.md)

Create a error object from EBMessage error message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Readonly`<[`CommandErrorResponse`](../modules/purista_httpserver.internal.md#commanderrorresponse-1)\> | CommandErrorResponse |

#### Returns

[`UnhandledError`](purista_httpserver.internal.UnhandledError.md)

UnhandledError

#### Defined in

core/lib/core/Error/UnhandledError.impl.d.ts:21
