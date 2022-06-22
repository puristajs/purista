[PURISTA API](../README.md) / [@purista/core](../modules/purista_core.md) / UnhandledError

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

[core/src/core/UnhandledError.impl.ts:13](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/UnhandledError.impl.ts#L13)

## Properties

### data

• `Optional` **data**: `unknown`

___

### errorCode

• **errorCode**: [`StatusCode`](../enums/purista_core.StatusCode.md) = `StatusCode.InternalServerError`

___

### traceId

• `Optional` **traceId**: `string`

## Methods

### getErrorResponse

▸ **getErrorResponse**(): [`ErrorResponse`](../modules/purista_core.md#errorresponse)

Returns error response object

#### Returns

[`ErrorResponse`](../modules/purista_core.md#errorresponse)

ErrorResponse

#### Defined in

[core/src/core/UnhandledError.impl.ts:43](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/UnhandledError.impl.ts#L43)

___

### intoHandledError

▸ **intoHandledError**(): [`HandledError`](purista_core.HandledError.md)

Create a handled error from unhandled error

#### Returns

[`HandledError`](purista_core.HandledError.md)

HandledError

#### Defined in

[core/src/core/UnhandledError.impl.ts:35](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/UnhandledError.impl.ts#L35)

___

### toString

▸ **toString**(): `string`

Returns stringified error response object

#### Returns

`string`

ErrorResponse as string

#### Defined in

[core/src/core/UnhandledError.impl.ts:58](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/UnhandledError.impl.ts#L58)

___

### fromMessage

▸ `Static` **fromMessage**(`message`): [`UnhandledError`](purista_core.UnhandledError.md)

Create a error object from EBMessage error message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`CommandErrorResponse`](../modules/purista_core.md#commanderrorresponse) | CommandErrorResponse |

#### Returns

[`UnhandledError`](purista_core.UnhandledError.md)

UnhandledError

#### Defined in

[core/src/core/UnhandledError.impl.ts:27](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/UnhandledError.impl.ts#L27)
