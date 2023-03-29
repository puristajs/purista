[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/amqpbridge](../modules/purista_amqpbridge.md) / [internal](../modules/purista_amqpbridge.internal.md) / UnhandledError

# Class: UnhandledError

[@purista/amqpbridge](../modules/purista_amqpbridge.md).[internal](../modules/purista_amqpbridge.internal.md).UnhandledError

A unhandled error will be thrown if some error response is returned during invoking a service function
or when the invocation timed out.
This error is not handled by business logic and it is maybe unwanted to expose this error outside.

Unhandled error are automatically converted into "500 Internal Server Error" to the outside world.

## Hierarchy

- `Error`

  ↳ **`UnhandledError`**

## Table of contents

### Constructors

- [constructor](purista_amqpbridge.internal.UnhandledError.md#constructor)

### Properties

- [data](purista_amqpbridge.internal.UnhandledError.md#data)
- [errorCode](purista_amqpbridge.internal.UnhandledError.md#errorcode)
- [traceId](purista_amqpbridge.internal.UnhandledError.md#traceid)

### Methods

- [getErrorResponse](purista_amqpbridge.internal.UnhandledError.md#geterrorresponse)
- [intoHandledError](purista_amqpbridge.internal.UnhandledError.md#intohandlederror)
- [toString](purista_amqpbridge.internal.UnhandledError.md#tostring)
- [fromError](purista_amqpbridge.internal.UnhandledError.md#fromerror)
- [fromMessage](purista_amqpbridge.internal.UnhandledError.md#frommessage)

## Constructors

### constructor

• **new UnhandledError**(`errorCode?`, `message?`, `data?`, `traceId?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorCode?` | [`StatusCode`](../enums/purista_amqpbridge.internal.StatusCode.md) |
| `message?` | `string` |
| `data?` | `unknown` |
| `traceId?` | `string` |

#### Overrides

Error.constructor

#### Defined in

packages/core/lib/core/Error/UnhandledError.impl.d.ts:15

## Properties

### data

• `Optional` **data**: `unknown`

#### Defined in

packages/core/lib/core/Error/UnhandledError.impl.d.ts:13

___

### errorCode

• **errorCode**: [`StatusCode`](../enums/purista_amqpbridge.internal.StatusCode.md)

#### Defined in

packages/core/lib/core/Error/UnhandledError.impl.d.ts:12

___

### traceId

• `Optional` **traceId**: `string`

#### Defined in

packages/core/lib/core/Error/UnhandledError.impl.d.ts:14

## Methods

### getErrorResponse

▸ **getErrorResponse**(): `Readonly`<[`ErrorResponsePayload`](../modules/purista_amqpbridge.internal.md#errorresponsepayload)\>

Returns error response object

#### Returns

`Readonly`<[`ErrorResponsePayload`](../modules/purista_amqpbridge.internal.md#errorresponsepayload)\>

ErrorResponsePayload

#### Defined in

packages/core/lib/core/Error/UnhandledError.impl.d.ts:41

___

### intoHandledError

▸ **intoHandledError**(): [`HandledError`](purista_amqpbridge.internal.HandledError.md)

Create a handled error from unhandled error

#### Returns

[`HandledError`](purista_amqpbridge.internal.HandledError.md)

HandledError

#### Defined in

packages/core/lib/core/Error/UnhandledError.impl.d.ts:36

___

### toString

▸ **toString**(): `string`

Returns stringified error response object

#### Returns

`string`

ErrorResponse as string

#### Defined in

packages/core/lib/core/Error/UnhandledError.impl.d.ts:46

___

### fromError

▸ `Static` **fromError**(`err`, `errorCode?`, `data?`, `traceId?`): [`HandledError`](purista_amqpbridge.internal.HandledError.md)

Creates a UnhandledError from an input

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `err` | `any` | the input |
| `errorCode?` | [`StatusCode`](../enums/purista_amqpbridge.internal.StatusCode.md) | the error code |
| `data?` | `unknown` | optional data |
| `traceId?` | `string` | optional trace id |

#### Returns

[`HandledError`](purista_amqpbridge.internal.HandledError.md)

UnhandledError

#### Defined in

packages/core/lib/core/Error/UnhandledError.impl.d.ts:31

___

### fromMessage

▸ `Static` **fromMessage**(`message`): [`UnhandledError`](purista_amqpbridge.internal.UnhandledError.md)

Create a error object from EBMessage error message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Readonly`<[`CommandErrorResponse`](../modules/purista_amqpbridge.internal.md#commanderrorresponse-1)\> | CommandErrorResponse |

#### Returns

[`UnhandledError`](purista_amqpbridge.internal.UnhandledError.md)

UnhandledError

#### Defined in

packages/core/lib/core/Error/UnhandledError.impl.d.ts:21
