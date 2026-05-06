[**PURISTA API**](../../../../README.md)

***

[PURISTA API](../../../../packages.md) / [@purista/ai](../../README.md) / [testing](../README.md) / createAgentContextMock

# Function: createAgentContextMock()

> **createAgentContextMock**\<`Payload`, `Parameter`, `Resources`, `Models`\>(`input?`): [`AgentHandlerContext`](../../type-aliases/AgentHandlerContext.md)\<`Payload`, `Parameter`, `Resources`, `Models`\>

Defined in: ai/src/testing/index.ts:27

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`AgentModelBinding`](../../type-aliases/AgentModelBinding.md)\> = `Record`\<`string`, `never`\>

## Parameters

### input?

[`CreateAgentContextMockInput`](../type-aliases/CreateAgentContextMockInput.md)\<`Payload`, `Parameter`, `Resources`, `Models`\> = `{}`

## Returns

[`AgentHandlerContext`](../../type-aliases/AgentHandlerContext.md)\<`Payload`, `Parameter`, `Resources`, `Models`\>
