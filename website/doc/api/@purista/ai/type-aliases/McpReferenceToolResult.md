[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / McpReferenceToolResult

# Type Alias: McpReferenceToolResult

> **McpReferenceToolResult** = `object`

Defined in: [packages/ai/src/protocol/interoperability.ts:75](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/protocol/interoperability.ts#L75)

Reference MCP-style tool result.
This follows common MCP response semantics but remains transport-agnostic.

## Properties

### content

> **content**: [`McpReferenceContent`](McpReferenceContent.md)[]

Defined in: [packages/ai/src/protocol/interoperability.ts:76](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/protocol/interoperability.ts#L76)

***

### isError?

> `optional` **isError**: `boolean`

Defined in: [packages/ai/src/protocol/interoperability.ts:77](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/protocol/interoperability.ts#L77)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/protocol/interoperability.ts:78](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/protocol/interoperability.ts#L78)
