[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentManifest

# Type Alias: AgentManifest

> **AgentManifest** = `object`

Defined in: [ai/src/types/AgentManifest.ts:41](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L41)

## Properties

### agentName

> **agentName**: `string`

Defined in: [ai/src/types/AgentManifest.ts:42](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L42)

***

### agentVersion

> **agentVersion**: `string`

Defined in: [ai/src/types/AgentManifest.ts:43](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L43)

***

### allowedTools

> **allowedTools**: [`AllowedToolDefinition`](AllowedToolDefinition.md)[]

Defined in: [ai/src/types/AgentManifest.ts:52](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L52)

***

### contextSchema?

> `optional` **contextSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [ai/src/types/AgentManifest.ts:57](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L57)

***

### description?

> `optional` **description**: `string`

Defined in: [ai/src/types/AgentManifest.ts:44](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L44)

***

### eventBridge

> **eventBridge**: `string`

Defined in: [ai/src/types/AgentManifest.ts:45](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L45)

***

### httpExposure?

> `optional` **httpExposure**: [`AgentHttpExposure`](AgentHttpExposure.md)

Defined in: [ai/src/types/AgentManifest.ts:58](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L58)

***

### knowledge?

> `optional` **knowledge**: [`KnowledgeAdapterConfig`](KnowledgeAdapterConfig.md)[]

Defined in: [ai/src/types/AgentManifest.ts:49](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L49)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [ai/src/types/AgentManifest.ts:59](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L59)

***

### modelResource?

> `optional` **modelResource**: `object`

Defined in: [ai/src/types/AgentManifest.ts:47](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L47)

#### resourceName

> **resourceName**: `string`

#### variant?

> `optional` **variant**: `string`

***

### models?

> `optional` **models**: `string`[]

Defined in: [ai/src/types/AgentManifest.ts:46](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L46)

***

### outputSchema?

> `optional` **outputSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [ai/src/types/AgentManifest.ts:56](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L56)

***

### parameterSchema?

> `optional` **parameterSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [ai/src/types/AgentManifest.ts:55](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L55)

***

### payloadSchema?

> `optional` **payloadSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [ai/src/types/AgentManifest.ts:54](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L54)

***

### resources?

> `optional` **resources**: `Record`\<`string`, \{ `resourceName`: `string`; \}\>

Defined in: [ai/src/types/AgentManifest.ts:53](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L53)

***

### retryPolicy?

> `optional` **retryPolicy**: [`RetryPolicy`](RetryPolicy.md)

Defined in: [ai/src/types/AgentManifest.ts:50](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L50)

***

### session?

> `optional` **session**: [`AgentSessionConfig`](AgentSessionConfig.md)

Defined in: [ai/src/types/AgentManifest.ts:48](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L48)

***

### telemetry?

> `optional` **telemetry**: `object`

Defined in: [ai/src/types/AgentManifest.ts:51](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentManifest.ts#L51)

#### attributes?

> `optional` **attributes**: `Record`\<`string`, `string` \| `number` \| `boolean`\>
