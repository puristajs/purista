[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentModelCallPrepareInput

# Type Alias: AgentModelCallPrepareInput

> **AgentModelCallPrepareInput** = `object`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:80](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L80)

Input passed to model call preparation hooks.

## Properties

### alias

> **alias**: `string`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:81](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L81)

***

### callKind

> **callKind**: [`AgentModelCallKind`](AgentModelCallKind.md)

Defined in: [packages/ai/src/builder/AgentBuilder.ts:82](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L82)

***

### requestMetadata?

> `optional` **requestMetadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:94](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L94)

Original request metadata provided by handler code for this call.

***

### step

> **step**: `number`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:86](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L86)

1-based sequential index of model invocations in the current agent run.

***

### stepByAliasAndKind

> **stepByAliasAndKind**: `number`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:90](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L90)

1-based index scoped by model alias + call kind.
