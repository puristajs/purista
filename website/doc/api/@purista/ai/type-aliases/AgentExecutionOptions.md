[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentExecutionOptions

# Type Alias: AgentExecutionOptions

> **AgentExecutionOptions** = `object`

Defined in: [ai/src/runtime/AgentExecutor.ts:21](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/AgentExecutor.ts#L21)

Dependencies required for running an agent workload.

## Properties

### knowledgeAdapters

> **knowledgeAdapters**: `Record`\<`string`, [`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md)\>

Defined in: [ai/src/runtime/AgentExecutor.ts:25](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/AgentExecutor.ts#L25)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [ai/src/runtime/AgentExecutor.ts:26](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/AgentExecutor.ts#L26)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [ai/src/runtime/AgentExecutor.ts:22](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/AgentExecutor.ts#L22)

***

### provider

> **provider**: [`ModelProvider`](../interfaces/ModelProvider.md)

Defined in: [ai/src/runtime/AgentExecutor.ts:23](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/AgentExecutor.ts#L23)

***

### sessionStore

> **sessionStore**: [`SessionStore`](../interfaces/SessionStore.md)

Defined in: [ai/src/runtime/AgentExecutor.ts:24](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/AgentExecutor.ts#L24)

***

### startActiveSpan

> **startActiveSpan**: [`StartActiveSpanFunction`](StartActiveSpanFunction.md)

Defined in: [ai/src/runtime/AgentExecutor.ts:27](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/AgentExecutor.ts#L27)
