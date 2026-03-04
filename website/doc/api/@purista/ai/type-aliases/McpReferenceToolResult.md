[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / McpReferenceToolResult

# Type Alias: McpReferenceToolResult

> **McpReferenceToolResult** = `object`

Defined in: [ai/src/protocol/interoperability.ts:75](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/protocol/interoperability.ts#L75)

Reference MCP-style tool result.
This follows common MCP response semantics but remains transport-agnostic.

## Properties

### content

> **content**: [`McpReferenceContent`](McpReferenceContent.md)[]

Defined in: [ai/src/protocol/interoperability.ts:76](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/protocol/interoperability.ts#L76)

***

### isError?

> `optional` **isError**: `boolean`

Defined in: [ai/src/protocol/interoperability.ts:77](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/protocol/interoperability.ts#L77)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [ai/src/protocol/interoperability.ts:78](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/protocol/interoperability.ts#L78)
