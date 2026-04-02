[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentPrepareCallHook

# Type Alias: AgentPrepareCallHook()

> **AgentPrepareCallHook** = (`input`) => `Promise`\<[`AgentModelCallOptions`](AgentModelCallOptions.md) \| `undefined`\> \| [`AgentModelCallOptions`](AgentModelCallOptions.md) \| `undefined`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:156](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/builder/AgentBuilder.ts#L156)

Hook executed before each model call (generate/stream/embed/...).

## Parameters

### input

[`AgentModelCallPrepareInput`](AgentModelCallPrepareInput.md)

## Returns

`Promise`\<[`AgentModelCallOptions`](AgentModelCallOptions.md) \| `undefined`\> \| [`AgentModelCallOptions`](AgentModelCallOptions.md) \| `undefined`
