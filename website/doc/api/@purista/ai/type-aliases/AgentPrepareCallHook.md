[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentPrepareCallHook

# Type Alias: AgentPrepareCallHook()

> **AgentPrepareCallHook** = (`input`) => `Promise`\<[`AgentModelCallOptions`](AgentModelCallOptions.md) \| `undefined`\> \| [`AgentModelCallOptions`](AgentModelCallOptions.md) \| `undefined`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:144](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/builder/AgentBuilder.ts#L144)

Hook executed before each model call (generate/stream/embed/...).

## Parameters

### input

[`AgentModelCallPrepareInput`](AgentModelCallPrepareInput.md)

## Returns

`Promise`\<[`AgentModelCallOptions`](AgentModelCallOptions.md) \| `undefined`\> \| [`AgentModelCallOptions`](AgentModelCallOptions.md) \| `undefined`
