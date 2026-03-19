[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / exposeToolsAsMCP

# Function: exposeToolsAsMCP()

> **exposeToolsAsMCP**\<`KnowledgeAliases`\>(`input`): [`MCPToolDescriptor`](../type-aliases/MCPToolDescriptor.md)[]

Defined in: [packages/ai/src/mcp/exposeCommandAsMCP.ts:42](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/mcp/exposeCommandAsMCP.ts#L42)

Exposes mixed agent + command descriptors as MCP tools.
Throws if duplicate tool names are detected.

## Type Parameters

### KnowledgeAliases

`KnowledgeAliases` *extends* `string` = `never`

## Parameters

### input

[`MCPExposeInput`](../type-aliases/MCPExposeInput.md)\<`KnowledgeAliases`\>

## Returns

[`MCPToolDescriptor`](../type-aliases/MCPToolDescriptor.md)[]
