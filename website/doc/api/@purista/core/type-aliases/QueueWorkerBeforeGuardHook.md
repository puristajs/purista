[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueWorkerBeforeGuardHook

# Type Alias: QueueWorkerBeforeGuardHook\<S, MessagePayloadType, MessageParamsType, Resources, Invokes, StreamInvokes\>

> **QueueWorkerBeforeGuardHook**\<`S`, `MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`\> = (`this`, `context`, `message`) => `Promise`\<`void`\>

Defined in: [core/types/queue/QueueWorkerBeforeGuardHook.ts:8](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerBeforeGuardHook.ts#L8)

## Type Parameters

### S

`S` *extends* [`ServiceClass`](../interfaces/ServiceClass.md) = [`ServiceClass`](../interfaces/ServiceClass.md)

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

### this

`S`

### context

[`QueueJobContext`](QueueJobContext.md)\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`\>

### message

`Readonly`\<[`QueueMessage`](QueueMessage.md)\<`MessagePayloadType`, `MessageParamsType`\>\>

## Returns

`Promise`\<`void`\>
