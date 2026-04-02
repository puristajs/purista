[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentModelCallPrepareInput

# Type Alias: AgentModelCallPrepareInput

> **AgentModelCallPrepareInput** = `object`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:136](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/builder/AgentBuilder.ts#L136)

Input passed to model call preparation hooks.

## Properties

### alias

> **alias**: `string`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:137](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/builder/AgentBuilder.ts#L137)

***

### callKind

> **callKind**: [`AgentModelCallKind`](AgentModelCallKind.md)

Defined in: [packages/ai/src/builder/AgentBuilder.ts:138](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/builder/AgentBuilder.ts#L138)

***

### requestMetadata?

> `optional` **requestMetadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:150](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/builder/AgentBuilder.ts#L150)

Original request metadata provided by handler code for this call.

***

### step

> **step**: `number`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:142](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/builder/AgentBuilder.ts#L142)

1-based sequential index of model invocations in the current agent run.

***

### stepByAliasAndKind

> **stepByAliasAndKind**: `number`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:146](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/builder/AgentBuilder.ts#L146)

1-based index scoped by model alias + call kind.
