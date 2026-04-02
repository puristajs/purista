[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueJobContext

# Type Alias: QueueJobContext\<MessagePayloadType, MessageParamsType, Resources, Invokes, StreamInvokes, EmitList\>

> **QueueJobContext**\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`\> = [`ContextBase`](ContextBase.md) & `object`

Defined in: [core/types/queue/QueueJobContext.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobContext.ts#L18)

## Type Declaration

### emit

> **emit**: [`EmitCustomMessageFunction`](EmitCustomMessageFunction.md)\<`EmitList`\>

### job

> **job**: [`QueueJobControls`](QueueJobControls.md)

### message

> **message**: `Readonly`\<[`QueueMessage`](QueueMessage.md)\<`MessagePayloadType`, `MessageParamsType`\>\>

### resources

> **resources**: `Resources`

### service

> **service**: `Invokes`

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
