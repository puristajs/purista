[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / fromMcpReferenceToolCall

# Function: fromMcpReferenceToolCall()

> **fromMcpReferenceToolCall**(`input`): `object`

Defined in: [ai/src/protocol/interoperability.ts:135](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/protocol/interoperability.ts#L135)

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
