[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueWorkerDefinition

# Type Alias: QueueWorkerDefinition\<PayloadSchema, ParamsSchema, Resources, Invokes, StreamInvokes\>

> **QueueWorkerDefinition**\<`PayloadSchema`, `ParamsSchema`, `Resources`, `Invokes`, `StreamInvokes`\> = `object`

Defined in: [core/types/queue/QueueWorkerDefinition.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L25)

## Type Parameters

### PayloadSchema

`PayloadSchema` *extends* [`Schema`](Schema.md) = [`Schema`](Schema.md)

### ParamsSchema

`ParamsSchema` *extends* [`Schema`](Schema.md) = [`Schema`](Schema.md)

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](EmptyObject.md)

### Invokes

`Invokes` *extends* [`InvokeList`](InvokeList.md) = [`EmptyObject`](EmptyObject.md)

### StreamInvokes

`StreamInvokes` *extends* [`StreamInvokeList`](StreamInvokeList.md) = [`EmptyObject`](EmptyObject.md)

## Properties

### afterGuards?

> `optional` **afterGuards?**: `Record`\<`string`, [`QueueWorkerAfterGuardHook`](QueueWorkerAfterGuardHook.md)\<[`ServiceClass`](../interfaces/ServiceClass.md), [`InferIn`](InferIn.md)\<`PayloadSchema`\>, [`InferIn`](InferIn.md)\<`ParamsSchema`\>, `Resources`, `Invokes`, `StreamInvokes`\>\>

Defined in: [core/types/queue/QueueWorkerDefinition.ts:49](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L49)

***

### beforeGuards?

> `optional` **beforeGuards?**: `Record`\<`string`, [`QueueWorkerBeforeGuardHook`](QueueWorkerBeforeGuardHook.md)\<[`ServiceClass`](../interfaces/ServiceClass.md), [`InferIn`](InferIn.md)\<`PayloadSchema`\>, [`InferIn`](InferIn.md)\<`ParamsSchema`\>, `Resources`, `Invokes`, `StreamInvokes`\>\>

Defined in: [core/types/queue/QueueWorkerDefinition.ts:38](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L38)

***

### handler

> **handler**: [`QueueWorkerHandler`](QueueWorkerHandler.md)\<`PayloadSchema`, `ParamsSchema`, `Resources`, `Invokes`, `StreamInvokes`\>

Defined in: [core/types/queue/QueueWorkerDefinition.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L37)

***

### intervalMs?

> `optional` **intervalMs?**: `number`

Defined in: [core/types/queue/QueueWorkerDefinition.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L35)

***

### maxParallelHandlers

> **maxParallelHandlers**: `number`

Defined in: [core/types/queue/QueueWorkerDefinition.ts:36](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L36)

***

### mode

> **mode**: [`QueueWorkerMode`](QueueWorkerMode.md)

Defined in: [core/types/queue/QueueWorkerDefinition.ts:34](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L34)

***

### name

> **name**: `string`

Defined in: [core/types/queue/QueueWorkerDefinition.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L32)

***

### queueName

> **queueName**: `string`

Defined in: [core/types/queue/QueueWorkerDefinition.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L33)
