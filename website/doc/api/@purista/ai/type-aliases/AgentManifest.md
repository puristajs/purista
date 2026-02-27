[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentManifest

# Type Alias: AgentManifest\<TInput, TContext\>

> **AgentManifest**\<`TInput`, `TContext`\> = `object`

Defined in: types/AgentManifest.ts:49

## Type Parameters

### TInput

`TInput` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

### TContext

`TContext` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

## Properties

### allowedTools

> **allowedTools**: [`AllowedToolDefinition`](AllowedToolDefinition.md)[]

Defined in: types/AgentManifest.ts:55

***

### concurrency?

> `optional` **concurrency**: [`ConcurrencyPoolConfig`](ConcurrencyPoolConfig.md)

Defined in: types/AgentManifest.ts:58

***

### contextSchema?

> `optional` **contextSchema**: `TContext`

Defined in: types/AgentManifest.ts:63

***

### description?

> `optional` **description**: `string`

Defined in: types/AgentManifest.ts:53

***

### evaluation?

> `optional` **evaluation**: [`EvaluationProfile`](EvaluationProfile.md)

Defined in: types/AgentManifest.ts:60

***

### inputSchema?

> `optional` **inputSchema**: `TInput`

Defined in: types/AgentManifest.ts:62

***

### knowledge?

> `optional` **knowledge**: [`KnowledgeAdapterConfig`](KnowledgeAdapterConfig.md)[]

Defined in: types/AgentManifest.ts:57

***

### memory?

> `optional` **memory**: [`MemoryAdapterConfig`](MemoryAdapterConfig.md)

Defined in: types/AgentManifest.ts:56

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: types/AgentManifest.ts:64

***

### modelResource

> **modelResource**: [`ModelResourceReference`](ModelResourceReference.md)

Defined in: types/AgentManifest.ts:54

***

### name

> **name**: `string`

Defined in: types/AgentManifest.ts:50

***

### retryPolicy?

> `optional` **retryPolicy**: [`RetryPolicy`](RetryPolicy.md)

Defined in: types/AgentManifest.ts:59

***

### runtime

> **runtime**: [`AgentRuntimeMode`](AgentRuntimeMode.md)

Defined in: types/AgentManifest.ts:52

***

### telemetry?

> `optional` **telemetry**: [`TelemetryConfig`](TelemetryConfig.md)

Defined in: types/AgentManifest.ts:61

***

### version

> **version**: `string`

Defined in: types/AgentManifest.ts:51
