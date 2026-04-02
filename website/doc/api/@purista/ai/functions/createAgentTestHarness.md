[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createAgentTestHarness

# Function: createAgentTestHarness()

> **createAgentTestHarness**\<`SkillNames`, `Resources`, `ConfigInput`\>(`definition`, `options?`): `Promise`\<\{ `eventBridge`: [`EventBridge`](../../core/interfaces/EventBridge.md); `instance`: [`AgentRuntimeInstance`](../type-aliases/AgentRuntimeInstance.md); `queueBridge?`: [`QueueBridge`](../../core/interfaces/QueueBridge.md); `destroy`: `Promise`\<`void`\>; `run`: `Promise`\<[`AgentHarnessResult`](../type-aliases/AgentHarnessResult.md)\>; `stream`: `Promise`\<[`AgentStreamHarnessResult`](../type-aliases/AgentStreamHarnessResult.md)\>; \}\>

Defined in: [packages/ai/src/testing/createAgentTestHarness.ts:44](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/testing/createAgentTestHarness.ts#L44)

## Type Parameters

### SkillNames

`SkillNames` *extends* `string` = `string`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

### ConfigInput

`ConfigInput` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

## Parameters

### definition

[`AgentDefinition`](../type-aliases/AgentDefinition.md)\<`SkillNames`, `Resources`, `ConfigInput`\>

### options?

[`CreateAgentTestHarnessOptions`](../type-aliases/CreateAgentTestHarnessOptions.md)\<`SkillNames`, `Resources`, `ConfigInput`\> = `...`

## Returns

`Promise`\<\{ `eventBridge`: [`EventBridge`](../../core/interfaces/EventBridge.md); `instance`: [`AgentRuntimeInstance`](../type-aliases/AgentRuntimeInstance.md); `queueBridge?`: [`QueueBridge`](../../core/interfaces/QueueBridge.md); `destroy`: `Promise`\<`void`\>; `run`: `Promise`\<[`AgentHarnessResult`](../type-aliases/AgentHarnessResult.md)\>; `stream`: `Promise`\<[`AgentStreamHarnessResult`](../type-aliases/AgentStreamHarnessResult.md)\>; \}\>
