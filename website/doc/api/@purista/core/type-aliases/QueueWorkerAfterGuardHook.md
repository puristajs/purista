[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueWorkerAfterGuardHook

# Type Alias: QueueWorkerAfterGuardHook()\<S, MessagePayloadType, MessageParamsType, Resources, Invokes, StreamInvokes\>

> **QueueWorkerAfterGuardHook**\<`S`, `MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`\> = (`this`, `context`, `result`, `message`) => `Promise`\<`void`\>

Defined in: [core/types/queue/QueueWorkerAfterGuardHook.ts:9](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerAfterGuardHook.ts#L9)

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

### result

`Readonly`\<[`QueueHandlerResult`](QueueHandlerResult.md) \| `void`\>

### message

`Readonly`\<[`QueueMessage`](QueueMessage.md)\<`MessagePayloadType`, `MessageParamsType`\>\>

## Returns

`Promise`\<`void`\>
