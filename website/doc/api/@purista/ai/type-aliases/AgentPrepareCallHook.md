[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentPrepareCallHook

# Type Alias: AgentPrepareCallHook()

> **AgentPrepareCallHook** = (`input`) => `Promise`\<[`AgentModelCallOptions`](AgentModelCallOptions.md) \| `undefined`\> \| [`AgentModelCallOptions`](AgentModelCallOptions.md) \| `undefined`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:100](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L100)

Hook executed before each model call (generate/stream/embed/...).

## Parameters

### input

[`AgentModelCallPrepareInput`](AgentModelCallPrepareInput.md)

## Returns

`Promise`\<[`AgentModelCallOptions`](AgentModelCallOptions.md) \| `undefined`\> \| [`AgentModelCallOptions`](AgentModelCallOptions.md) \| `undefined`
