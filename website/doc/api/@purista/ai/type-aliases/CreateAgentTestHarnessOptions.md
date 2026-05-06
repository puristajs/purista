[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / CreateAgentTestHarnessOptions

# Type Alias: CreateAgentTestHarnessOptions\<SkillNames, Resources, ConfigInput\>

> **CreateAgentTestHarnessOptions**\<`SkillNames`, `Resources`, `ConfigInput`\> = [`AgentInstanceOptions`](AgentInstanceOptions.md)\<`SkillNames`, `Resources`, `ConfigInput`\> & `object`

Defined in: [packages/ai/src/testing/createAgentTestHarness.ts:31](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentTestHarness.ts#L31)

## Type Declaration

### eventBridge?

> `optional` **eventBridge**: [`EventBridge`](../../core/interfaces/EventBridge.md)

### queueBridge?

> `optional` **queueBridge**: [`QueueBridge`](../../core/interfaces/QueueBridge.md)

## Type Parameters

### SkillNames

`SkillNames` *extends* `string` = `string`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

### ConfigInput

`ConfigInput` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)
