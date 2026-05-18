[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CommandFunctionContext

# Type Alias: CommandFunctionContext\<MessagePayloadType, MessageParamsType, Resources, Invokes, StreamInvokes, EmitList, QueueInvokes, Metrics\>

> **CommandFunctionContext**\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `Metrics`\> = [`Prettify`](Prettify.md)\<[`ContextBase`](ContextBase.md)\<`Metrics`\> & `PuristaMetricContextProperty`\<`Metrics`\> & [`CommandFunctionContextEnhancements`](CommandFunctionContextEnhancements.md)\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`\>\>

Defined in: [core/types/commandType/CommandFunctionContext.ts:67](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L67)

The command function context which will be passed into command function.

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
