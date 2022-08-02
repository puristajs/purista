[PURISTA API - v1.4.3](../README.md) / [@purista/core](../modules/purista_core.md) / UnhandledError

# Class: UnhandledError

[@purista/core](../modules/purista_core.md).UnhandledError

A unhandled error will be thrown if some error response is returned during invoking a service function
or when the invocation timed out.
This error is not handled by business logic and it is maybe unwanted to expose this error outside.

Unhandled error are automatically converted into "500 Internal Server Error" to the outside world.

## Hierarchy

- `Error`

  ↳ **`UnhandledError`**

## Table of contents

### Constructors

- [constructor](purista_core.UnhandledError.md#constructor)

### Properties

- [data](purista_core.UnhandledError.md#data)
- [errorCode](purista_core.UnhandledError.md#errorcode)
- [traceId](purista_core.UnhandledError.md#traceid)

### Methods

- [getErrorResponse](purista_core.UnhandledError.md#geterrorresponse)
- [intoHandledError](purista_core.UnhandledError.md#intohandlederror)
- [toString](purista_core.UnhandledError.md#tostring)
- [fromMessage](purista_core.UnhandledError.md#frommessage)

## Constructors

### constructor

• **new UnhandledError**(`errorCode?`, `message?`, `data?`, `traceId?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `errorCode` | [`StatusCode`](../enums/purista_core.StatusCode.md) | `StatusCode.InternalServerError` |
| `message?` | `string` | `undefined` |
| `data?` | `unknown` | `undefined` |
| `traceId?` | `string` | `undefined` |

#### Overrides

Error.constructor

#### Defined in

[core/src/core/UnhandledError.impl.ts:14](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/core/UnhandledError.impl.ts#L14)

## Properties

### data

• `Optional` **data**: `unknown`

#### Defined in

[core/src/core/UnhandledError.impl.ts:17](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/core/UnhandledError.impl.ts#L17)

___

### errorCode

• **errorCode**: [`StatusCode`](../enums/purista_core.StatusCode.md) = `StatusCode.InternalServerError`

#### Defined in

[core/src/core/UnhandledError.impl.ts:15](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/core/UnhandledError.impl.ts#L15)

___

### traceId

• `Optional` **traceId**: `string`

#### Defined in

[core/src/core/UnhandledError.impl.ts:18](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/core/UnhandledError.impl.ts#L18)

## Methods

### getErrorResponse

▸ **getErrorResponse**(): `Readonly`<[`ErrorResponse`](../modules/purista_core.md#errorresponse)\>

Returns error response object

#### Returns

`Readonly`<[`ErrorResponse`](../modules/purista_core.md#errorresponse)\>

ErrorResponse

#### Defined in

[core/src/core/UnhandledError.impl.ts:44](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/core/UnhandledError.impl.ts#L44)

___

### intoHandledError

▸ **intoHandledError**(): [`HandledError`](purista_core.HandledError.md)

Create a handled error from unhandled error

#### Returns

[`HandledError`](purista_core.HandledError.md)

HandledError

#### Defined in

[core/src/core/UnhandledError.impl.ts:36](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/core/UnhandledError.impl.ts#L36)

___

### toString

▸ **toString**(): `string`

Returns stringified error response object

#### Returns

`string`

ErrorResponse as string

#### Defined in

[core/src/core/UnhandledError.impl.ts:59](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/core/UnhandledError.impl.ts#L59)

___

### fromMessage

▸ `Static` **fromMessage**(`message`): [`UnhandledError`](purista_core.UnhandledError.md)

Create a error object from EBMessage error message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Readonly`<[`CommandErrorResponse`](../modules/purista_core.md#commanderrorresponse)\> | CommandErrorResponse |

#### Returns

[`UnhandledError`](purista_core.UnhandledError.md)

UnhandledError

#### Defined in

[core/src/core/UnhandledError.impl.ts:28](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/core/UnhandledError.impl.ts#L28)
