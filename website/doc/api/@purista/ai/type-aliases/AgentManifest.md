[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentManifest

# Type Alias: AgentManifest

> **AgentManifest** = `object`

Defined in: [packages/ai/src/types/AgentManifest.ts:161](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L161)

## Properties

### agentName

> **agentName**: `string`

Defined in: [packages/ai/src/types/AgentManifest.ts:162](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L162)

***

### agentPolicy?

> `optional` **agentPolicy**: [`AgentPolicy`](AgentPolicy.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:170](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L170)

***

### allowedAgents?

> `optional` **allowedAgents**: [`AllowedAgentDefinition`](AllowedAgentDefinition.md)[]

Defined in: [packages/ai/src/types/AgentManifest.ts:178](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L178)

***

### allowedTools

> **allowedTools**: [`AllowedToolDefinition`](AllowedToolDefinition.md)[]

Defined in: [packages/ai/src/types/AgentManifest.ts:177](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L177)

***

### contextSchema?

> `optional` **contextSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:183](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L183)

***

### deprecated?

> `optional` **deprecated**: `boolean`

Defined in: [packages/ai/src/types/AgentManifest.ts:165](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L165)

***

### description?

> `optional` **description**: `string`

Defined in: [packages/ai/src/types/AgentManifest.ts:164](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L164)

***

### eventBridge

> **eventBridge**: `string`

Defined in: [packages/ai/src/types/AgentManifest.ts:166](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L166)

***

### executionPolicy?

> `optional` **executionPolicy**: [`AgentExecutionPolicy`](AgentExecutionPolicy.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:168](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L168)

***

### httpExposure?

> `optional` **httpExposure**: [`AgentHttpExposure`](AgentHttpExposure.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:184](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L184)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/types/AgentManifest.ts:186](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L186)

***

### modelResource?

> `optional` **modelResource**: `object`

Defined in: [packages/ai/src/types/AgentManifest.ts:172](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L172)

#### resourceName

> **resourceName**: `string`

#### variant?

> `optional` **variant**: `string`

***

### models?

> `optional` **models**: [`AgentModelBinding`](AgentModelBinding.md)[]

Defined in: [packages/ai/src/types/AgentManifest.ts:171](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L171)

***

### outputSchema?

> `optional` **outputSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:182](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L182)

***

### parameterSchema?

> `optional` **parameterSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:181](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L181)

***

### payloadSchema?

> `optional` **payloadSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:180](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L180)

***

### reflection?

> `optional` **reflection**: [`ReflectionPolicy`](ReflectionPolicy.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:169](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L169)

***

### resources?

> `optional` **resources**: `Record`\<`string`, \{ `resourceName`: `string`; \}\>

Defined in: [packages/ai/src/types/AgentManifest.ts:179](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L179)

***

### retryPolicy?

> `optional` **retryPolicy**: [`RetryPolicy`](RetryPolicy.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:175](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L175)

***

### sandbox?

> `optional` **sandbox**: [`AgentSandboxPolicy`](AgentSandboxPolicy.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:167](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L167)

***

### serviceVersion

> **serviceVersion**: `string`

Defined in: [packages/ai/src/types/AgentManifest.ts:163](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L163)

***

### session?

> `optional` **session**: [`AgentSessionConfig`](AgentSessionConfig.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:174](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L174)

***

### skills?

> `optional` **skills**: [`AgentSkillConfig`](AgentSkillConfig.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:173](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L173)

***

### successEventName?

> `optional` **successEventName**: `string`

Defined in: [packages/ai/src/types/AgentManifest.ts:185](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L185)

***

### telemetry?

> `optional` **telemetry**: `object`

Defined in: [packages/ai/src/types/AgentManifest.ts:176](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/types/AgentManifest.ts#L176)

#### attributes?

> `optional` **attributes**: `Record`\<`string`, `string` \| `number` \| `boolean`\>
