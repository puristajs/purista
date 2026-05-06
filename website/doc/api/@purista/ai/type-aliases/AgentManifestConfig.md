[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentManifestConfig

# Type Alias: AgentManifestConfig

> **AgentManifestConfig** = `object`

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:80

## Properties

### agentName

> **agentName**: `string`

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:81

***

### allowedAgents?

> `optional` **allowedAgents**: [`AllowedAgentDefinition`](AllowedAgentDefinition.md)[]

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:88

***

### allowedTools

> **allowedTools**: [`AllowedToolDefinition`](AllowedToolDefinition.md)[]

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:87

***

### description?

> `optional` **description**: `string`

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:83

***

### executionPolicy?

> `optional` **executionPolicy**: [`AgentExecutionPolicy`](AgentExecutionPolicy.md)

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:85

***

### httpExposure?

> `optional` **httpExposure**: `object`

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:92

#### method

> **method**: [`SupportedHttpMethod`](../../core/type-aliases/SupportedHttpMethod.md)

#### path

> **path**: `string`

#### public?

> `optional` **public**: `boolean`

#### queryParameters?

> `optional` **queryParameters**: [`QueryParameter`](../../core/type-aliases/QueryParameter.md)[]

#### requestContentType?

> `optional` **requestContentType**: `string`

#### requestEncoding?

> `optional` **requestEncoding**: `string`

#### responseContentType?

> `optional` **responseContentType**: `string`

#### responseEncoding?

> `optional` **responseEncoding**: `string`

#### streamingMode?

> `optional` **streamingMode**: `"stream"` \| `"aggregate"`

#### streamProtocolAdapter?

> `optional` **streamProtocolAdapter**: [`AgentStreamProtocolAdapterId`](AgentStreamProtocolAdapterId.md)

***

### model?

> `optional` **model**: [`AgentModelBinding`](AgentModelBinding.md)

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:86

***

### outputSchema?

> `optional` **outputSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:91

***

### parameterSchema?

> `optional` **parameterSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:90

***

### payloadSchema?

> `optional` **payloadSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:89

***

### sandbox?

> `optional` **sandbox**: [`AgentSandboxPolicy`](AgentSandboxPolicy.md)

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:84

***

### serviceVersion

> **serviceVersion**: `string`

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:82

***

### successEventName?

> `optional` **successEventName**: `string`

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:104
