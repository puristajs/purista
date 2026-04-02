[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createBindingsMetadata

# Function: createBindingsMetadata()

> **createBindingsMetadata**(`manifest`): `object`

Defined in: [packages/ai/src/bridge/externalRuntime.ts:348](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/bridge/externalRuntime.ts#L348)

## Parameters

### manifest

`Pick`\<[`AgentManifest`](../type-aliases/AgentManifest.md), `"allowedTools"` \| `"allowedAgents"`\>

## Returns

`object`

### agents

> **agents**: [`AllowedAgentDefinition`](../type-aliases/AllowedAgentDefinition.md)[]

### commands

> **commands**: [`AllowedToolDefinition`](../type-aliases/AllowedToolDefinition.md)[] = `manifest.allowedTools`
