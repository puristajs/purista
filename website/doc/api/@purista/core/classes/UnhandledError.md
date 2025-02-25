[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / UnhandledError

# Class: UnhandledError

Defined in: [packages/core/src/core/Error/UnhandledError.impl.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L15)

A unhandled error will be thrown if some error response is returned during invoking a service function
or when the invocation timed out.
This error is not handled by business logic and it is maybe unwanted to expose this error outside.

Unhandled error are automatically converted into "500 Internal Server Error" to the outside world.

## Extends

- `Error`

## Constructors

### new UnhandledError()

> **new UnhandledError**(`errorCode`, `message`?, `data`?, `traceId`?): [`UnhandledError`](UnhandledError.md)

Defined in: [packages/core/src/core/Error/UnhandledError.impl.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L16)

#### Parameters

##### errorCode

[`StatusCode`](../enumerations/StatusCode.md) = `StatusCode.InternalServerError`

##### message?

`string`

##### data?

`unknown`

##### traceId?

`string`

#### Returns

[`UnhandledError`](UnhandledError.md)

#### Overrides

`Error.constructor`

## Properties

### data?

> `optional` **data**: `unknown`

Defined in: [packages/core/src/core/Error/UnhandledError.impl.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L19)

***

### errorCode

> **errorCode**: [`StatusCode`](../enumerations/StatusCode.md) = `StatusCode.InternalServerError`

Defined in: [packages/core/src/core/Error/UnhandledError.impl.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L17)

***

### traceId?

> `optional` **traceId**: `string`

Defined in: [packages/core/src/core/Error/UnhandledError.impl.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L20)

## Methods

### getErrorResponse()

> **getErrorResponse**(): `Readonly`\<[`ErrorResponsePayload`](../type-aliases/ErrorResponsePayload.md)\>

Defined in: [packages/core/src/core/Error/UnhandledError.impl.ts:71](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L71)

Returns error response object

#### Returns

`Readonly`\<[`ErrorResponsePayload`](../type-aliases/ErrorResponsePayload.md)\>

ErrorResponsePayload

***

### intoHandledError()

> **intoHandledError**(): [`HandledError`](HandledError.md)

Defined in: [packages/core/src/core/Error/UnhandledError.impl.ts:63](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L63)

Create a handled error from unhandled error

#### Returns

[`HandledError`](HandledError.md)

HandledError

***

### toJSON()

> **toJSON**(): `object`

Defined in: [packages/core/src/core/Error/UnhandledError.impl.ts:90](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L90)

#### Returns

`object`

##### data?

> `optional` **data**: `unknown`

addition data

##### message

> **message**: `string`

a human readable error message

##### name

> **name**: `string`

##### stack

> **stack**: `undefined` \| `string`

##### status

> **status**: [`StatusCode`](../enumerations/StatusCode.md)

the error status code

##### traceId?

> `optional` **traceId**: `string`

the trace if of the request

***

### toString()

> **toString**(): `string`

Defined in: [packages/core/src/core/Error/UnhandledError.impl.ts:86](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L86)

Returns stringified error response object

#### Returns

`string`

ErrorResponse as string

***

### fromError()

> `static` **fromError**(`err`, `errorCode`?, `data`?, `traceId`?): [`HandledError`](HandledError.md)

Defined in: [packages/core/src/core/Error/UnhandledError.impl.ts:48](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L48)

Creates a UnhandledError from an input

#### Parameters

##### err

`any`

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

[`HandledError`](HandledError.md)

UnhandledError

***

### fromMessage()

> `static` **fromMessage**(`message`): [`UnhandledError`](UnhandledError.md)

Defined in: [packages/core/src/core/Error/UnhandledError.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L35)

Create a error object from EBMessage error message

#### Parameters

##### message

`Readonly`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp`: `string`; `payload`: \{ `data`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}\>

CommandErrorResponse

#### Returns

[`UnhandledError`](UnhandledError.md)

UnhandledError
