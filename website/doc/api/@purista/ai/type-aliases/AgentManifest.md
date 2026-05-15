[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / AgentManifest

# Type Alias: AgentManifest\<Models\>

> **AgentManifest**\<`Models`\> = `object`

Defined in: [builder/types.ts:270](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L270)

## Type Parameters

### Models

`Models` *extends* `Record`\<`string`, [`AgentModelBinding`](AgentModelBinding.md)\> = `Record`\<`string`, [`AgentModelBinding`](AgentModelBinding.md)\>

## Properties

### agentName

> **agentName**: `string`

Defined in: [builder/types.ts:273](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L273)

***

### allowedAgents

> **allowedAgents**: readonly [`AllowedAgentDefinition`](AllowedAgentDefinition.md)[]

Defined in: [builder/types.ts:291](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L291)

***

### allowedCommands

> **allowedCommands**: readonly [`AllowedCommandToolDefinition`](AllowedCommandToolDefinition.md)[]

Defined in: [builder/types.ts:290](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L290)

***

### builtInTools

> **builtInTools**: readonly `BuiltinToolName`[] \| `false` \| `true`

Defined in: [builder/types.ts:293](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L293)

***

### description

> **description**: `string`

Defined in: [builder/types.ts:274](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L274)

***

### execution

> **execution**: `Required`\<`Pick`\<[`AgentExecutionPolicy`](AgentExecutionPolicy.md), `"maxAttempts"` \| `"maxParallelHandlers"`\>\> & `Omit`\<[`AgentExecutionPolicy`](AgentExecutionPolicy.md), `"maxAttempts"` \| `"maxParallelHandlers"`\>

Defined in: [builder/types.ts:278](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L278)

***

### http?

> `optional` **http?**: [`AgentHttpExposure`](AgentHttpExposure.md)

Defined in: [builder/types.ts:281](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L281)

***

### models

> **models**: `Models`

Defined in: [builder/types.ts:276](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L276)

***

### response?

> `optional` **response?**: `object`

Defined in: [builder/types.ts:282](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L282)

#### jobId

> **jobId**: `object`

##### jobId.source

> **source**: `"queue-job-id"`

#### mode

> **mode**: `AgentResponseMode`

#### options?

> `optional` **options?**: `AgentResponseModeOptions`

#### runId

> **runId**: `object`

##### runId.prefix

> **prefix**: `"run:"`

##### runId.source

> **source**: `"queue-job-id"`

***

### runtimeRevision

> **runtimeRevision**: `string`

Defined in: [builder/types.ts:275](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L275)

***

### sandbox?

> `optional` **sandbox?**: [`AgentSandboxPolicy`](AgentSandboxPolicy.md)

Defined in: [builder/types.ts:280](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L280)

***

### serviceName

> **serviceName**: `string`

Defined in: [builder/types.ts:271](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L271)

***

### serviceVersion

> **serviceVersion**: `string`

Defined in: [builder/types.ts:272](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L272)

***

### session

> **session**: [`AgentSessionPolicy`](AgentSessionPolicy.md)

Defined in: [builder/types.ts:277](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L277)

***

### streamingMode

> **streamingMode**: `"stream"` \| `"aggregate"`

Defined in: [builder/types.ts:288](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L288)

***

### successEventName?

> `optional` **successEventName?**: `string`

Defined in: [builder/types.ts:289](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L289)

***

### usedSkills

> **usedSkills**: readonly `object`[]

Defined in: [builder/types.ts:292](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L292)
