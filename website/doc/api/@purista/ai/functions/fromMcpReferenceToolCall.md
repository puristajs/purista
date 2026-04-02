[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / fromMcpReferenceToolCall

# Function: fromMcpReferenceToolCall()

> **fromMcpReferenceToolCall**(`input`): `object`

Defined in: [packages/ai/src/protocol/interoperability.ts:140](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/protocol/interoperability.ts#L140)

Converts an MCP-style tool call input to a minimal agent invoke payload.
Consumers can extend this shape with domain-specific fields.

## Parameters

### input

#### arguments?

`Record`\<`string`, `unknown`\>

#### name

`string`

## Returns

`object`

### attachments

> **attachments**: `unknown`[]

### context?

> `optional` **context**: `string`

### history

> **history**: `unknown`[]

### message

> **message**: `string`
