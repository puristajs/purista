[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentModelCallPrepareInput

# Type Alias: AgentModelCallPrepareInput

> **AgentModelCallPrepareInput** = `object`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:81](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L81)

Input passed to model call preparation hooks.

## Properties

### alias

> **alias**: `string`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:82](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L82)

***

### callKind

> **callKind**: [`AgentModelCallKind`](AgentModelCallKind.md)

Defined in: [packages/ai/src/builder/AgentBuilder.ts:83](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L83)

***

### requestMetadata?

> `optional` **requestMetadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:95](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L95)

Original request metadata provided by handler code for this call.

***

### step

> **step**: `number`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:87](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L87)

1-based sequential index of model invocations in the current agent run.

***

### stepByAliasAndKind

> **stepByAliasAndKind**: `number`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:91](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L91)

1-based index scoped by model alias + call kind.
