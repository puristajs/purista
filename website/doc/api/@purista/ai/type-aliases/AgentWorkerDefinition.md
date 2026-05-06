[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentWorkerDefinition

# Type Alias: AgentWorkerDefinition

> **AgentWorkerDefinition** = `object`

Defined in: packages/ai/src/builder/AgentWorkerBuilder.ts:33

## Properties

### afterGuards

> **afterGuards**: `Record`\<`string`, [`QueueWorkerAfterGuardHook`](../../core/type-aliases/QueueWorkerAfterGuardHook.md)\>

Defined in: packages/ai/src/builder/AgentWorkerBuilder.ts:41

***

### agentContext?

> `optional` **agentContext**: [`AgentWorkerContext`](AgentWorkerContext.md)

Defined in: packages/ai/src/builder/AgentWorkerBuilder.ts:42

***

### beforeGuards

> **beforeGuards**: `Record`\<`string`, [`QueueWorkerBeforeGuardHook`](../../core/type-aliases/QueueWorkerBeforeGuardHook.md)\>

Defined in: packages/ai/src/builder/AgentWorkerBuilder.ts:40

***

### handler()

> **handler**: (`context`, `message`) => `Promise`\<`unknown`\>

Defined in: packages/ai/src/builder/AgentWorkerBuilder.ts:39

#### Parameters

##### context

`unknown`

##### message

`unknown`

#### Returns

`Promise`\<`unknown`\>

***

### intervalMs?

> `optional` **intervalMs**: `number`

Defined in: packages/ai/src/builder/AgentWorkerBuilder.ts:37

***

### maxParallelHandlers

> **maxParallelHandlers**: `number`

Defined in: packages/ai/src/builder/AgentWorkerBuilder.ts:38

***

### mode

> **mode**: `"continuous"` \| `"interval"` \| `"sequential"`

Defined in: packages/ai/src/builder/AgentWorkerBuilder.ts:36

***

### name

> **name**: `string`

Defined in: packages/ai/src/builder/AgentWorkerBuilder.ts:34

***

### queueName

> **queueName**: `string`

Defined in: packages/ai/src/builder/AgentWorkerBuilder.ts:35
