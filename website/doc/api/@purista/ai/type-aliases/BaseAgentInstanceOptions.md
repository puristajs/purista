[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / BaseAgentInstanceOptions

# Type Alias: BaseAgentInstanceOptions\<SkillNames, Resources, ConfigInput\>

> **BaseAgentInstanceOptions**\<`SkillNames`, `Resources`, `ConfigInput`\> = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:28](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L28)

## Type Parameters

### SkillNames

`SkillNames` *extends* `string` = `string`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

### ConfigInput

`ConfigInput` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

## Properties

### concurrencyHints?

> `optional` **concurrencyHints**: `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:65](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L65)

Optional host-provided hints for dashboards and alerts.
These values are informational only and never used for runtime admission control.

#### replicaCountHint?

> `optional` **replicaCountHint**: `number`

***

### config?

> `optional` **config**: keyof `ConfigInput` *extends* `never` ? `never` : `ConfigInput`

Defined in: [packages/ai/src/types/AgentDefinition.ts:68](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L68)

***

### configStore?

> `optional` **configStore**: [`ConfigStore`](../../core/interfaces/ConfigStore.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:37](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L37)

***

### conversationStore?

> `optional` **conversationStore**: [`ConversationStore`](../interfaces/ConversationStore.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:40](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L40)

***

### logger?

> `optional` **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:33](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L33)

***

### models?

> `optional` **models**: `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:42](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L42)

***

### poolConfig?

> `optional` **poolConfig**: `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:52](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L52)

#### maxConcurrencyPerInstance?

> `optional` **maxConcurrencyPerInstance**: `number`

Maximum number of concurrent agent runs per process/instance.
Total system throughput is derived by deployment replicas:
`effectiveMaxConcurrency = replicas * maxConcurrencyPerInstance`.

#### poolId?

> `optional` **poolId**: `string`

***

### poolManager?

> `optional` **poolManager**: [`PoolManager`](../classes/PoolManager.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:41](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L41)

***

### queueBridge?

> `optional` **queueBridge**: [`QueueBridge`](../../core/interfaces/QueueBridge.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:39](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L39)

***

### resources?

> `optional` **resources**: keyof `Resources` *extends* `never` ? `never` : `Resources`

Defined in: [packages/ai/src/types/AgentDefinition.ts:51](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L51)

***

### secretStore?

> `optional` **secretStore**: [`SecretStore`](../../core/interfaces/SecretStore.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:36](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L36)

***

### skills?

> `optional` **skills**: [`SkillResource`](SkillResource.md) \| [`SkillSourceMap`](SkillSourceMap.md)\<`SkillNames`\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:50](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L50)

Provide the skill implementations for names declared via `builder.useSkills([...])`.

The common paths are:
- inline typed skill maps for tests and small agents
- file-based skill resources for reusable application catalogs

***

### spanProcessor?

> `optional` **spanProcessor**: `SpanProcessor`

Defined in: [packages/ai/src/types/AgentDefinition.ts:34](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L34)

***

### stateStore?

> `optional` **stateStore**: [`StateStore`](../../core/interfaces/StateStore.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:38](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L38)

***

### tracer?

> `optional` **tracer**: `Tracer`

Defined in: [packages/ai/src/types/AgentDefinition.ts:35](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L35)
