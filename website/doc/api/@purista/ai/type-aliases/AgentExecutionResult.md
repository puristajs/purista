[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentExecutionResult

# Type Alias: AgentExecutionResult

> **AgentExecutionResult** = `object`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:43](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/AgentExecutor.ts#L43)

Result emitted by the executor after the provider finishes.

## Properties

### durationMs?

> `optional` **durationMs**: `number`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:49](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/AgentExecutor.ts#L49)

***

### output

> **output**: `string`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:44](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/AgentExecutor.ts#L44)

***

### tokens?

> `optional` **tokens**: `object`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:45](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/AgentExecutor.ts#L45)

#### completion

> **completion**: `number`

#### prompt

> **prompt**: `number`
