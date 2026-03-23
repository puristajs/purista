[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createAgentHandlerContext

# Function: createAgentHandlerContext()

> **createAgentHandlerContext**\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`\>(`input`): [`AgentHandlerContext`](../type-aliases/AgentHandlerContext.md)\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`\>

Defined in: [packages/ai/src/runtime/context.ts:1151](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L1151)

## Type Parameters

### Payload

`Payload`

### Parameter

`Parameter`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md) = [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md)

## Parameters

### input

[`CreateAgentHandlerContextInput`](../type-aliases/CreateAgentHandlerContextInput.md)\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`\>

## Returns

[`AgentHandlerContext`](../type-aliases/AgentHandlerContext.md)\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`\>
