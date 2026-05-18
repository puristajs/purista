[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / AgentManifest

# Type Alias: AgentManifest\<Models\>

> **AgentManifest**\<`Models`\> = `object`

Defined in: [AgentQueueBuilder/types.ts:280](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L280)

## Type Parameters

### Models

`Models` *extends* `Record`\<`string`, [`AgentModelBinding`](AgentModelBinding.md)\> = `Record`\<`string`, [`AgentModelBinding`](AgentModelBinding.md)\>

## Properties

### agentName

> **agentName**: `string`

Defined in: [AgentQueueBuilder/types.ts:283](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L283)

***

### allowedAgents

> **allowedAgents**: readonly [`AllowedAgentDefinition`](AllowedAgentDefinition.md)[]

Defined in: [AgentQueueBuilder/types.ts:301](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L301)

***

### allowedCommands

> **allowedCommands**: readonly [`AllowedCommandToolDefinition`](AllowedCommandToolDefinition.md)[]

Defined in: [AgentQueueBuilder/types.ts:300](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L300)

***

### builtInTools

> **builtInTools**: readonly `BuiltinToolName`[] \| `false` \| `true`

Defined in: [AgentQueueBuilder/types.ts:303](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L303)

***

### description

> **description**: `string`

Defined in: [AgentQueueBuilder/types.ts:284](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L284)

***

### execution

> **execution**: `Required`\<`Pick`\<[`AgentExecutionPolicy`](AgentExecutionPolicy.md), `"maxAttempts"` \| `"maxParallelHandlers"`\>\> & `Omit`\<[`AgentExecutionPolicy`](AgentExecutionPolicy.md), `"maxAttempts"` \| `"maxParallelHandlers"`\>

Defined in: [AgentQueueBuilder/types.ts:288](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L288)

***

### http?

> `optional` **http?**: [`AgentHttpExposure`](AgentHttpExposure.md)

Defined in: [AgentQueueBuilder/types.ts:291](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L291)

***

### models

> **models**: `Models`

Defined in: [AgentQueueBuilder/types.ts:286](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L286)

***

### response?

> `optional` **response?**: `object`

Defined in: [AgentQueueBuilder/types.ts:292](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L292)

#### jobId

> **jobId**: `object`

##### jobId.source

> **source**: `"queue-job-id"`

#### mode

> **mode**: [`AgentResponseMode`](AgentResponseMode.md)

#### options?

> `optional` **options?**: [`AgentResponseModeOptions`](AgentResponseModeOptions.md)

#### runId

> **runId**: `object`

##### runId.prefix

> **prefix**: `"run:"`

##### runId.source

> **source**: `"queue-job-id"`

***

### runtimeRevision

> **runtimeRevision**: `string`

Defined in: [AgentQueueBuilder/types.ts:285](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L285)

***

### sandbox?

> `optional` **sandbox?**: [`AgentSandboxPolicy`](AgentSandboxPolicy.md)

Defined in: [AgentQueueBuilder/types.ts:290](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L290)

***

### serviceName

> **serviceName**: `string`

Defined in: [AgentQueueBuilder/types.ts:281](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L281)

***

### serviceVersion

> **serviceVersion**: `string`

Defined in: [AgentQueueBuilder/types.ts:282](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L282)

***

### session

> **session**: [`AgentSessionPolicy`](AgentSessionPolicy.md)

Defined in: [AgentQueueBuilder/types.ts:287](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L287)

***

### streamingMode

> **streamingMode**: `"stream"` \| `"aggregate"`

Defined in: [AgentQueueBuilder/types.ts:298](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L298)

***

### successEventName?

> `optional` **successEventName?**: `string`

Defined in: [AgentQueueBuilder/types.ts:299](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L299)

***

### usedSkills

> **usedSkills**: readonly `object`[]

Defined in: [AgentQueueBuilder/types.ts:302](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L302)
