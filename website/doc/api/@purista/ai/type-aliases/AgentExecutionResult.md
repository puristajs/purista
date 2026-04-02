[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentExecutionResult

# Type Alias: AgentExecutionResult

> **AgentExecutionResult** = `object`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:50](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/AgentExecutor.ts#L50)

Result emitted by the executor after the provider finishes.

## Properties

### durationMs?

> `optional` **durationMs**: `number`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:56](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/AgentExecutor.ts#L56)

***

### output

> **output**: `string`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:51](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/AgentExecutor.ts#L51)

***

### tokens?

> `optional` **tokens**: `object`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:52](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/AgentExecutor.ts#L52)

#### completion

> **completion**: `number`

#### prompt

> **prompt**: `number`
