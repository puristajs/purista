[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / toMcpReferenceToolResult

# Function: toMcpReferenceToolResult()

> **toMcpReferenceToolResult**(`envelopes`): [`McpReferenceToolResult`](../type-aliases/McpReferenceToolResult.md)

Defined in: [ai/src/protocol/interoperability.ts:87](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/protocol/interoperability.ts#L87)

Converts protocol envelopes into an MCP-style tool result.
- final assistant message -> `text` content
- artifact frames -> `json` content
- error frame -> `isError: true`

## Parameters

### envelopes

`object`[]

## Returns

[`McpReferenceToolResult`](../type-aliases/McpReferenceToolResult.md)
