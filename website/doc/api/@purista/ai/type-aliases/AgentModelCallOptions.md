[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentModelCallOptions

# Type Alias: AgentModelCallOptions

> **AgentModelCallOptions** = `object`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:122](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/builder/AgentBuilder.ts#L122)

Normalized call options that can be prepared by hooks and merged into provider request metadata.

## Properties

### aiSdk?

> `optional` **aiSdk**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:130](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/builder/AgentBuilder.ts#L130)

AI SDK specific call options merged into `request.metadata.aiSdk`.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:126](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/builder/AgentBuilder.ts#L126)

Additional request metadata merged into `request.metadata`.
