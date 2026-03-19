[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / testAgent

# Function: testAgent()

> **testAgent**(`definition`, `options?`): `Promise`\<\{ `destroy`: () => `Promise`\<`void`\>; `eventBridge`: [`EventBridge`](../../core/interfaces/EventBridge.md); `instance`: [`AgentRuntimeInstance`](../type-aliases/AgentRuntimeInstance.md); \}\>

Defined in: [packages/ai/src/testing/testAgent.ts:9](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/testing/testAgent.ts#L9)

## Parameters

### definition

[`AgentDefinition`](../type-aliases/AgentDefinition.md)

### options?

`TestAgentOptions` = `{}`

## Returns

`Promise`\<\{ `destroy`: () => `Promise`\<`void`\>; `eventBridge`: [`EventBridge`](../../core/interfaces/EventBridge.md); `instance`: [`AgentRuntimeInstance`](../type-aliases/AgentRuntimeInstance.md); \}\>
