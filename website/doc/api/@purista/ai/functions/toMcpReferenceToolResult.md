[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / toMcpReferenceToolResult

# Function: toMcpReferenceToolResult()

> **toMcpReferenceToolResult**(`envelopes`): [`McpReferenceToolResult`](../type-aliases/McpReferenceToolResult.md)

Defined in: [packages/ai/src/protocol/interoperability.ts:87](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/protocol/interoperability.ts#L87)

Converts protocol envelopes into an MCP-style tool result.
- final assistant message -> `text` content
- artifact frames -> `json` content
- error frame -> `isError: true`

## Parameters

### envelopes

`object`[]

## Returns

[`McpReferenceToolResult`](../type-aliases/McpReferenceToolResult.md)
