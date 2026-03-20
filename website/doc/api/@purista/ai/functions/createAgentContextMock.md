[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createAgentContextMock

# Function: createAgentContextMock()

> **createAgentContextMock**\<`Payload`, `Parameter`, `Resources`, `Models`\>(`input`): [`AgentContextMockResult`](../type-aliases/AgentContextMockResult.md)\<`Payload`, `Parameter`, `Resources`, `Models`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:104](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L104)

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\> = `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

## Parameters

### input

[`CreateAgentContextMockInput`](../type-aliases/CreateAgentContextMockInput.md)\<`Payload`, `Parameter`, `Resources`, `Models`\>

## Returns

[`AgentContextMockResult`](../type-aliases/AgentContextMockResult.md)\<`Payload`, `Parameter`, `Resources`, `Models`\>
