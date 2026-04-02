[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / Agent2AgentReferenceMessage

# Type Alias: Agent2AgentReferenceMessage

> **Agent2AgentReferenceMessage** = `object`

Defined in: [packages/ai/src/protocol/interoperability.ts:8](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/protocol/interoperability.ts#L8)

Reference shape that can be used as a bridge model for Agent-to-Agent style integrations.
It is intentionally minimal and designed for easy conversion.

## Properties

### frameType

> **frameType**: [`AgentProtocolFrame`](AgentProtocolFrame.md)\[`"kind"`\]

Defined in: [packages/ai/src/protocol/interoperability.ts:19](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/protocol/interoperability.ts#L19)

***

### id

> **id**: `string`

Defined in: [packages/ai/src/protocol/interoperability.ts:9](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/protocol/interoperability.ts#L9)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/protocol/interoperability.ts:21](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/protocol/interoperability.ts#L21)

***

### parentId?

> `optional` **parentId**: `string`

Defined in: [packages/ai/src/protocol/interoperability.ts:11](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/protocol/interoperability.ts#L11)

***

### payload

> **payload**: [`AgentProtocolFrame`](AgentProtocolFrame.md)

Defined in: [packages/ai/src/protocol/interoperability.ts:20](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/protocol/interoperability.ts#L20)

***

### sender

> **sender**: `object`

Defined in: [packages/ai/src/protocol/interoperability.ts:13](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/protocol/interoperability.ts#L13)

#### agent?

> `optional` **agent**: `string`

#### instanceId?

> `optional` **instanceId**: `string`

#### service

> **service**: `string`

#### version?

> `optional` **version**: `string`

***

### threadId

> **threadId**: `string`

Defined in: [packages/ai/src/protocol/interoperability.ts:10](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/protocol/interoperability.ts#L10)

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/ai/src/protocol/interoperability.ts:12](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/protocol/interoperability.ts#L12)
