[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StreamFunction

# Type Alias: StreamFunction\<S, MessagePayloadType, MessageParamsType, FunctionPayloadType, FunctionParamsType, ChunkType, FinalType, Resources, Invokes, StreamInvokes, EmitList, QueueInvokes\>

> **StreamFunction**\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `ChunkType`, `FinalType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`\> = (`this`, `context`, `payload`, `parameter`, `writer`) => `Promise`\<`void`\>

Defined in: [core/types/stream/StreamFunction.ts:10](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamFunction.ts#L10)

## Type Parameters

### S

`S` *extends* [`ServiceClass`](../interfaces/ServiceClass.md)

### MessagePayloadType

`MessagePayloadType` = `unknown`

### MessageParamsType

`MessageParamsType` = `unknown`

### FunctionPayloadType

`FunctionPayloadType` = `unknown`

### FunctionParamsType

`FunctionParamsType` = `unknown`

### ChunkType

`ChunkType` = `unknown`

### FinalType

`FinalType` = `unknown`

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

## Parameters

### this

`S`

### context

[`StreamFunctionContext`](StreamFunctionContext.md)\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`\>

### payload

`Readonly`\<`FunctionPayloadType`\>

### parameter

`Readonly`\<`FunctionParamsType`\>

### writer

[`StreamWriter`](../interfaces/StreamWriter.md)\<`ChunkType`, `FinalType`\>

## Returns

`Promise`\<`void`\>
