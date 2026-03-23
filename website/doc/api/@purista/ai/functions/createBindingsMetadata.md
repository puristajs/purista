[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createBindingsMetadata

# Function: createBindingsMetadata()

> **createBindingsMetadata**(`manifest`): `object`

Defined in: [packages/ai/src/bridge/externalRuntime.ts:339](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/bridge/externalRuntime.ts#L339)

## Parameters

### manifest

`Pick`\<[`AgentManifest`](../type-aliases/AgentManifest.md), `"allowedTools"` \| `"allowedAgents"`\>

## Returns

`object`

### agents

> **agents**: [`AllowedAgentDefinition`](../type-aliases/AllowedAgentDefinition.md)[]

### commands

> **commands**: [`AllowedToolDefinition`](../type-aliases/AllowedToolDefinition.md)[] = `manifest.allowedTools`
