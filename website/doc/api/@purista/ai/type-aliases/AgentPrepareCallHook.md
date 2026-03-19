[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentPrepareCallHook

# Type Alias: AgentPrepareCallHook()

> **AgentPrepareCallHook** = (`input`) => `Promise`\<[`AgentModelCallOptions`](AgentModelCallOptions.md) \| `undefined`\> \| [`AgentModelCallOptions`](AgentModelCallOptions.md) \| `undefined`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:101](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L101)

Hook executed before each model call (generate/stream/embed/...).

## Parameters

### input

[`AgentModelCallPrepareInput`](AgentModelCallPrepareInput.md)

## Returns

`Promise`\<[`AgentModelCallOptions`](AgentModelCallOptions.md) \| `undefined`\> \| [`AgentModelCallOptions`](AgentModelCallOptions.md) \| `undefined`
