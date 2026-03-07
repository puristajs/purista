[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CommandAfterGuardHook

# Type Alias: CommandAfterGuardHook()\<S, MessagePayloadType, MessageParamsType, FunctionPayloadType, FunctionParamsType, FunctionOutputType, Resources, Invokes, StreamInvokes, EmitList, AgentInvokes\>

> **CommandAfterGuardHook**\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `AgentInvokes`\> = (`this`, `context`, `result`, `originalPayload`, `originalParameter`) => `Promise`\<`void`\>

Defined in: [core/types/commandType/CommandAfterGuardHook.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandAfterGuardHook.ts#L15)

Definition of after guard hook functions.
This guard is called after function successfully returns and after output validation.

## Type Parameters

### S

`S` *extends* [`ServiceClass`](../interfaces/ServiceClass.md) = [`ServiceClass`](../interfaces/ServiceClass.md)

### MessagePayloadType

`MessagePayloadType` = `unknown`

### MessageParamsType

`MessageParamsType` = `unknown`

### FunctionPayloadType

`FunctionPayloadType` = `unknown`

### FunctionParamsType

`FunctionParamsType` = `unknown`

### FunctionOutputType

`FunctionOutputType` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](EmptyObject.md)

### Invokes

`Invokes` *extends* [`InvokeList`](InvokeList.md) = [`EmptyObject`](EmptyObject.md)

### StreamInvokes

`StreamInvokes` *extends* [`StreamInvokeList`](StreamInvokeList.md) = [`EmptyObject`](EmptyObject.md)

### EmitList

`EmitList` *extends* `Record`\<`string`, [`Schema`](Schema.md)\> = [`EmptyObject`](EmptyObject.md)

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](AgentInvokeList.md) = [`EmptyObject`](EmptyObject.md)

## Parameters

### this

`S`

### context

[`CommandFunctionContext`](CommandFunctionContext.md)\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `any`, `AgentInvokes`\>

### result

`Readonly`\<`FunctionOutputType`\>

### originalPayload

`Readonly`\<`FunctionPayloadType`\>

### originalParameter

`Readonly`\<`FunctionParamsType`\>

## Returns

`Promise`\<`void`\>
