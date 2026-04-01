[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / getAgentRuntimeStatuses

# Function: getAgentRuntimeStatuses()

> **getAgentRuntimeStatuses**(`instances`): [`AgentRuntimeStatus`](../type-aliases/AgentRuntimeStatus.md)[]

Defined in: [packages/ai/src/runtime/agentRuntimeStatus.ts:6](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/agentRuntimeStatus.ts#L6)

Returns a stable status snapshot for one or many running agent instances.

## Parameters

### instances

`Record`\<`string`, [`AgentRuntimeInstance`](../type-aliases/AgentRuntimeInstance.md)\> | [`AgentRuntimeInstance`](../type-aliases/AgentRuntimeInstance.md)[]

## Returns

[`AgentRuntimeStatus`](../type-aliases/AgentRuntimeStatus.md)[]
