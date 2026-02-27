[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentExecutionOptions

# Type Alias: AgentExecutionOptions

> **AgentExecutionOptions** = `object`

Defined in: runtime/AgentExecutor.ts:21

Dependencies required for running an agent workload.

## Properties

### knowledgeAdapters

> **knowledgeAdapters**: `Record`\<`string`, [`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md)\>

Defined in: runtime/AgentExecutor.ts:25

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: runtime/AgentExecutor.ts:26

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: runtime/AgentExecutor.ts:22

***

### provider

> **provider**: [`ModelProvider`](../interfaces/ModelProvider.md)

Defined in: runtime/AgentExecutor.ts:23

***

### sessionStore

> **sessionStore**: [`SessionStore`](../interfaces/SessionStore.md)

Defined in: runtime/AgentExecutor.ts:24

***

### startActiveSpan

> **startActiveSpan**: [`StartActiveSpanFunction`](StartActiveSpanFunction.md)

Defined in: runtime/AgentExecutor.ts:27
