[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentModelCallPrepareInput

# Type Alias: AgentModelCallPrepareInput

> **AgentModelCallPrepareInput** = `object`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:113](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L113)

Input passed to model call preparation hooks.

## Properties

### alias

> **alias**: `string`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:114](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L114)

***

### callKind

> **callKind**: [`AgentModelCallKind`](AgentModelCallKind.md)

Defined in: [packages/ai/src/builder/AgentBuilder.ts:115](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L115)

***

### requestMetadata?

> `optional` **requestMetadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:127](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L127)

Original request metadata provided by handler code for this call.

***

### step

> **step**: `number`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:119](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L119)

1-based sequential index of model invocations in the current agent run.

***

### stepByAliasAndKind

> **stepByAliasAndKind**: `number`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:123](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L123)

1-based index scoped by model alias + call kind.
