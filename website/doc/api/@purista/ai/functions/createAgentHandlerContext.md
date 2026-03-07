[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createAgentHandlerContext

# Function: createAgentHandlerContext()

> **createAgentHandlerContext**\<`Payload`, `Parameter`, `Resources`, `Models`\>(`input`): [`AgentHandlerContext`](../type-aliases/AgentHandlerContext.md)\<`Payload`, `Parameter`, `Resources`, `Models`\>

Defined in: [ai/src/runtime/context.ts:417](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L417)

## Type Parameters

### Payload

`Payload`

### Parameter

`Parameter`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

## Parameters

### input

[`CreateAgentHandlerContextInput`](../type-aliases/CreateAgentHandlerContextInput.md)\<`Payload`, `Parameter`, `Resources`, `Models`\>

## Returns

[`AgentHandlerContext`](../type-aliases/AgentHandlerContext.md)\<`Payload`, `Parameter`, `Resources`, `Models`\>
