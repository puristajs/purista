[@purista/core](../README.md) / [Exports](../modules.md) / UnhandledError

# Class: UnhandledError

A unhandled error will be thrown if some error response is returned during invoking a service function
or when the invocation timed out.
This error is not handled by business logic and it is maybe unwanted to expose this error outside.

Unhandled error are automatically converted into "500 Internal Server Error" to the outside world.

## Hierarchy

- `Error`

  ↳ **`UnhandledError`**

## Table of contents

### Constructors

- [constructor](UnhandledError.md#constructor)

### Properties

- [cause](UnhandledError.md#cause)
- [data](UnhandledError.md#data)
- [errorCode](UnhandledError.md#errorcode)
- [message](UnhandledError.md#message)
- [name](UnhandledError.md#name)
- [stack](UnhandledError.md#stack)
- [prepareStackTrace](UnhandledError.md#preparestacktrace)
- [stackTraceLimit](UnhandledError.md#stacktracelimit)

### Methods

- [getErrorResponse](UnhandledError.md#geterrorresponse)
- [intoHandledError](UnhandledError.md#intohandlederror)
- [toString](UnhandledError.md#tostring)
- [captureStackTrace](UnhandledError.md#capturestacktrace)
- [fromMessage](UnhandledError.md#frommessage)

## Constructors

### constructor

• **new UnhandledError**(`errorCode`, `message?`, `data?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorCode` | [`ErrorCode`](../enums/ErrorCode.md) |
| `message?` | `string` |
| `data?` | `unknown` |

#### Overrides

Error.constructor

#### Defined in

[src/core/UnhandledError.impl.ts:13](https://github.com/sebastianwessel/purista/blob/9753133/src/core/UnhandledError.impl.ts#L13)

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

[src/core/UnhandledError.impl.ts:38](https://github.com/sebastianwessel/purista/blob/9753133/src/core/UnhandledError.impl.ts#L38)

___

### intoHandledError

▸ **intoHandledError**(): [`HandledError`](HandledError.md)

Create a handled error from unhandled error

#### Returns

[`HandledError`](HandledError.md)

HandledError

#### Defined in

[src/core/UnhandledError.impl.ts:30](https://github.com/sebastianwessel/purista/blob/9753133/src/core/UnhandledError.impl.ts#L30)

___

### toString

▸ **toString**(): `string`

Returns stringified error response object

#### Returns

`string`

ErrorResponse as string

#### Defined in

[src/core/UnhandledError.impl.ts:52](https://github.com/sebastianwessel/purista/blob/9753133/src/core/UnhandledError.impl.ts#L52)

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

▸ `Static` **fromMessage**(`message`): [`UnhandledError`](UnhandledError.md)

Create a error object from EBMessage error message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`CommandErrorResponse`](../modules.md#commanderrorresponse) | CommandErrorResponse |

#### Returns

[`UnhandledError`](UnhandledError.md)

UnhandledError

#### Defined in

[src/core/UnhandledError.impl.ts:22](https://github.com/sebastianwessel/purista/blob/9753133/src/core/UnhandledError.impl.ts#L22)
