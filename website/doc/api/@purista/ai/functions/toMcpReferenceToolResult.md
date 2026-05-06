[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / toMcpReferenceToolResult

# Function: toMcpReferenceToolResult()

> **toMcpReferenceToolResult**(`envelopes`): [`McpReferenceToolResult`](../type-aliases/McpReferenceToolResult.md)

Defined in: [packages/ai/src/protocol/interoperability.ts:87](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/protocol/interoperability.ts#L87)

Converts protocol envelopes into an MCP-style tool result.
- final assistant message -> `text` content
- artifact frames -> `json` content
- error frame -> `isError: true`

## Parameters

### envelopes

`object`[]

## Returns

[`McpReferenceToolResult`](../type-aliases/McpReferenceToolResult.md)
