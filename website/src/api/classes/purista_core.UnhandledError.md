[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / UnhandledError

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
- [fromError](purista_core.UnhandledError.md#fromerror)
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

[core/Error/UnhandledError.impl.ts:14](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L14)

## Properties

### data

• `Optional` **data**: `unknown`

#### Defined in

[core/Error/UnhandledError.impl.ts:17](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L17)

___

### errorCode

• **errorCode**: [`StatusCode`](../enums/purista_core.StatusCode.md) = `StatusCode.InternalServerError`

#### Defined in

[core/Error/UnhandledError.impl.ts:15](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L15)

___

### traceId

• `Optional` **traceId**: `string`

#### Defined in

[core/Error/UnhandledError.impl.ts:18](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L18)

## Methods

### getErrorResponse

▸ **getErrorResponse**(): `Readonly`<[`ErrorResponsePayload`](../modules/purista_core.md#errorresponsepayload)\>

Returns error response object

#### Returns

`Readonly`<[`ErrorResponsePayload`](../modules/purista_core.md#errorresponsepayload)\>

ErrorResponsePayload

#### Defined in

[core/Error/UnhandledError.impl.ts:61](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L61)

___

### intoHandledError

▸ **intoHandledError**(): [`HandledError`](purista_core.HandledError.md)

Create a handled error from unhandled error

#### Returns

[`HandledError`](purista_core.HandledError.md)

HandledError

#### Defined in

[core/Error/UnhandledError.impl.ts:53](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L53)

___

### toString

▸ **toString**(): `string`

Returns stringified error response object

#### Returns

`string`

ErrorResponse as string

#### Defined in

[core/Error/UnhandledError.impl.ts:76](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L76)

___

### fromError

▸ `Static` **fromError**(`err`, `errorCode?`, `data?`, `traceId?`): [`HandledError`](purista_core.HandledError.md)

Creates a UnhandledError from an input

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `err` | `any` | the input |
| `errorCode?` | [`StatusCode`](../enums/purista_core.StatusCode.md) | the error code |
| `data?` | `unknown` | optional data |
| `traceId?` | `string` | optional trace id |

#### Returns

[`HandledError`](purista_core.HandledError.md)

UnhandledError

#### Defined in

[core/Error/UnhandledError.impl.ts:42](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L42)

___

### fromMessage

▸ `Static` **fromMessage**(`message`): [`UnhandledError`](purista_core.UnhandledError.md)

Create a error object from EBMessage error message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Readonly`<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\> | CommandErrorResponse |

#### Returns

[`UnhandledError`](purista_core.UnhandledError.md)

UnhandledError

#### Defined in

[core/Error/UnhandledError.impl.ts:29](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Error/UnhandledError.impl.ts#L29)
