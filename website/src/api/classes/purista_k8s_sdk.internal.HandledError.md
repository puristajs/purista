[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/k8s-sdk](../modules/purista_k8s_sdk.md) / [internal](../modules/purista_k8s_sdk.internal.md) / HandledError

# Class: HandledError

[@purista/k8s-sdk](../modules/purista_k8s_sdk.md).[internal](../modules/purista_k8s_sdk.internal.md).HandledError

A handled error is an error which is handled or thrown by business logic.
It is wanted to expose it the outside world.
Scenarios are input validation failures or "404 Not Found" errors which should be returned to the caller.

## Hierarchy

- `Error`

  ↳ **`HandledError`**

## Table of contents

### Constructors

- [constructor](purista_k8s_sdk.internal.HandledError.md#constructor)

### Properties

- [data](purista_k8s_sdk.internal.HandledError.md#data)
- [errorCode](purista_k8s_sdk.internal.HandledError.md#errorcode)
- [traceId](purista_k8s_sdk.internal.HandledError.md#traceid)

### Methods

- [getErrorResponse](purista_k8s_sdk.internal.HandledError.md#geterrorresponse)
- [toString](purista_k8s_sdk.internal.HandledError.md#tostring)
- [fromError](purista_k8s_sdk.internal.HandledError.md#fromerror)
- [fromMessage](purista_k8s_sdk.internal.HandledError.md#frommessage)

## Constructors

### constructor

• **new HandledError**(`errorCode`, `message?`, `data?`, `traceId?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorCode` | [`StatusCode`](../enums/purista_k8s_sdk.internal.StatusCode.md) |
| `message?` | `string` |
| `data?` | `unknown` |
| `traceId?` | `string` |

#### Overrides

Error.constructor

#### Defined in

packages/core/lib/core/Error/HandledError.impl.d.ts:11

## Properties

### data

• `Optional` **data**: `unknown`

#### Defined in

packages/core/lib/core/Error/HandledError.impl.d.ts:9

___

### errorCode

• **errorCode**: [`StatusCode`](../enums/purista_k8s_sdk.internal.StatusCode.md)

#### Defined in

packages/core/lib/core/Error/HandledError.impl.d.ts:8

___

### traceId

• `Optional` **traceId**: `string`

#### Defined in

packages/core/lib/core/Error/HandledError.impl.d.ts:10

## Methods

### getErrorResponse

▸ **getErrorResponse**(`traceId?`): `Readonly`<[`ErrorResponsePayload`](../modules/purista_k8s_sdk.internal.md#errorresponsepayload)\>

Returns error response object

#### Parameters

| Name | Type |
| :------ | :------ |
| `traceId?` | `string` |

#### Returns

`Readonly`<[`ErrorResponsePayload`](../modules/purista_k8s_sdk.internal.md#errorresponsepayload)\>

ErrorResponsePayload

#### Defined in

packages/core/lib/core/Error/HandledError.impl.d.ts:32

___

### toString

▸ **toString**(): `string`

Returns stringified error response object

#### Returns

`string`

ErrorResponse as string

#### Defined in

packages/core/lib/core/Error/HandledError.impl.d.ts:37

___

### fromError

▸ `Static` **fromError**(`err`, `errorCode?`, `data?`, `traceId?`): [`HandledError`](purista_k8s_sdk.internal.HandledError.md)

Creates a HandledError from an input

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `err` | `any` | the input |
| `errorCode?` | [`StatusCode`](../enums/purista_k8s_sdk.internal.StatusCode.md) | the error code |
| `data?` | `unknown` | optional data |
| `traceId?` | `string` | optional trace id |

#### Returns

[`HandledError`](purista_k8s_sdk.internal.HandledError.md)

HandledError

#### Defined in

packages/core/lib/core/Error/HandledError.impl.d.ts:27

___

### fromMessage

▸ `Static` **fromMessage**(`message`): [`HandledError`](purista_k8s_sdk.internal.HandledError.md)

Create a error object from EBMessage error message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Readonly`<[`CommandErrorResponse`](../modules/purista_k8s_sdk.internal.md#commanderrorresponse-1)\> | CommandErrorResponse |

#### Returns

[`HandledError`](purista_k8s_sdk.internal.HandledError.md)

HandledError

#### Defined in

packages/core/lib/core/Error/HandledError.impl.d.ts:17
