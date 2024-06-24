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
- [toJSON](purista_core.HandledError.md#tojson)
- [toString](purista_core.HandledError.md#tostring)
- [fromError](purista_core.HandledError.md#fromerror)
- [fromMessage](purista_core.HandledError.md#frommessage)

## Constructors

### constructor

• **new HandledError**(`errorCode`, `message?`, `data?`, `traceId?`): [`HandledError`](purista_core.HandledError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorCode` | [`StatusCode`](../enums/purista_core.StatusCode.md) |
| `message?` | `string` |
| `data?` | `unknown` |
| `traceId?` | `string` |

#### Returns

[`HandledError`](purista_core.HandledError.md)

#### Overrides

Error.constructor

#### Defined in

[core/Error/HandledError.impl.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L12)

## Properties

### data

• `Optional` **data**: `unknown`

#### Defined in

[core/Error/HandledError.impl.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L15)

___

### errorCode

• **errorCode**: [`StatusCode`](../enums/purista_core.StatusCode.md)

#### Defined in

[core/Error/HandledError.impl.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L13)

___

### traceId

• `Optional` **traceId**: `string`

#### Defined in

[core/Error/HandledError.impl.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L16)

## Methods

### getErrorResponse

▸ **getErrorResponse**(`traceId?`): `Readonly`\<[`ErrorResponsePayload`](../modules/purista_core.md#errorresponsepayload)\>

Returns error response object

#### Parameters

| Name | Type |
| :------ | :------ |
| `traceId?` | `string` |

#### Returns

`Readonly`\<[`ErrorResponsePayload`](../modules/purista_core.md#errorresponsepayload)\>

ErrorResponsePayload

#### Defined in

[core/Error/HandledError.impl.ts:65](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L65)

___

### toJSON

▸ **toJSON**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | `unknown` | addition data |
| `message` | `string` | a human readable error message |
| `name` | `string` | - |
| `stack` | `undefined` \| `string` | - |
| `status` | [`StatusCode`](../enums/purista_core.StatusCode.md) | the error status code |
| `traceId?` | `string` | the trace if of the request |

#### Defined in

[core/Error/HandledError.impl.ts:84](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L84)

___

### toString

▸ **toString**(): `string`

Returns stringified error response object

#### Returns

`string`

ErrorResponse as string

#### Defined in

[core/Error/HandledError.impl.ts:80](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L80)

___

### fromError

▸ **fromError**(`err`, `errorCode?`, `data?`, `traceId?`): [`HandledError`](purista_core.HandledError.md)

Creates a HandledError from an input.
If the input error is a HandledError it will be returned without modifications.

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

[core/Error/HandledError.impl.ts:45](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L45)

___

### fromMessage

▸ **fromMessage**(`message`): [`HandledError`](purista_core.HandledError.md)

Create a error object from EBMessage error message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Readonly`\<\{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: \{ `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }\> | CommandErrorResponse |

#### Returns

[`HandledError`](purista_core.HandledError.md)

HandledError

#### Defined in

[core/Error/HandledError.impl.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Error/HandledError.impl.ts#L31)
