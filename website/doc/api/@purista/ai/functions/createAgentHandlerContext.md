[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createAgentHandlerContext

# Function: createAgentHandlerContext()

> **createAgentHandlerContext**\<`Payload`, `Parameter`, `Resources`, `Models`, `KnowledgeAliases`, `AgentInvokes`\>(`input`): [`AgentHandlerContext`](../type-aliases/AgentHandlerContext.md)\<`Payload`, `Parameter`, `Resources`, `Models`, `KnowledgeAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/runtime/context.ts:1205](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L1205)

## Type Parameters

### Payload

`Payload`

### Parameter

`Parameter`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

### KnowledgeAliases

`KnowledgeAliases` *extends* `string` = `string`

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md) = [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md)

## Parameters

### input

[`CreateAgentHandlerContextInput`](../type-aliases/CreateAgentHandlerContextInput.md)\<`Payload`, `Parameter`, `Resources`, `Models`, `KnowledgeAliases`, `AgentInvokes`\>

## Returns

[`AgentHandlerContext`](../type-aliases/AgentHandlerContext.md)\<`Payload`, `Parameter`, `Resources`, `Models`, `KnowledgeAliases`, `AgentInvokes`\>
