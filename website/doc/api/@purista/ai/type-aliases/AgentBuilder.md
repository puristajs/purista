[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentBuilder

# Type Alias: AgentBuilder

> **AgentBuilder** = `object`

Defined in: builder/defineAgent.ts:31

Fluent builder used to compose [AgentManifest](AgentManifest.md) objects.

## Example

```ts
const ticketAgentDefinition = defineAgent({ name: 'ticket' })
  .setDescription('Classifies help desk tickets')
  .setModelResource({ name: 'openai:gpt-4o-mini' })
  .allowTool({
    serviceName: 'support',
    version: 'v1',
    commandName: 'createTask',
  })
  .build()
```

## Methods

### allowTool()

> **allowTool**(`tool`): `AgentBuilder`

Defined in: builder/defineAgent.ts:35

#### Parameters

##### tool

[`AllowedToolDefinition`](AllowedToolDefinition.md)

#### Returns

`AgentBuilder`

***

### build()

> **build**(): [`AgentDefinition`](AgentDefinition.md)

Defined in: builder/defineAgent.ts:44

#### Returns

[`AgentDefinition`](AgentDefinition.md)

***

### setConcurrency()

> **setConcurrency**(`pool`): `AgentBuilder`

Defined in: builder/defineAgent.ts:40

#### Parameters

##### pool

[`ConcurrencyPoolConfig`](ConcurrencyPoolConfig.md) | `undefined`

#### Returns

`AgentBuilder`

***

### setContextSchema()

> **setContextSchema**(`schema`): `AgentBuilder`

Defined in: builder/defineAgent.ts:37

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`

***

### setDescription()

> **setDescription**(`description`): `AgentBuilder`

Defined in: builder/defineAgent.ts:32

#### Parameters

##### description

`string`

#### Returns

`AgentBuilder`

***

### setEvaluation()

> **setEvaluation**(`profile`): `AgentBuilder`

Defined in: builder/defineAgent.ts:43

#### Parameters

##### profile

[`EvaluationProfile`](EvaluationProfile.md) | `undefined`

#### Returns

`AgentBuilder`

***

### setInputSchema()

> **setInputSchema**(`schema`): `AgentBuilder`

Defined in: builder/defineAgent.ts:36

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`

***

### setKnowledge()

> **setKnowledge**(`adapters`): `AgentBuilder`

Defined in: builder/defineAgent.ts:39

#### Parameters

##### adapters

[`KnowledgeAdapterConfig`](KnowledgeAdapterConfig.md)[] | `undefined`

#### Returns

`AgentBuilder`

***

### setMemory()

> **setMemory**(`config`): `AgentBuilder`

Defined in: builder/defineAgent.ts:38

#### Parameters

##### config

[`MemoryAdapterConfig`](MemoryAdapterConfig.md) | `undefined`

#### Returns

`AgentBuilder`

***

### setModelResource()

> **setModelResource**(`resource`): `AgentBuilder`

Defined in: builder/defineAgent.ts:34

#### Parameters

##### resource

[`ModelResourceReference`](ModelResourceReference.md)

#### Returns

`AgentBuilder`

***

### setRetryPolicy()

> **setRetryPolicy**(`policy`): `AgentBuilder`

Defined in: builder/defineAgent.ts:41

#### Parameters

##### policy

[`RetryPolicy`](RetryPolicy.md) | `undefined`

#### Returns

`AgentBuilder`

***

### setRuntime()

> **setRuntime**(`runtime`): `AgentBuilder`

Defined in: builder/defineAgent.ts:33

#### Parameters

##### runtime

[`AgentRuntimeMode`](AgentRuntimeMode.md)

#### Returns

`AgentBuilder`

***

### setTelemetry()

> **setTelemetry**(`config`): `AgentBuilder`

Defined in: builder/defineAgent.ts:42

#### Parameters

##### config

[`TelemetryConfig`](TelemetryConfig.md) | `undefined`

#### Returns

`AgentBuilder`
