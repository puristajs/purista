[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CommandAfterGuardHook

# Type Alias: CommandAfterGuardHook()\<S, MessagePayloadType, MessageParamsType, FunctionPayloadType, FunctionParamsType, FunctionOutputType, Resources, Invokes, EmitList\>

> **CommandAfterGuardHook**\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `Resources`, `Invokes`, `EmitList`\>: (`this`, `context`, `result`, `originalPayload`, `originalParameter`) => `Promise`\<`void`\>

Defined in: [packages/core/src/core/types/commandType/CommandAfterGuardHook.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandAfterGuardHook.ts#L13)

Definition of after guard hook functions.
This guard is called after function successfully returns and after output validation.

## Type Parameters

• **S** *extends* [`ServiceClass`](../interfaces/ServiceClass.md) = [`ServiceClass`](../interfaces/ServiceClass.md)

• **MessagePayloadType** = `unknown`

• **MessageParamsType** = `unknown`

• **FunctionPayloadType** = `unknown`

• **FunctionParamsType** = `unknown`

• **FunctionOutputType** = `unknown`

• **Resources** *extends* `Record`\<`string`, `any`\> = [`EmptyObject`](EmptyObject.md)

• **Invokes** *extends* [`InvokeList`](InvokeList.md) = [`EmptyObject`](EmptyObject.md)

• **EmitList** *extends* `Record`\<`string`, `Schema`\> = [`EmptyObject`](EmptyObject.md)

## Parameters

### this

`S`

### context

[`CommandFunctionContext`](CommandFunctionContext.md)\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `EmitList`\>

### result

`Readonly`\<`FunctionOutputType`\>

### originalPayload

`Readonly`\<`FunctionPayloadType`\>

### originalParameter

`Readonly`\<`FunctionParamsType`\>

## Returns

`Promise`\<`void`\>
