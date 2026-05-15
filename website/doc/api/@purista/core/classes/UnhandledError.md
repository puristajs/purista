[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / UnhandledError

# Class: UnhandledError

Defined in: [core/Error/UnhandledError.impl.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L15)

A unhandled error will be thrown if some error response is returned during invoking a service function
or when the invocation timed out.
This error is not handled by business logic and it is maybe unwanted to expose this error outside.

Unhandled error are automatically converted into "500 Internal Server Error" to the outside world.

## Extends

- `Error`

## Constructors

### Constructor

> **new UnhandledError**(`errorCode?`, `message?`, `data?`, `traceId?`): `UnhandledError`

Defined in: [core/Error/UnhandledError.impl.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L16)

#### Parameters

##### errorCode?

[`StatusCode`](../enumerations/StatusCode.md) = `StatusCode.InternalServerError`

##### message?

`string`

##### data?

`unknown`

##### traceId?

`string`

#### Returns

`UnhandledError`

#### Overrides

`Error.constructor`

## Properties

### data?

> `optional` **data?**: `unknown`

Defined in: [core/Error/UnhandledError.impl.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L19)

***

### errorCode

> **errorCode**: [`StatusCode`](../enumerations/StatusCode.md) = `StatusCode.InternalServerError`

Defined in: [core/Error/UnhandledError.impl.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L17)

***

### traceId?

> `optional` **traceId?**: `string`

Defined in: [core/Error/UnhandledError.impl.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L20)

## Methods

### getErrorResponse()

> **getErrorResponse**(): `Readonly`\<[`ErrorResponsePayload`](../type-aliases/ErrorResponsePayload.md)\>

Defined in: [core/Error/UnhandledError.impl.ts:77](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L77)

Returns error response object

#### Returns

`Readonly`\<[`ErrorResponsePayload`](../type-aliases/ErrorResponsePayload.md)\>

ErrorResponsePayload

***

### intoHandledError()

> **intoHandledError**(): [`HandledError`](HandledError.md)

Defined in: [core/Error/UnhandledError.impl.ts:69](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L69)

Create a handled error from unhandled error

#### Returns

[`HandledError`](HandledError.md)

HandledError

***

### toJSON()

> **toJSON**(): `object`

Defined in: [core/Error/UnhandledError.impl.ts:96](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L96)

#### Returns

##### data?

> `optional` **data?**: `unknown`

addition data

##### message

> **message**: `string`

a human readable error message

##### name

> **name**: `string`

##### stack

> **stack**: `string` \| `undefined`

##### status

> **status**: [`StatusCode`](../enumerations/StatusCode.md)

the error status code

##### traceId?

> `optional` **traceId?**: `string`

the trace if of the request

***

### toString()

> **toString**(): `string`

Defined in: [core/Error/UnhandledError.impl.ts:92](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L92)

Returns stringified error response object

#### Returns

`string`

ErrorResponse as string

***

### fromError()

> `static` **fromError**(`err`, `errorCode?`, `data?`, `traceId?`): `UnhandledError`

Defined in: [core/Error/UnhandledError.impl.ts:48](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L48)

Creates a UnhandledError from an input

#### Parameters

##### err

`unknown`

the input

##### errorCode?

[`StatusCode`](../enumerations/StatusCode.md)

the error code

##### data?

`unknown`

optional data

##### traceId?

`string`

optional trace id

#### Returns

`UnhandledError`

UnhandledError

***

### fromMessage()

> `static` **fromMessage**(`message`): `UnhandledError`

Defined in: [core/Error/UnhandledError.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L35)

Create a error object from EBMessage error message

#### Parameters

##### message

`Readonly`\<[`CommandErrorResponse`](../type-aliases/CommandErrorResponse.md)\>

CommandErrorResponse

#### Returns

`UnhandledError`

UnhandledError
