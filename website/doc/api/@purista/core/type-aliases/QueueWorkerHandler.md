[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueWorkerHandler

# Type Alias: QueueWorkerHandler()\<MessagePayloadType, MessageParamsType, Resources, Invokes, StreamInvokes\>

> **QueueWorkerHandler**\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`\> = (`context`, `message`) => `Promise`\<[`QueueHandlerResult`](QueueHandlerResult.md) \| `void`\>

Defined in: [core/types/queue/QueueWorkerDefinition.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L14)

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

## Parameters

### context

[`QueueJobContext`](QueueJobContext.md)\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`\>

### message

[`QueueMessage`](QueueMessage.md)\<`MessagePayloadType`, `MessageParamsType`\>

## Returns

`Promise`\<[`QueueHandlerResult`](QueueHandlerResult.md) \| `void`\>
