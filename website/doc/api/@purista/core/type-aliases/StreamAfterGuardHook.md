[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StreamAfterGuardHook

# Type Alias: StreamAfterGuardHook()\<S, MessagePayloadType, MessageParamsType, FunctionPayloadType, FunctionParamsType, FunctionFinalType, Resources, Invokes, StreamInvokes, EmitList, QueueInvokes, AgentInvokes\>

> **StreamAfterGuardHook**\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionFinalType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `AgentInvokes`\> = (`this`, `context`, `result`, `originalPayload`, `originalParameter`) => `Promise`\<`void`\>

Defined in: core/types/stream/StreamAfterGuardHook.ts:19

Guard called after a stream completes successfully and the final payload has
been validated.

`result` is the final payload written via `writer.close(...)`, or the
aggregated final payload when chunk aggregation is enabled.

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

### FunctionFinalType

`FunctionFinalType` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](EmptyObject.md)

### Invokes

`Invokes` *extends* [`InvokeList`](InvokeList.md) = [`EmptyObject`](EmptyObject.md)

### StreamInvokes

`StreamInvokes` *extends* [`StreamInvokeList`](StreamInvokeList.md) = [`EmptyObject`](EmptyObject.md)

### EmitList

`EmitList` *extends* `Record`\<`string`, [`Schema`](Schema.md)\> = [`EmptyObject`](EmptyObject.md)

### QueueInvokes

`QueueInvokes` *extends* [`QueueInvokeList`](QueueInvokeList.md) = [`QueueInvokeList`](QueueInvokeList.md)

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](AgentInvokeList.md) = [`EmptyObject`](EmptyObject.md)

## Parameters

### this

`S`

### context

[`StreamFunctionContext`](StreamFunctionContext.md)\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `AgentInvokes`\>

### result

`Readonly`\<`FunctionFinalType`\>

### originalPayload

`Readonly`\<`FunctionPayloadType`\>

### originalParameter

`Readonly`\<`FunctionParamsType`\>

## Returns

`Promise`\<`void`\>
