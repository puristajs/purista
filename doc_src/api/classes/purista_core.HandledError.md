[PURISTA API](../README.md) / [@purista/core](../modules/purista_core.md) / HandledError

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

- [cause](purista_core.HandledError.md#cause)
- [data](purista_core.HandledError.md#data)
- [errorCode](purista_core.HandledError.md#errorcode)
- [message](purista_core.HandledError.md#message)
- [name](purista_core.HandledError.md#name)
- [stack](purista_core.HandledError.md#stack)
- [traceId](purista_core.HandledError.md#traceid)
- [prepareStackTrace](purista_core.HandledError.md#preparestacktrace)
- [stackTraceLimit](purista_core.HandledError.md#stacktracelimit)

### Methods

- [getErrorResponse](purista_core.HandledError.md#geterrorresponse)
- [toString](purista_core.HandledError.md#tostring)
- [captureStackTrace](purista_core.HandledError.md#capturestacktrace)
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

[core/src/core/HandledError.impl.ts:10](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/HandledError.impl.ts#L10)

## Properties

### cause

• `Optional` **cause**: `Error`

#### Inherited from

Error.cause

#### Defined in

core/node_modules/typescript/lib/lib.es2022.error.d.ts:26

___

### data

• `Optional` **data**: `unknown`

___

### errorCode

• **errorCode**: [`StatusCode`](../enums/purista_core.StatusCode.md)

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

core/node_modules/typescript/lib/lib.es5.d.ts:1023

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

core/node_modules/typescript/lib/lib.es5.d.ts:1022

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

core/node_modules/typescript/lib/lib.es5.d.ts:1024

___

### traceId

• `Optional` **traceId**: `string`

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`see`** https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

core/node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

core/node_modules/@types/node/globals.d.ts:13

## Methods

### getErrorResponse

▸ **getErrorResponse**(): [`ErrorResponse`](../modules/purista_core.md#errorresponse)

Returns error response object

#### Returns

[`ErrorResponse`](../modules/purista_core.md#errorresponse)

ErrorResponse

#### Defined in

[core/src/core/HandledError.impl.ts:27](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/HandledError.impl.ts#L27)

___

### toString

▸ **toString**(): `string`

Returns stringified error response object

#### Returns

`string`

ErrorResponse as string

#### Defined in

[core/src/core/HandledError.impl.ts:42](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/HandledError.impl.ts#L42)

___

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

core/node_modules/@types/node/globals.d.ts:4

___

### fromMessage

▸ `Static` **fromMessage**(`message`): [`HandledError`](purista_core.HandledError.md)

Create a error object from EBMessage error message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`CommandErrorResponse`](../modules/purista_core.md#commanderrorresponse) | CommandErrorResponse |

#### Returns

[`HandledError`](purista_core.HandledError.md)

HandledError

#### Defined in

[core/src/core/HandledError.impl.ts:19](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/HandledError.impl.ts#L19)
