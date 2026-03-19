[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / getAgentRuntimeStatuses

# Function: getAgentRuntimeStatuses()

> **getAgentRuntimeStatuses**(`instances`): [`AgentRuntimeStatus`](../type-aliases/AgentRuntimeStatus.md)[]

Defined in: [packages/ai/src/runtime/agentRuntimeStatus.ts:6](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/agentRuntimeStatus.ts#L6)

Returns a stable status snapshot for one or many running agent instances.

## Parameters

### instances

`Record`\<`string`, [`AgentRuntimeInstance`](../type-aliases/AgentRuntimeInstance.md)\> | [`AgentRuntimeInstance`](../type-aliases/AgentRuntimeInstance.md)[]

## Returns

[`AgentRuntimeStatus`](../type-aliases/AgentRuntimeStatus.md)[]
