[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createBindingsMetadata

# Function: createBindingsMetadata()

> **createBindingsMetadata**(`manifest`): `object`

Defined in: packages/ai/src/bridge/externalRuntime.ts:339

## Parameters

### manifest

`Pick`\<[`AgentManifest`](../type-aliases/AgentManifest.md), `"allowedTools"` \| `"allowedAgents"`\>

## Returns

`object`

### agents

> **agents**: [`AllowedAgentDefinition`](../type-aliases/AllowedAgentDefinition.md)[]

### commands

> **commands**: [`AllowedToolDefinition`](../type-aliases/AllowedToolDefinition.md)[] = `manifest.allowedTools`
