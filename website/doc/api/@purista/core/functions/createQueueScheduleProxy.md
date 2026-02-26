[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / createQueueScheduleProxy

# Function: createQueueScheduleProxy()

> **createQueueScheduleProxy**\<`TQueues`\>(`scheduleFn`, `queues?`): [`QueueScheduleFunction`](../type-aliases/QueueScheduleFunction.md) & [`QueueScheduleProxy`](../type-aliases/QueueScheduleProxy.md)\<[`QueueInvokeClientMap`](../type-aliases/QueueInvokeClientMap.md)\<`TQueues`\>\>

Defined in: [core/helper/createQueueScheduleProxy.impl.ts:6](https://github.com/puristajs/purista/blob/master/packages/core/src/core/helper/createQueueScheduleProxy.impl.ts#L6)

## Type Parameters

### TQueues

`TQueues` *extends* [`QueueInvokeList`](../type-aliases/QueueInvokeList.md)

## Parameters

### scheduleFn

[`QueueScheduleFunction`](../type-aliases/QueueScheduleFunction.md)

### queues?

`TQueues`

## Returns

[`QueueScheduleFunction`](../type-aliases/QueueScheduleFunction.md) & [`QueueScheduleProxy`](../type-aliases/QueueScheduleProxy.md)\<[`QueueInvokeClientMap`](../type-aliases/QueueInvokeClientMap.md)\<`TQueues`\>\>
