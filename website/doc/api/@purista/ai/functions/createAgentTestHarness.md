[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createAgentTestHarness

# Function: createAgentTestHarness()

> **createAgentTestHarness**(`definition`, `options?`): `Promise`\<\{ `eventBridge`: [`EventBridge`](../../core/interfaces/EventBridge.md); `instance`: [`AgentRuntimeInstance`](../type-aliases/AgentRuntimeInstance.md); `queueBridge?`: [`QueueBridge`](../../core/interfaces/QueueBridge.md); `destroy`: `Promise`\<`void`\>; `run`: `Promise`\<[`AgentHarnessResult`](../type-aliases/AgentHarnessResult.md)\>; `stream`: `Promise`\<[`AgentStreamHarnessResult`](../type-aliases/AgentStreamHarnessResult.md)\>; \}\>

Defined in: [packages/ai/src/testing/createAgentTestHarness.ts:40](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/testing/createAgentTestHarness.ts#L40)

## Parameters

### definition

[`AgentDefinition`](../type-aliases/AgentDefinition.md)

### options?

[`CreateAgentTestHarnessOptions`](../type-aliases/CreateAgentTestHarnessOptions.md) = `...`

## Returns

`Promise`\<\{ `eventBridge`: [`EventBridge`](../../core/interfaces/EventBridge.md); `instance`: [`AgentRuntimeInstance`](../type-aliases/AgentRuntimeInstance.md); `queueBridge?`: [`QueueBridge`](../../core/interfaces/QueueBridge.md); `destroy`: `Promise`\<`void`\>; `run`: `Promise`\<[`AgentHarnessResult`](../type-aliases/AgentHarnessResult.md)\>; `stream`: `Promise`\<[`AgentStreamHarnessResult`](../type-aliases/AgentStreamHarnessResult.md)\>; \}\>
