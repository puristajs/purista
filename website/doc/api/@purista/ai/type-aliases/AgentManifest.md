[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / AgentManifest

# Type Alias: AgentManifest\<Models\>

> **AgentManifest**\<`Models`\> = `object`

Defined in: ai/src/builder/types.ts:218

## Type Parameters

### Models

`Models` *extends* `Record`\<`string`, [`AgentModelBinding`](AgentModelBinding.md)\> = `Record`\<`string`, [`AgentModelBinding`](AgentModelBinding.md)\>

## Properties

### agentName

> **agentName**: `string`

Defined in: ai/src/builder/types.ts:221

***

### allowedAgents

> **allowedAgents**: readonly [`AllowedAgentDefinition`](AllowedAgentDefinition.md)[]

Defined in: ai/src/builder/types.ts:233

***

### allowedCommands

> **allowedCommands**: readonly [`AllowedCommandToolDefinition`](AllowedCommandToolDefinition.md)[]

Defined in: ai/src/builder/types.ts:232

***

### builtInTools

> **builtInTools**: readonly `BuiltinToolName`[] \| `false` \| `true`

Defined in: ai/src/builder/types.ts:235

***

### description

> **description**: `string`

Defined in: ai/src/builder/types.ts:222

***

### execution

> **execution**: `Required`\<`Pick`\<[`AgentExecutionPolicy`](AgentExecutionPolicy.md), `"maxAttempts"` \| `"maxParallelHandlers"`\>\> & `Omit`\<[`AgentExecutionPolicy`](AgentExecutionPolicy.md), `"maxAttempts"` \| `"maxParallelHandlers"`\>

Defined in: ai/src/builder/types.ts:226

***

### http?

> `optional` **http**: [`AgentHttpExposure`](AgentHttpExposure.md)

Defined in: ai/src/builder/types.ts:229

***

### models

> **models**: `Models`

Defined in: ai/src/builder/types.ts:224

***

### runtimeRevision

> **runtimeRevision**: `string`

Defined in: ai/src/builder/types.ts:223

***

### sandbox?

> `optional` **sandbox**: [`AgentSandboxPolicy`](AgentSandboxPolicy.md)

Defined in: ai/src/builder/types.ts:228

***

### serviceName

> **serviceName**: `string`

Defined in: ai/src/builder/types.ts:219

***

### serviceVersion

> **serviceVersion**: `string`

Defined in: ai/src/builder/types.ts:220

***

### session

> **session**: [`AgentSessionPolicy`](AgentSessionPolicy.md)

Defined in: ai/src/builder/types.ts:225

***

### streamingMode

> **streamingMode**: `"stream"` \| `"aggregate"`

Defined in: ai/src/builder/types.ts:230

***

### successEventName?

> `optional` **successEventName**: `string`

Defined in: ai/src/builder/types.ts:231

***

### usedSkills

> **usedSkills**: readonly `object`[]

Defined in: ai/src/builder/types.ts:234
