[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentExecutionResult

# Type Alias: AgentExecutionResult

> **AgentExecutionResult** = `object`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:50](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/AgentExecutor.ts#L50)

Result emitted by the executor after the provider finishes.

## Properties

### durationMs?

> `optional` **durationMs**: `number`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:56](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/AgentExecutor.ts#L56)

***

### output

> **output**: `string`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:51](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/AgentExecutor.ts#L51)

***

### tokens?

> `optional` **tokens**: `object`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:52](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/AgentExecutor.ts#L52)

#### completion

> **completion**: `number`

#### prompt

> **prompt**: `number`
