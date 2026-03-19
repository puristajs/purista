[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentModelCallOptions

# Type Alias: AgentModelCallOptions

> **AgentModelCallOptions** = `object`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:67](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L67)

Normalized call options that can be prepared by hooks and merged into provider request metadata.

## Properties

### aiSdk?

> `optional` **aiSdk**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:75](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L75)

AI SDK specific call options merged into `request.metadata.aiSdk`.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:71](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L71)

Additional request metadata merged into `request.metadata`.
