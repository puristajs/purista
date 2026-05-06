[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / CreateAgentContextMockInput

# Type Alias: CreateAgentContextMockInput\<Payload, Parameter, Resources, Models\>

> **CreateAgentContextMockInput**\<`Payload`, `Parameter`, `Resources`, `Models`\> = `object`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:53](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L53)

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

> `optional` **agents**: [`AgentMap`](AgentMap.md)

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:63](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L63)

***

### commands?

> `optional` **commands**: [`CommandMap`](CommandMap.md)

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:62](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L62)

***

### configs?

> `optional` **configs**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:70](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L70)

***

### conversationStore?

> `optional` **conversationStore**: [`ConversationStore`](../interfaces/ConversationStore.md)

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:66](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L66)

***

### initialStates?

> `optional` **initialStates**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:71](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L71)

***

### manifest?

> `optional` **manifest**: `Partial`\<[`AgentManifest`](AgentManifest.md)\> & `Pick`\<[`AgentManifest`](AgentManifest.md), `"agentName"` \| `"serviceVersion"`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:61](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L61)

***

### message?

> `optional` **message**: `Partial`\<[`CreateAgentContextMockMessage`](CreateAgentContextMockMessage.md)\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:67](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L67)

***

### models?

> `optional` **models**: `Models`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:65](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L65)

***

### onEnvelope()?

> `optional` **onEnvelope**: (`envelope`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:68](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L68)

#### Parameters

##### envelope

[`AgentProtocolEnvelope`](AgentProtocolEnvelope.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### parameter?

> `optional` **parameter**: `Parameter`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:60](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L60)

***

### payload

> **payload**: `Payload`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:59](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L59)

***

### resources?

> `optional` **resources**: `Partial`\<`Resources`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:64](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L64)

***

### secrets?

> `optional` **secrets**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:69](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L69)
