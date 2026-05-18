[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueWorkerDefinition

# Type Alias: QueueWorkerDefinition\<PayloadSchema, ParamsSchema, Resources, Invokes, StreamInvokes, EmitList, QueueInvokes, Metrics\>

> **QueueWorkerDefinition**\<`PayloadSchema`, `ParamsSchema`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `Metrics`\> = `object`

Defined in: [core/types/queue/QueueWorkerDefinition.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L39)

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

### EmitList

`EmitList` *extends* `Record`\<`string`, [`Schema`](Schema.md)\> = `Record`\<`string`, `never`\>

### QueueInvokes

`QueueInvokes` *extends* [`QueueInvokeList`](QueueInvokeList.md) = [`QueueInvokeList`](QueueInvokeList.md)

### Metrics

`Metrics` *extends* `PuristaMetricDefinitions` = [`EmptyObject`](EmptyObject.md)

## Properties

### afterGuards?

> `optional` **afterGuards?**: `Record`\<`string`, [`QueueWorkerAfterGuardHook`](QueueWorkerAfterGuardHook.md)\<[`ServiceClass`](../interfaces/ServiceClass.md), [`InferIn`](InferIn.md)\<`PayloadSchema`\>, [`InferIn`](InferIn.md)\<`ParamsSchema`\>, `Resources`, `Invokes`, `StreamInvokes`\>\>

Defined in: [core/types/queue/QueueWorkerDefinition.ts:75](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L75)

***

### beforeGuards?

> `optional` **beforeGuards?**: `Record`\<`string`, [`QueueWorkerBeforeGuardHook`](QueueWorkerBeforeGuardHook.md)\<[`ServiceClass`](../interfaces/ServiceClass.md), [`InferIn`](InferIn.md)\<`PayloadSchema`\>, [`InferIn`](InferIn.md)\<`ParamsSchema`\>, `Resources`, `Invokes`, `StreamInvokes`\>\>

Defined in: [core/types/queue/QueueWorkerDefinition.ts:64](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L64)

***

### handler

> **handler**: [`QueueWorkerHandler`](QueueWorkerHandler.md)\<`PayloadSchema`, `ParamsSchema`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `Metrics`\>

Defined in: [core/types/queue/QueueWorkerDefinition.ts:54](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L54)

***

### intervalMs?

> `optional` **intervalMs?**: `number`

Defined in: [core/types/queue/QueueWorkerDefinition.ts:52](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L52)

***

### maxParallelHandlers

> **maxParallelHandlers**: `number`

Defined in: [core/types/queue/QueueWorkerDefinition.ts:53](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L53)

***

### mode

> **mode**: [`QueueWorkerMode`](QueueWorkerMode.md)

Defined in: [core/types/queue/QueueWorkerDefinition.ts:51](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L51)

***

### name

> **name**: `string`

Defined in: [core/types/queue/QueueWorkerDefinition.ts:49](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L49)

***

### queueName

> **queueName**: `string`

Defined in: [core/types/queue/QueueWorkerDefinition.ts:50](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueWorkerDefinition.ts#L50)
