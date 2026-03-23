[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentModelCallPrepareInput

# Type Alias: AgentModelCallPrepareInput

> **AgentModelCallPrepareInput** = `object`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:124](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/builder/AgentBuilder.ts#L124)

Input passed to model call preparation hooks.

## Properties

### alias

> **alias**: `string`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:125](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/builder/AgentBuilder.ts#L125)

***

### callKind

> **callKind**: [`AgentModelCallKind`](AgentModelCallKind.md)

Defined in: [packages/ai/src/builder/AgentBuilder.ts:126](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/builder/AgentBuilder.ts#L126)

***

### requestMetadata?

> `optional` **requestMetadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:138](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/builder/AgentBuilder.ts#L138)

Original request metadata provided by handler code for this call.

***

### step

> **step**: `number`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:130](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/builder/AgentBuilder.ts#L130)

1-based sequential index of model invocations in the current agent run.

***

### stepByAliasAndKind

> **stepByAliasAndKind**: `number`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:134](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/builder/AgentBuilder.ts#L134)

1-based index scoped by model alias + call kind.
