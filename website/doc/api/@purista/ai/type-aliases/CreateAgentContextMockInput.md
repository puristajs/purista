[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / CreateAgentContextMockInput

# Type Alias: CreateAgentContextMockInput\<Payload, Parameter, Resources, Models\>

> **CreateAgentContextMockInput**\<`Payload`, `Parameter`, `Resources`, `Models`\> = `object`

Defined in: packages/ai/src/testing/createAgentContextMock.ts:33

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

Defined in: packages/ai/src/testing/createAgentContextMock.ts:43

***

### commands?

> `optional` **commands**: `CommandMap`

Defined in: packages/ai/src/testing/createAgentContextMock.ts:42

***

### configs?

> `optional` **configs**: `Record`\<`string`, `unknown`\>

Defined in: packages/ai/src/testing/createAgentContextMock.ts:50

***

### conversationStore?

> `optional` **conversationStore**: [`ConversationStore`](../interfaces/ConversationStore.md)

Defined in: packages/ai/src/testing/createAgentContextMock.ts:46

***

### initialStates?

> `optional` **initialStates**: `Record`\<`string`, `unknown`\>

Defined in: packages/ai/src/testing/createAgentContextMock.ts:51

***

### manifest?

> `optional` **manifest**: `Partial`\<[`AgentManifest`](AgentManifest.md)\> & `Pick`\<[`AgentManifest`](AgentManifest.md), `"agentName"` \| `"agentVersion"`\>

Defined in: packages/ai/src/testing/createAgentContextMock.ts:41

***

### message?

> `optional` **message**: `Partial`\<`ReturnType`\<*typeof* `createDefaultMessage`\>\>

Defined in: packages/ai/src/testing/createAgentContextMock.ts:47

***

### models?

> `optional` **models**: `Models`

Defined in: packages/ai/src/testing/createAgentContextMock.ts:45

***

### onEnvelope()?

> `optional` **onEnvelope**: (`envelope`) => `void` \| `Promise`\<`void`\>

Defined in: packages/ai/src/testing/createAgentContextMock.ts:48

#### Parameters

##### envelope

[`AgentProtocolEnvelope`](AgentProtocolEnvelope.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### parameter?

> `optional` **parameter**: `Parameter`

Defined in: packages/ai/src/testing/createAgentContextMock.ts:40

***

### payload

> **payload**: `Payload`

Defined in: packages/ai/src/testing/createAgentContextMock.ts:39

***

### resources?

> `optional` **resources**: `Partial`\<`Resources`\>

Defined in: packages/ai/src/testing/createAgentContextMock.ts:44

***

### secrets?

> `optional` **secrets**: `Record`\<`string`, `unknown`\>

Defined in: packages/ai/src/testing/createAgentContextMock.ts:49
