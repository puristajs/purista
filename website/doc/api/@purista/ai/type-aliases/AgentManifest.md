[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentManifest

# Type Alias: AgentManifest

> **AgentManifest** = `object`

Defined in: [packages/ai/src/types/AgentManifest.ts:115](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L115)

## Properties

### agentName

> **agentName**: `string`

Defined in: [packages/ai/src/types/AgentManifest.ts:116](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L116)

***

### agentVersion

> **agentVersion**: `string`

Defined in: [packages/ai/src/types/AgentManifest.ts:117](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L117)

***

### allowedAgents?

> `optional` **allowedAgents**: [`AllowedAgentDefinition`](AllowedAgentDefinition.md)[]

Defined in: [packages/ai/src/types/AgentManifest.ts:130](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L130)

***

### allowedTools

> **allowedTools**: [`AllowedToolDefinition`](AllowedToolDefinition.md)[]

Defined in: [packages/ai/src/types/AgentManifest.ts:129](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L129)

***

### contextSchema?

> `optional` **contextSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:135](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L135)

***

### deprecated?

> `optional` **deprecated**: `boolean`

Defined in: [packages/ai/src/types/AgentManifest.ts:119](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L119)

***

### description?

> `optional` **description**: `string`

Defined in: [packages/ai/src/types/AgentManifest.ts:118](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L118)

***

### eventBridge

> **eventBridge**: `string`

Defined in: [packages/ai/src/types/AgentManifest.ts:120](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L120)

***

### executionMode?

> `optional` **executionMode**: [`AgentExecutionMode`](AgentExecutionMode.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:121](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L121)

***

### executionPolicy?

> `optional` **executionPolicy**: [`AgentExecutionPolicy`](AgentExecutionPolicy.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:122](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L122)

***

### httpExposure?

> `optional` **httpExposure**: [`AgentHttpExposure`](AgentHttpExposure.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:136](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L136)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/types/AgentManifest.ts:137](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L137)

***

### modelResource?

> `optional` **modelResource**: `object`

Defined in: [packages/ai/src/types/AgentManifest.ts:124](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L124)

#### resourceName

> **resourceName**: `string`

#### variant?

> `optional` **variant**: `string`

***

### models?

> `optional` **models**: [`AgentModelBinding`](AgentModelBinding.md)[]

Defined in: [packages/ai/src/types/AgentManifest.ts:123](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L123)

***

### outputSchema?

> `optional` **outputSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:134](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L134)

***

### parameterSchema?

> `optional` **parameterSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:133](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L133)

***

### payloadSchema?

> `optional` **payloadSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:132](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L132)

***

### resources?

> `optional` **resources**: `Record`\<`string`, \{ `resourceName`: `string`; \}\>

Defined in: [packages/ai/src/types/AgentManifest.ts:131](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L131)

***

### retryPolicy?

> `optional` **retryPolicy**: [`RetryPolicy`](RetryPolicy.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:127](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L127)

***

### session?

> `optional` **session**: [`AgentSessionConfig`](AgentSessionConfig.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:126](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L126)

***

### skills?

> `optional` **skills**: [`AgentSkillConfig`](AgentSkillConfig.md)

Defined in: [packages/ai/src/types/AgentManifest.ts:125](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L125)

***

### telemetry?

> `optional` **telemetry**: `object`

Defined in: [packages/ai/src/types/AgentManifest.ts:128](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentManifest.ts#L128)

#### attributes?

> `optional` **attributes**: `Record`\<`string`, `string` \| `number` \| `boolean`\>
