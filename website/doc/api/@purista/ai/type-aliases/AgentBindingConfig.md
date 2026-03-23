[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentBindingConfig

# Type Alias: AgentBindingConfig

> **AgentBindingConfig** = `object`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:33](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/testing/createAgentContextMock.ts#L33)

## Properties

### call()?

> `optional` **call**: (`payload`, `parameter?`) => `Promise`\<[`AgentProtocolEnvelope`](AgentProtocolEnvelope.md)[]\> \| [`AgentProtocolEnvelope`](AgentProtocolEnvelope.md)[]

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:34](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/testing/createAgentContextMock.ts#L34)

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

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:37](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/testing/createAgentContextMock.ts#L37)

***

### object?

> `optional` **object**: `unknown` \| (`payload`, `parameter?`) => `unknown` \| `Promise`\<`unknown`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:36](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/testing/createAgentContextMock.ts#L36)

***

### parameterSchema?

> `optional` **parameterSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:41](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/testing/createAgentContextMock.ts#L41)

***

### payloadSchema?

> `optional` **payloadSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:40](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/testing/createAgentContextMock.ts#L40)

***

### text?

> `optional` **text**: `string` \| (`payload`, `parameter?`) => `string` \| `Promise`\<`string`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:35](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/testing/createAgentContextMock.ts#L35)
