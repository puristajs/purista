[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / HandledError

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
- [fromError](purista_core.HandledError.md#fromerror)
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

[core/Error/HandledError.impl.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L10)

## Properties

### data

• `Optional` **data**: `unknown`

#### Defined in

[core/Error/HandledError.impl.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L10)

___

### errorCode

• **errorCode**: [`StatusCode`](../enums/purista_core.StatusCode.md)

#### Defined in

[core/Error/HandledError.impl.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L10)

___

### traceId

• `Optional` **traceId**: `string`

#### Defined in

[core/Error/HandledError.impl.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L10)

## Methods

### getErrorResponse

▸ **getErrorResponse**(`traceId?`): `Readonly`<[`ErrorResponsePayload`](../modules/purista_core.md#errorresponsepayload)\>

Returns error response object

#### Parameters

| Name | Type |
| :------ | :------ |
| `traceId?` | `string` |

#### Returns

`Readonly`<[`ErrorResponsePayload`](../modules/purista_core.md#errorresponsepayload)\>

ErrorResponsePayload

#### Defined in

[core/Error/HandledError.impl.ts:47](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L47)

___

### toString

▸ **toString**(): `string`

Returns stringified error response object

#### Returns

`string`

ErrorResponse as string

#### Defined in

[core/Error/HandledError.impl.ts:62](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L62)

___

### fromError

▸ `Static` **fromError**(`err`, `errorCode?`, `data?`, `traceId?`): [`HandledError`](purista_core.HandledError.md)

Creates a HandledError from an input

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `err` | `any` | the input |
| `errorCode?` | [`StatusCode`](../enums/purista_core.StatusCode.md) | the error code |
| `data?` | `unknown` | optional data |
| `traceId?` | `string` | optional trace id |

#### Returns

[`HandledError`](purista_core.HandledError.md)

HandledError

#### Defined in

[core/Error/HandledError.impl.ts:36](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L36)

___

### fromMessage

▸ `Static` **fromMessage**(`message`): [`HandledError`](purista_core.HandledError.md)

Create a error object from EBMessage error message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Readonly`<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\> | CommandErrorResponse |

#### Returns

[`HandledError`](purista_core.HandledError.md)

HandledError

#### Defined in

[core/Error/HandledError.impl.ts:23](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L23)
