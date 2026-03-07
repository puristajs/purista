[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StreamFunctionContextEnhancements

# Type Alias: StreamFunctionContextEnhancements\<MessagePayloadType, MessageParamsType, Resources, Invokes, StreamInvokes, EmitList, QueueInvokes, AgentInvokes\>

> **StreamFunctionContextEnhancements**\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `AgentInvokes`\> = `object`

Defined in: [core/types/stream/StreamFunctionContext.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamFunctionContext.ts#L13)

## Type Parameters

### MessagePayloadType

`MessagePayloadType` = `unknown`

### MessageParamsType

`MessageParamsType` = `unknown`

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

## Properties

### emit

> **emit**: [`EmitCustomMessageFunction`](EmitCustomMessageFunction.md)\<`EmitList`\>

Defined in: [core/types/stream/StreamFunctionContext.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamFunctionContext.ts#L24)

***

### invokeAgent

> **invokeAgent**: `AgentInvokes`

Defined in: [core/types/stream/StreamFunctionContext.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamFunctionContext.ts#L32)

Invokes an agent and returns the result.

***

### message

> **message**: `Readonly`\<[`StreamOpenRequest`](StreamOpenRequest.md)\<`MessagePayloadType`, `MessageParamsType`\>\>

Defined in: [core/types/stream/StreamFunctionContext.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamFunctionContext.ts#L23)

***

### queue

> **queue**: [`QueueContext`](QueueContext.md)\<`QueueInvokes`\>

Defined in: [core/types/stream/StreamFunctionContext.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamFunctionContext.ts#L27)

***

### resources

> **resources**: `Resources`

Defined in: [core/types/stream/StreamFunctionContext.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamFunctionContext.ts#L28)

***

### service

> **service**: `Invokes`

Defined in: [core/types/stream/StreamFunctionContext.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamFunctionContext.ts#L25)

***

### stream

> **stream**: `StreamInvokes`

Defined in: [core/types/stream/StreamFunctionContext.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamFunctionContext.ts#L26)
