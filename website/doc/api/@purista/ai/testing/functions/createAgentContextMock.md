[**PURISTA API**](../../../../README.md)

***

[PURISTA API](../../../../packages.md) / [@purista/ai](../../README.md) / [testing](../README.md) / createAgentContextMock

# Function: createAgentContextMock()

> **createAgentContextMock**\<`Payload`, `Parameter`, `Resources`, `Models`\>(`input?`): [`AgentHandlerContext`](../../type-aliases/AgentHandlerContext.md)\<`Payload`, `Parameter`, `Resources`, `Models`\>

Defined in: [testing/index.ts:27](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/testing/index.ts#L27)

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
