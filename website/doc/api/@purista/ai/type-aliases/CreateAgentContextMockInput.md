[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / CreateAgentContextMockInput

# Type Alias: CreateAgentContextMockInput\<Payload, Parameter, Resources, Models\>

> **CreateAgentContextMockInput**\<`Payload`, `Parameter`, `Resources`, `Models`\> = `object`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:46](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/testing/createAgentContextMock.ts#L46)

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

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:56](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/testing/createAgentContextMock.ts#L56)

***

### commands?

> `optional` **commands**: [`CommandMap`](CommandMap.md)

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:55](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/testing/createAgentContextMock.ts#L55)

***

### configs?

> `optional` **configs**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:63](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/testing/createAgentContextMock.ts#L63)

***

### conversationStore?

> `optional` **conversationStore**: [`ConversationStore`](../interfaces/ConversationStore.md)

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:59](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/testing/createAgentContextMock.ts#L59)

***

### initialStates?

> `optional` **initialStates**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:64](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/testing/createAgentContextMock.ts#L64)

***

### manifest?

> `optional` **manifest**: `Partial`\<[`AgentManifest`](AgentManifest.md)\> & `Pick`\<[`AgentManifest`](AgentManifest.md), `"agentName"` \| `"agentVersion"`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:54](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/testing/createAgentContextMock.ts#L54)

***

### message?

> `optional` **message**: `Partial`\<[`CreateAgentContextMockMessage`](CreateAgentContextMockMessage.md)\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:60](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/testing/createAgentContextMock.ts#L60)

***

### models?

> `optional` **models**: `Models`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:58](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/testing/createAgentContextMock.ts#L58)

***

### onEnvelope()?

> `optional` **onEnvelope**: (`envelope`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:61](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/testing/createAgentContextMock.ts#L61)

#### Parameters

##### envelope

[`AgentProtocolEnvelope`](AgentProtocolEnvelope.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### parameter?

> `optional` **parameter**: `Parameter`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:53](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/testing/createAgentContextMock.ts#L53)

***

### payload

> **payload**: `Payload`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:52](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/testing/createAgentContextMock.ts#L52)

***

### resources?

> `optional` **resources**: `Partial`\<`Resources`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:57](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/testing/createAgentContextMock.ts#L57)

***

### secrets?

> `optional` **secrets**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:62](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/testing/createAgentContextMock.ts#L62)
