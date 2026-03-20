[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentManifest

# Type Alias: AgentManifest

> **AgentManifest** = `object`

Defined in: [packages/ai/src/types/AgentManifest.ts:110](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L110)

## Properties

### agentName

> **agentName**: `string`

Defined in: [packages/ai/src/types/AgentManifest.ts:111](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L111)

***

### agentVersion

> **agentVersion**: `string`

Defined in: [packages/ai/src/types/AgentManifest.ts:112](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L112)

***

### allowedAgents?

> `optional` **allowedAgents**: [`AllowedAgentDefinition`](AllowedAgentDefinition.md)[]

Defined in: [packages/ai/src/types/AgentManifest.ts:123](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L123)

***

### allowedTools

> **allowedTools**: [`AllowedToolDefinition`](AllowedToolDefinition.md)[]

Defined in: [packages/ai/src/types/AgentManifest.ts:122](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L122)

***

### contextSchema?

> `optional` **contextSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:128](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L128)

***

### description?

> `optional` **description**: `string`

Defined in: [packages/ai/src/types/AgentManifest.ts:113](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L113)

***

### eventBridge

> **eventBridge**: `string`

Defined in: [packages/ai/src/types/AgentManifest.ts:114](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L114)

***

### executionMode?

> `optional` **executionMode**: [`AgentExecutionMode`](AgentExecutionMode.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:115](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L115)

***

### executionPolicy?

> `optional` **executionPolicy**: [`AgentExecutionPolicy`](AgentExecutionPolicy.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:116](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L116)

***

### httpExposure?

> `optional` **httpExposure**: [`AgentHttpExposure`](AgentHttpExposure.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:129](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L129)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/types/AgentManifest.ts:130](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L130)

***

### modelResource?

> `optional` **modelResource**: `object`

Defined in: [packages/ai/src/types/AgentManifest.ts:118](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L118)

#### resourceName

> **resourceName**: `string`

#### variant?

> `optional` **variant**: `string`

***

### models?

> `optional` **models**: [`AgentModelBinding`](AgentModelBinding.md)[]

Defined in: [packages/ai/src/types/AgentManifest.ts:117](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L117)

***

### outputSchema?

> `optional` **outputSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:127](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L127)

***

### parameterSchema?

> `optional` **parameterSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:126](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L126)

***

### payloadSchema?

> `optional` **payloadSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:125](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L125)

***

### resources?

> `optional` **resources**: `Record`\<`string`, \{ `resourceName`: `string`; \}\>

Defined in: [packages/ai/src/types/AgentManifest.ts:124](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L124)

***

### retryPolicy?

> `optional` **retryPolicy**: [`RetryPolicy`](RetryPolicy.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:120](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L120)

***

### session?

> `optional` **session**: [`AgentSessionConfig`](AgentSessionConfig.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:119](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L119)

***

### telemetry?

> `optional` **telemetry**: `object`

Defined in: [packages/ai/src/types/AgentManifest.ts:121](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentManifest.ts#L121)

#### attributes?

> `optional` **attributes**: `Record`\<`string`, `string` \| `number` \| `boolean`\>
