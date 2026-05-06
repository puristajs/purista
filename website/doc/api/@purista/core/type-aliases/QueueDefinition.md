[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueDefinition

# Type Alias: QueueDefinition\<PayloadSchema, ParamsSchema, Resources, Invokes, StreamInvokes\>

> **QueueDefinition**\<`PayloadSchema`, `ParamsSchema`, `Resources`, `Invokes`, `StreamInvokes`\> = `object`

Defined in: [core/types/queue/QueueDefinition.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueDefinition.ts#L11)

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

### deadLetter?

> `optional` **deadLetter**: `object`

Defined in: [core/types/queue/QueueDefinition.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueDefinition.ts#L27)

#### queueName?

> `optional` **queueName**: `string`

***

### deprecated

> **deprecated**: `boolean`

Defined in: [core/types/queue/QueueDefinition.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueDefinition.ts#L23)

***

### description

> **description**: `string`

Defined in: [core/types/queue/QueueDefinition.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueDefinition.ts#L19)

***

### lifecycle?

> `optional` **lifecycle**: [`QueueLifecycleConfig`](QueueLifecycleConfig.md)

Defined in: [core/types/queue/QueueDefinition.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueDefinition.ts#L24)

***

### parameterSchema?

> `optional` **parameterSchema**: `ParamsSchema`

Defined in: [core/types/queue/QueueDefinition.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueDefinition.ts#L21)

***

### payloadSchema?

> `optional` **payloadSchema**: `PayloadSchema`

Defined in: [core/types/queue/QueueDefinition.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueDefinition.ts#L20)

***

### queueBridgeConfig

> **queueBridgeConfig**: [`DefinitionQueueBridgeConfig`](DefinitionQueueBridgeConfig.md)

Defined in: [core/types/queue/QueueDefinition.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueDefinition.ts#L25)

***

### queueName

> **queueName**: `string`

Defined in: [core/types/queue/QueueDefinition.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueDefinition.ts#L18)

***

### tags

> **tags**: `string`[]

Defined in: [core/types/queue/QueueDefinition.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueDefinition.ts#L22)

***

### transformBeforeEnqueue?

> `optional` **transformBeforeEnqueue**: [`QueueTransformHook`](QueueTransformHook.md)\<[`ServiceClass`](../interfaces/ServiceClass.md), [`Infer`](Infer.md)\<`PayloadSchema`\>, [`Infer`](Infer.md)\<`ParamsSchema`\>, `Resources`\>

Defined in: [core/types/queue/QueueDefinition.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueDefinition.ts#L30)

***

### transformBeforeExecute?

> `optional` **transformBeforeExecute**: [`QueueTransformHook`](QueueTransformHook.md)\<[`ServiceClass`](../interfaces/ServiceClass.md), [`Infer`](Infer.md)\<`PayloadSchema`\>, [`Infer`](Infer.md)\<`ParamsSchema`\>, `Resources`\>

Defined in: [core/types/queue/QueueDefinition.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueDefinition.ts#L31)

***

### workers

> **workers**: [`QueueWorkerDefinition`](QueueWorkerDefinition.md)\<`PayloadSchema`, `ParamsSchema`, `Resources`, `Invokes`, `StreamInvokes`\>[]

Defined in: [core/types/queue/QueueDefinition.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueDefinition.ts#L26)
