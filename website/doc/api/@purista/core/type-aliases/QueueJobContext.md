[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueJobContext

# Type Alias: QueueJobContext\<MessagePayloadType, MessageParamsType, Resources, Invokes, StreamInvokes, EmitList, QueueInvokes, Metrics\>

> **QueueJobContext**\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `Metrics`\> = [`ContextBase`](ContextBase.md)\<`Metrics`\> & `PuristaMetricContextProperty`\<`Metrics`\> & `object`

Defined in: [core/types/queue/QueueJobContext.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobContext.ts#L22)

## Type Declaration

### emit

> **emit**: [`EmitCustomMessageFunction`](EmitCustomMessageFunction.md)\<`EmitList`\>

### job

> **job**: [`QueueJobControls`](QueueJobControls.md)

### message

> **message**: `Readonly`\<[`QueueMessage`](QueueMessage.md)\<`MessagePayloadType`, `MessageParamsType`\>\>

### queue

> **queue**: [`QueueContext`](QueueContext.md)\<`QueueInvokes`\>

### resources

> **resources**: `Resources`

### service

> **service**: `Invokes`

### signal

> **signal**: `AbortSignal`

### stream

> **stream**: `StreamInvokes`

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

`EmitList` *extends* `Record`\<`string`, [`Schema`](Schema.md)\> = `Record`\<`string`, `never`\>

### QueueInvokes

`QueueInvokes` *extends* [`QueueInvokeList`](QueueInvokeList.md) = [`QueueInvokeList`](QueueInvokeList.md)

### Metrics

`Metrics` *extends* `PuristaMetricDefinitions` = [`EmptyObject`](EmptyObject.md)
