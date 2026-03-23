[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / BaseAgentInstanceOptions

# Type Alias: BaseAgentInstanceOptions\<SkillNames\>

> **BaseAgentInstanceOptions**\<`SkillNames`\> = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:18](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L18)

## Type Parameters

### SkillNames

`SkillNames` *extends* `string` = `string`

## Properties

### concurrencyHints?

> `optional` **concurrencyHints**: `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:45](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L45)

Optional host-provided hints for dashboards and alerts.
These values are informational only and never used for runtime admission control.

#### replicaCountHint?

> `optional` **replicaCountHint**: `number`

***

### config?

> `optional` **config**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:48](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L48)

***

### configStore?

> `optional` **configStore**: [`ConfigStore`](../../core/interfaces/ConfigStore.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:23](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L23)

***

### conversationStore?

> `optional` **conversationStore**: [`ConversationStore`](../interfaces/ConversationStore.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:26](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L26)

***

### logger?

> `optional` **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:19](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L19)

***

### models?

> `optional` **models**: `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:28](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L28)

***

### poolConfig?

> `optional` **poolConfig**: `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:32](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L32)

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

Defined in: [packages/ai/src/types/AgentDefinition.ts:27](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L27)

***

### queueBridge?

> `optional` **queueBridge**: [`QueueBridge`](../../core/interfaces/QueueBridge.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:25](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L25)

***

### ~~resources?~~

> `optional` **resources**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:31](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L31)

#### Deprecated

use `models`

***

### secretStore?

> `optional` **secretStore**: [`SecretStore`](../../core/interfaces/SecretStore.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:22](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L22)

***

### skills?

> `optional` **skills**: [`SkillResource`](SkillResource.md) \| [`SkillSourceMap`](SkillSourceMap.md)\<`SkillNames`\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:29](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L29)

***

### spanProcessor?

> `optional` **spanProcessor**: `SpanProcessor`

Defined in: [packages/ai/src/types/AgentDefinition.ts:20](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L20)

***

### stateStore?

> `optional` **stateStore**: [`StateStore`](../../core/interfaces/StateStore.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:24](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L24)

***

### tracer?

> `optional` **tracer**: `Tracer`

Defined in: [packages/ai/src/types/AgentDefinition.ts:21](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L21)
