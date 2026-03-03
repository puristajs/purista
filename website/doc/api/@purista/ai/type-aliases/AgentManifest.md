[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentManifest

# Type Alias: AgentManifest

> **AgentManifest** = `object`

Defined in: [ai/src/types/AgentManifest.ts:44](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L44)

## Properties

### agentName

> **agentName**: `string`

Defined in: [ai/src/types/AgentManifest.ts:45](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L45)

***

### agentVersion

> **agentVersion**: `string`

Defined in: [ai/src/types/AgentManifest.ts:46](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L46)

***

### allowedTools

> **allowedTools**: [`AllowedToolDefinition`](AllowedToolDefinition.md)[]

Defined in: [ai/src/types/AgentManifest.ts:56](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L56)

***

### concurrency?

> `optional` **concurrency**: [`ConcurrencyConfig`](ConcurrencyConfig.md)

Defined in: [ai/src/types/AgentManifest.ts:53](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L53)

***

### contextSchema?

> `optional` **contextSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [ai/src/types/AgentManifest.ts:61](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L61)

***

### description?

> `optional` **description**: `string`

Defined in: [ai/src/types/AgentManifest.ts:47](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L47)

***

### eventBridge

> **eventBridge**: `string`

Defined in: [ai/src/types/AgentManifest.ts:48](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L48)

***

### httpExposure?

> `optional` **httpExposure**: [`AgentHttpExposure`](AgentHttpExposure.md)

Defined in: [ai/src/types/AgentManifest.ts:62](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L62)

***

### knowledge?

> `optional` **knowledge**: [`KnowledgeAdapterConfig`](KnowledgeAdapterConfig.md)[]

Defined in: [ai/src/types/AgentManifest.ts:52](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L52)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [ai/src/types/AgentManifest.ts:63](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L63)

***

### modelResource?

> `optional` **modelResource**: `object`

Defined in: [ai/src/types/AgentManifest.ts:50](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L50)

#### resourceName

> **resourceName**: `string`

#### variant?

> `optional` **variant**: `string`

***

### models?

> `optional` **models**: `string`[]

Defined in: [ai/src/types/AgentManifest.ts:49](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L49)

***

### outputSchema?

> `optional` **outputSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [ai/src/types/AgentManifest.ts:60](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L60)

***

### parameterSchema?

> `optional` **parameterSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [ai/src/types/AgentManifest.ts:59](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L59)

***

### payloadSchema?

> `optional` **payloadSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [ai/src/types/AgentManifest.ts:58](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L58)

***

### resources?

> `optional` **resources**: `Record`\<`string`, \{ `resourceName`: `string`; \}\>

Defined in: [ai/src/types/AgentManifest.ts:57](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L57)

***

### retryPolicy?

> `optional` **retryPolicy**: [`RetryPolicy`](RetryPolicy.md)

Defined in: [ai/src/types/AgentManifest.ts:54](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L54)

***

### session?

> `optional` **session**: [`AgentSessionConfig`](AgentSessionConfig.md)

Defined in: [ai/src/types/AgentManifest.ts:51](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L51)

***

### telemetry?

> `optional` **telemetry**: `object`

Defined in: [ai/src/types/AgentManifest.ts:55](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentManifest.ts#L55)

#### attributes?

> `optional` **attributes**: `Record`\<`string`, `string` \| `number` \| `boolean`\>
