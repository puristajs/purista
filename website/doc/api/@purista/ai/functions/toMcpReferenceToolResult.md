[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / toMcpReferenceToolResult

# Function: toMcpReferenceToolResult()

> **toMcpReferenceToolResult**(`envelopes`): [`McpReferenceToolResult`](../type-aliases/McpReferenceToolResult.md)

Defined in: [packages/ai/src/protocol/interoperability.ts:87](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/protocol/interoperability.ts#L87)

Converts protocol envelopes into an MCP-style tool result.
- final assistant message -> `text` content
- artifact frames -> `json` content
- error frame -> `isError: true`

## Parameters

### envelopes

`object`[]

## Returns

[`McpReferenceToolResult`](../type-aliases/McpReferenceToolResult.md)
