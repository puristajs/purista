[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / HandledError

# Class: HandledError

Defined in: [packages/core/src/core/Error/HandledError.impl.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L11)

A handled error is an error which is handled or thrown by business logic.
It is wanted to expose it the outside world.
Scenarios are input validation failures or "404 Not Found" errors which should be returned to the caller.

## Extends

- `Error`

## Constructors

### new HandledError()

> **new HandledError**(`errorCode`, `message`?, `data`?, `traceId`?): [`HandledError`](HandledError.md)

Defined in: [packages/core/src/core/Error/HandledError.impl.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L12)

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

[`HandledError`](HandledError.md)

#### Overrides

`Error.constructor`

## Properties

### data?

> `optional` **data**: `unknown`

Defined in: [packages/core/src/core/Error/HandledError.impl.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L15)

***

### errorCode

> **errorCode**: [`StatusCode`](../enumerations/StatusCode.md)

Defined in: [packages/core/src/core/Error/HandledError.impl.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L13)

***

### traceId?

> `optional` **traceId**: `string`

Defined in: [packages/core/src/core/Error/HandledError.impl.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L16)

## Methods

### getErrorResponse()

> **getErrorResponse**(`traceId`?): `Readonly`\<[`ErrorResponsePayload`](../type-aliases/ErrorResponsePayload.md)\>

Defined in: [packages/core/src/core/Error/HandledError.impl.ts:65](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L65)

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

Defined in: [packages/core/src/core/Error/HandledError.impl.ts:84](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L84)

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

Defined in: [packages/core/src/core/Error/HandledError.impl.ts:80](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L80)

Returns stringified error response object

#### Returns

`string`

ErrorResponse as string

***

### fromError()

> `static` **fromError**(`err`, `errorCode`?, `data`?, `traceId`?): [`HandledError`](HandledError.md)

Defined in: [packages/core/src/core/Error/HandledError.impl.ts:45](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L45)

Creates a HandledError from an input.
If the input error is a HandledError it will be returned without modifications.

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

HandledError

***

### fromMessage()

> `static` **fromMessage**(`message`): [`HandledError`](HandledError.md)

Defined in: [packages/core/src/core/Error/HandledError.impl.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L31)

Create a error object from EBMessage error message

#### Parameters

##### message

`Readonly`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp`: `string`; `payload`: \{ `data`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}\>

CommandErrorResponse

#### Returns

[`HandledError`](HandledError.md)

HandledError
