[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentModelCallOptions

# Type Alias: AgentModelCallOptions

> **AgentModelCallOptions** = `object`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:99](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L99)

Normalized call options that can be prepared by hooks and merged into provider request metadata.

## Properties

### aiSdk?

> `optional` **aiSdk**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:107](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L107)

AI SDK specific call options merged into `request.metadata.aiSdk`.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:103](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L103)

Additional request metadata merged into `request.metadata`.
