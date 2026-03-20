[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / CreateAgentContextMockInput

# Type Alias: CreateAgentContextMockInput\<Payload, Parameter, Resources, Models\>

> **CreateAgentContextMockInput**\<`Payload`, `Parameter`, `Resources`, `Models`\> = `object`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:33](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L33)

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\> = `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

## Properties

### agents?

> `optional` **agents**: `AgentMap`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:43](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L43)

***

### commands?

> `optional` **commands**: `CommandMap`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:42](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L42)

***

### configs?

> `optional` **configs**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:50](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L50)

***

### conversationStore?

> `optional` **conversationStore**: [`ConversationStore`](../interfaces/ConversationStore.md)

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:46](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L46)

***

### initialStates?

> `optional` **initialStates**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:51](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L51)

***

### manifest?

> `optional` **manifest**: `Partial`\<[`AgentManifest`](AgentManifest.md)\> & `Pick`\<[`AgentManifest`](AgentManifest.md), `"agentName"` \| `"agentVersion"`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:41](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L41)

***

### message?

> `optional` **message**: `Partial`\<`ReturnType`\<*typeof* `createDefaultMessage`\>\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:47](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L47)

***

### models?

> `optional` **models**: `Models`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:45](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L45)

***

### onEnvelope()?

> `optional` **onEnvelope**: (`envelope`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:48](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L48)

#### Parameters

##### envelope

[`AgentProtocolEnvelope`](AgentProtocolEnvelope.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### parameter?

> `optional` **parameter**: `Parameter`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:40](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L40)

***

### payload

> **payload**: `Payload`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:39](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L39)

***

### resources?

> `optional` **resources**: `Partial`\<`Resources`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:44](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L44)

***

### secrets?

> `optional` **secrets**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:49](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L49)
