[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentModelCallOptions

# Type Alias: AgentModelCallOptions

> **AgentModelCallOptions** = `object`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:66](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L66)

Normalized call options that can be prepared by hooks and merged into provider request metadata.

## Properties

### aiSdk?

> `optional` **aiSdk**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:74](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L74)

AI SDK specific call options merged into `request.metadata.aiSdk`.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:70](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L70)

Additional request metadata merged into `request.metadata`.
