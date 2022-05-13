[PURISTA API](../README.md) / [@purista/core](../modules/purista_core.md) / UnhandledError

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

- [cause](purista_core.UnhandledError.md#cause)
- [data](purista_core.UnhandledError.md#data)
- [errorCode](purista_core.UnhandledError.md#errorcode)
- [message](purista_core.UnhandledError.md#message)
- [name](purista_core.UnhandledError.md#name)
- [stack](purista_core.UnhandledError.md#stack)
- [traceId](purista_core.UnhandledError.md#traceid)
- [prepareStackTrace](purista_core.UnhandledError.md#preparestacktrace)
- [stackTraceLimit](purista_core.UnhandledError.md#stacktracelimit)

### Methods

- [getErrorResponse](purista_core.UnhandledError.md#geterrorresponse)
- [intoHandledError](purista_core.UnhandledError.md#intohandlederror)
- [toString](purista_core.UnhandledError.md#tostring)
- [captureStackTrace](purista_core.UnhandledError.md#capturestacktrace)
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

[core/src/core/UnhandledError.impl.ts:13](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/UnhandledError.impl.ts#L13)

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

• **errorCode**: [`StatusCode`](../enums/purista_core.StatusCode.md) = `StatusCode.InternalServerError`

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

[core/src/core/UnhandledError.impl.ts:43](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/UnhandledError.impl.ts#L43)

___

### intoHandledError

▸ **intoHandledError**(): [`HandledError`](purista_core.HandledError.md)

Create a handled error from unhandled error

#### Returns

[`HandledError`](purista_core.HandledError.md)

HandledError

#### Defined in

[core/src/core/UnhandledError.impl.ts:35](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/UnhandledError.impl.ts#L35)

___

### toString

▸ **toString**(): `string`

Returns stringified error response object

#### Returns

`string`

ErrorResponse as string

#### Defined in

[core/src/core/UnhandledError.impl.ts:58](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/UnhandledError.impl.ts#L58)

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

▸ `Static` **fromMessage**(`message`): [`UnhandledError`](purista_core.UnhandledError.md)

Create a error object from EBMessage error message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`CommandErrorResponse`](../modules/purista_core.md#commanderrorresponse) | CommandErrorResponse |

#### Returns

[`UnhandledError`](purista_core.UnhandledError.md)

UnhandledError

#### Defined in

[core/src/core/UnhandledError.impl.ts:27](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/UnhandledError.impl.ts#L27)
