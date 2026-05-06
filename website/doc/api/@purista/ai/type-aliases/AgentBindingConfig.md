[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentBindingConfig

# Type Alias: AgentBindingConfig

> **AgentBindingConfig** = `object`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:40](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L40)

## Properties

### call()?

> `optional` **call**: (`payload`, `parameter?`) => `Promise`\<[`AgentProtocolEnvelope`](AgentProtocolEnvelope.md)[]\> \| [`AgentProtocolEnvelope`](AgentProtocolEnvelope.md)[]

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:41](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L41)

#### Parameters

##### payload

`unknown`

##### parameter?

`unknown`

#### Returns

`Promise`\<[`AgentProtocolEnvelope`](AgentProtocolEnvelope.md)[]\> \| [`AgentProtocolEnvelope`](AgentProtocolEnvelope.md)[]

***

### envelopes?

> `optional` **envelopes**: [`AgentProtocolEnvelope`](AgentProtocolEnvelope.md)[] \| (`payload`, `parameter?`) => [`AgentProtocolEnvelope`](AgentProtocolEnvelope.md)[] \| `Promise`\<[`AgentProtocolEnvelope`](AgentProtocolEnvelope.md)[]\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:44](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L44)

***

### object?

> `optional` **object**: `unknown` \| (`payload`, `parameter?`) => `unknown` \| `Promise`\<`unknown`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:43](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L43)

***

### parameterSchema?

> `optional` **parameterSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:48](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L48)

***

### payloadSchema?

> `optional` **payloadSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:47](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L47)

***

### text?

> `optional` **text**: `string` \| (`payload`, `parameter?`) => `string` \| `Promise`\<`string`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:42](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L42)
