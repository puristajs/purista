[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / HandledError

# Class: HandledError

Defined in: [core/Error/HandledError.impl.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L12)

A handled error is an error which is handled or thrown by business logic.
It is wanted to expose it the outside world.
Scenarios are input validation failures or "404 Not Found" errors which should be returned to the caller.

## Extends

- `Error`

## Constructors

### Constructor

> **new HandledError**(`errorCode`, `message?`, `data?`, `traceId?`): `HandledError`

Defined in: [core/Error/HandledError.impl.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L13)

#### Parameters

##### errorCode

[`StatusCode`](../enumerations/StatusCode.md)

##### message?

`string`

##### data?

`unknown`

##### traceId?

`string`

#### Returns

`HandledError`

#### Overrides

`Error.constructor`

## Properties

### data?

> `optional` **data?**: `unknown`

Defined in: [core/Error/HandledError.impl.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L16)

***

### errorCode

> **errorCode**: [`StatusCode`](../enumerations/StatusCode.md)

Defined in: [core/Error/HandledError.impl.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L14)

***

### traceId?

> `optional` **traceId?**: `string`

Defined in: [core/Error/HandledError.impl.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L17)

## Methods

### getErrorResponse()

> **getErrorResponse**(`traceId?`): `Readonly`\<[`ErrorResponsePayload`](../type-aliases/ErrorResponsePayload.md)\>

Defined in: [core/Error/HandledError.impl.ts:68](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L68)

Returns error response object

#### Parameters

##### traceId?

`string`

#### Returns

`Readonly`\<[`ErrorResponsePayload`](../type-aliases/ErrorResponsePayload.md)\>

ErrorResponsePayload

***

### toJSON()

> **toJSON**(): `object`

Defined in: [core/Error/HandledError.impl.ts:87](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L87)

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

Defined in: [core/Error/HandledError.impl.ts:83](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L83)

Returns stringified error response object

#### Returns

`string`

ErrorResponse as string

***

### fromError()

> `static` **fromError**(`err`, `errorCode?`, `data?`, `traceId?`): `HandledError`

Defined in: [core/Error/HandledError.impl.ts:46](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L46)

Creates a HandledError from an input.
If the input error is a HandledError it will be returned without modifications.

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

`HandledError`

HandledError

***

### fromMessage()

> `static` **fromMessage**(`message`): `HandledError`

Defined in: [core/Error/HandledError.impl.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L32)

Create a error object from EBMessage error message

#### Parameters

##### message

`Readonly`\<[`CommandErrorResponse`](../type-aliases/CommandErrorResponse.md)\>

CommandErrorResponse

#### Returns

`HandledError`

HandledError
