[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / BaseAgentInstanceOptions

# Type Alias: BaseAgentInstanceOptions\<SkillNames, Resources, ConfigInput\>

> **BaseAgentInstanceOptions**\<`SkillNames`, `Resources`, `ConfigInput`\> = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:29](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/types/AgentDefinition.ts#L29)

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

Defined in: [packages/ai/src/types/AgentDefinition.ts:66](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/types/AgentDefinition.ts#L66)

Optional host-provided hints for dashboards and alerts.
These values are informational only and never used for runtime admission control.

#### replicaCountHint?

> `optional` **replicaCountHint**: `number`

***

### config?

> `optional` **config**: keyof `ConfigInput` *extends* `never` ? `never` : `ConfigInput`

Defined in: [packages/ai/src/types/AgentDefinition.ts:69](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/types/AgentDefinition.ts#L69)

***

### configStore?

> `optional` **configStore**: [`ConfigStore`](../../core/interfaces/ConfigStore.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:38](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/types/AgentDefinition.ts#L38)

***

### conversationStore?

> `optional` **conversationStore**: [`ConversationStore`](../interfaces/ConversationStore.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:41](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/types/AgentDefinition.ts#L41)

***

### logger?

> `optional` **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:34](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/types/AgentDefinition.ts#L34)

***

### models?

> `optional` **models**: `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:43](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/types/AgentDefinition.ts#L43)

***

### poolConfig?

> `optional` **poolConfig**: `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:53](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/types/AgentDefinition.ts#L53)

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

Defined in: [packages/ai/src/types/AgentDefinition.ts:42](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/types/AgentDefinition.ts#L42)

***

### queueBridge?

> `optional` **queueBridge**: [`QueueBridge`](../../core/interfaces/QueueBridge.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:40](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/types/AgentDefinition.ts#L40)

***

### resources?

> `optional` **resources**: keyof `Resources` *extends* `never` ? `never` : `Resources`

Defined in: [packages/ai/src/types/AgentDefinition.ts:52](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/types/AgentDefinition.ts#L52)

***

### secretStore?

> `optional` **secretStore**: [`SecretStore`](../../core/interfaces/SecretStore.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:37](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/types/AgentDefinition.ts#L37)

***

### skills?

> `optional` **skills**: [`SkillResource`](SkillResource.md) \| [`SkillSourceMap`](SkillSourceMap.md)\<`SkillNames`\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:51](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/types/AgentDefinition.ts#L51)

Provide the skill implementations for names declared via `builder.useSkills([...])`.

The common paths are:
- inline typed skill maps for tests and small agents
- file-based skill resources for reusable application catalogs

***

### spanProcessor?

> `optional` **spanProcessor**: `SpanProcessor`

Defined in: [packages/ai/src/types/AgentDefinition.ts:35](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/types/AgentDefinition.ts#L35)

***

### stateStore?

> `optional` **stateStore**: [`StateStore`](../../core/interfaces/StateStore.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:39](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/types/AgentDefinition.ts#L39)

***

### tracer?

> `optional` **tracer**: `Tracer`

Defined in: [packages/ai/src/types/AgentDefinition.ts:36](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/types/AgentDefinition.ts#L36)
