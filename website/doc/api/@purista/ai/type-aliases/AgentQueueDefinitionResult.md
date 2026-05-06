[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentQueueDefinitionResult

# Type Alias: AgentQueueDefinitionResult\<T\>

> **AgentQueueDefinitionResult**\<`T`\> = `object`

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:59

## Type Parameters

### T

`T` *extends* [`AgentQueueBuilderTypes`](AgentQueueBuilderTypes.md) = [`AgentQueueBuilderTypes`](AgentQueueBuilderTypes.md)

## Properties

### \_\_agentTypes?

> `optional` **\_\_agentTypes**: `T`\[`"Models"`\]

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:77

***

### manifest

> **manifest**: [`AgentManifestConfig`](AgentManifestConfig.md)

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:62

***

### queue

> **queue**: [`QueueDefinition`](../../core/type-aliases/QueueDefinition.md) & [`QueueDefinition`](../../core/type-aliases/QueueDefinition.md)\<`T`\[`"PayloadSchema"`\], `T`\[`"ParameterSchema"`\], `T`\[`"Resources"`\]\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:60

***

### worker

> **worker**: [`QueueWorkerDefinition`](../../core/type-aliases/QueueWorkerDefinition.md) & [`QueueWorkerDefinition`](../../core/type-aliases/QueueWorkerDefinition.md)\<`T`\[`"PayloadSchema"`\], `T`\[`"ParameterSchema"`\], `T`\[`"Resources"`\]\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:61

## Methods

### getInstance()

> **getInstance**(`eventBridge`, `options?`): `Promise`\<[`AgentInstance`](../classes/AgentInstance.md)\<[`Infer`](../../core/type-aliases/Infer.md)\<`T`\[`"PayloadSchema"`\]\>, [`Infer`](../../core/type-aliases/Infer.md)\<`T`\[`"ParameterSchema"`\]\>, `T`\[`"Resources"`\], `T`\[`"Models"`\], `T`\[`"AgentInvokes"`\], `T`\[`"EmitPayloads"`\], `T`\[`"ToolInvokes"`\]\>\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:63

#### Parameters

##### eventBridge

[`EventBridge`](../../core/interfaces/EventBridge.md)

##### options?

[`AgentInstanceOptions`](AgentInstanceOptions.md)\<`string`, `Record`\<`string`, `unknown`\>\>

#### Returns

`Promise`\<[`AgentInstance`](../classes/AgentInstance.md)\<[`Infer`](../../core/type-aliases/Infer.md)\<`T`\[`"PayloadSchema"`\]\>, [`Infer`](../../core/type-aliases/Infer.md)\<`T`\[`"ParameterSchema"`\]\>, `T`\[`"Resources"`\], `T`\[`"Models"`\], `T`\[`"AgentInvokes"`\], `T`\[`"EmitPayloads"`\], `T`\[`"ToolInvokes"`\]\>\>
