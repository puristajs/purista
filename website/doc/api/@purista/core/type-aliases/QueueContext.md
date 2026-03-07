[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueContext

# Type Alias: QueueContext\<Queues\>

> **QueueContext**\<`Queues`\> = `object`

Defined in: [core/types/queue/QueueContext.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueContext.ts#L37)

## Type Parameters

### Queues

`Queues` *extends* [`QueueInvokeList`](QueueInvokeList.md) = [`QueueInvokeList`](QueueInvokeList.md)

## Properties

### enqueue

> **enqueue**: [`QueueInvokeFunction`](QueueInvokeFunction.md) & [`QueueInvokeClientMap`](QueueInvokeClientMap.md)\<`Queues`\>

Defined in: [core/types/queue/QueueContext.ts:38](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueContext.ts#L38)

***

### scheduleAt

> **scheduleAt**: [`QueueScheduleFunction`](QueueScheduleFunction.md) & [`QueueScheduleProxy`](QueueScheduleProxy.md)\<[`QueueInvokeClientMap`](QueueInvokeClientMap.md)\<`Queues`\>\>

Defined in: [core/types/queue/QueueContext.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueContext.ts#L39)
