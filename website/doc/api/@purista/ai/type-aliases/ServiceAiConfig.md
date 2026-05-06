[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ServiceAiConfig

# Type Alias: ServiceAiConfig\<AgentModels, AgentSkills\>

> **ServiceAiConfig**\<`AgentModels`, `AgentSkills`\> = keyof `AgentModels` *extends* `never` ? `object` : `object` & `object`

Defined in: packages/ai/src/builder/ServiceBuilder.ts:21

## Type Declaration

### conversationStore?

> `optional` **conversationStore**: [`ConversationStore`](../interfaces/ConversationStore.md)

### poolConfig?

> `optional` **poolConfig**: `object`

#### poolConfig.maxConcurrencyPerInstance?

> `optional` **maxConcurrencyPerInstance**: `number`

#### poolConfig.poolId?

> `optional` **poolId**: `string`

### poolManager?

> `optional` **poolManager**: [`PoolManager`](../classes/PoolManager.md)

### sandbox?

> `optional` **sandbox**: [`AgentSandboxRuntimeConfig`](AgentSandboxRuntimeConfig.md)\<`Record`\<`string`, `unknown`\>\>

### skills?

> `optional` **skills**: `AgentSkills`

## Type Parameters

### AgentModels

`AgentModels` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\> = `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

### AgentSkills

`AgentSkills` *extends* [`SkillSourceMap`](SkillSourceMap.md)\<`string`\> \| [`SkillResource`](SkillResource.md) = [`SkillResource`](SkillResource.md)
