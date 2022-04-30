# Class: HandledError

A handled error is an error which is handled or thrown by business logic.
It is wanted to expose it the outside world.
Scenarios are input validation failures or "404 Not Found" errors which should be returned to the caller.

## Hierarchy

- `Error`

  ↳ **`HandledError`**

## Table of contents

### Constructors

- [constructor](HandledError.md#constructor)

### Properties

- [cause](HandledError.md#cause)
- [data](HandledError.md#data)
- [errorCode](HandledError.md#errorcode)
- [message](HandledError.md#message)
- [name](HandledError.md#name)
- [stack](HandledError.md#stack)
- [prepareStackTrace](HandledError.md#preparestacktrace)
- [stackTraceLimit](HandledError.md#stacktracelimit)

### Methods

- [getErrorResponse](HandledError.md#geterrorresponse)
- [toString](HandledError.md#tostring)
- [captureStackTrace](HandledError.md#capturestacktrace)
- [fromMessage](HandledError.md#frommessage)

## Constructors

### constructor

• **new HandledError**(`errorCode`, `message?`, `data?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorCode` | [`ErrorCode`](../enums/ErrorCode.md) |
| `message?` | `string` |
| `data?` | `unknown` |

#### Overrides

Error.constructor

#### Defined in

[src/core/HandledError.impl.ts:10](https://github.com/sebastianwessel/purista/blob/8f47053/src/core/HandledError.impl.ts#L10)

## Properties

### cause

• `Optional` **cause**: `Error`

#### Inherited from

Error.cause

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:26

___

### data

• `Optional` **data**: `unknown`

___

### errorCode

• **errorCode**: [`ErrorCode`](../enums/ErrorCode.md)

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1023

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1022

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1024

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

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### getErrorResponse

▸ **getErrorResponse**(): [`ErrorResponse`](../modules.md#errorresponse)

Returns error response object

#### Returns

[`ErrorResponse`](../modules.md#errorresponse)

ErrorResponse

#### Defined in

[src/core/HandledError.impl.ts:28](https://github.com/sebastianwessel/purista/blob/8f47053/src/core/HandledError.impl.ts#L28)

___

### toString

▸ **toString**(): `string`

Returns stringified error response object

#### Returns

`string`

ErrorResponse as string

#### Defined in

[src/core/HandledError.impl.ts:42](https://github.com/sebastianwessel/purista/blob/8f47053/src/core/HandledError.impl.ts#L42)

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

node_modules/@types/node/globals.d.ts:4

___

### fromMessage

▸ `Static` **fromMessage**(`message`): [`HandledError`](HandledError.md)

Create a error object from EBMessage error message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`CommandErrorResponse`](../modules.md#commanderrorresponse) | CommandErrorResponse |

#### Returns

[`HandledError`](HandledError.md)

HandledError

#### Defined in

[src/core/HandledError.impl.ts:19](https://github.com/sebastianwessel/purista/blob/8f47053/src/core/HandledError.impl.ts#L19)
