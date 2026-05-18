[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StreamFunctionContext

# Type Alias: StreamFunctionContext\<MessagePayloadType, MessageParamsType, Resources, Invokes, StreamInvokes, EmitList, QueueInvokes, Metrics\>

> **StreamFunctionContext**\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `Metrics`\> = [`Prettify`](Prettify.md)\<[`ContextBase`](ContextBase.md)\<`Metrics`\> & `PuristaMetricContextProperty`\<`Metrics`\> & [`StreamFunctionContextEnhancements`](StreamFunctionContextEnhancements.md)\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`\>\>

Defined in: [core/types/stream/StreamFunctionContext.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamFunctionContext.ts#L30)

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

### Metrics

`Metrics` *extends* `PuristaMetricDefinitions` = [`EmptyObject`](EmptyObject.md)
