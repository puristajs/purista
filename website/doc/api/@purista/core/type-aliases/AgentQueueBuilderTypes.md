[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / AgentQueueBuilderTypes

# Type Alias: AgentQueueBuilderTypes\<PayloadSchema, ParameterSchema, OutputSchema, Resources, Models, CommandTools, AgentTools, Execution, Metrics\>

> **AgentQueueBuilderTypes**\<`PayloadSchema`, `ParameterSchema`, `OutputSchema`, `Resources`, `Models`, `CommandTools`, `AgentTools`, `Execution`, `Metrics`\> = `object`

Defined in: [AgentQueueBuilder/types.ts:361](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L361)

## Type Parameters

### PayloadSchema

`PayloadSchema` *extends* [`Schema`](Schema.md) = [`Schema`](Schema.md)

### ParameterSchema

`ParameterSchema` *extends* [`Schema`](Schema.md) = [`Schema`](Schema.md)

### OutputSchema

`OutputSchema` *extends* [`Schema`](Schema.md) = [`Schema`](Schema.md)

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`AgentModelBinding`](AgentModelBinding.md)\> = `Record`\<`never`, `never`\>

### CommandTools

`CommandTools` *extends* `Record`\<`string`, [`AllowedCommandToolDefinition`](AllowedCommandToolDefinition.md)\> = `Record`\<`never`, `never`\>

### AgentTools

`AgentTools` *extends* `Record`\<`string`, [`AllowedAgentDefinition`](AllowedAgentDefinition.md)\> = `Record`\<`never`, `never`\>

### Execution

`Execution` *extends* `AgentExecutionKind` \| `undefined` = `undefined`

### Metrics

`Metrics` *extends* `PuristaMetricDefinitions` = [`EmptyObject`](EmptyObject.md)

## Properties

### AgentTools

> **AgentTools**: `AgentTools`

Defined in: [AgentQueueBuilder/types.ts:378](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L378)

***

### CommandTools

> **CommandTools**: `CommandTools`

Defined in: [AgentQueueBuilder/types.ts:377](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L377)

***

### Execution

> **Execution**: `Execution`

Defined in: [AgentQueueBuilder/types.ts:379](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L379)

***

### Metrics

> **Metrics**: `Metrics`

Defined in: [AgentQueueBuilder/types.ts:380](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L380)

***

### Models

> **Models**: `Models`

Defined in: [AgentQueueBuilder/types.ts:376](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L376)

***

### OutputSchema

> **OutputSchema**: `OutputSchema`

Defined in: [AgentQueueBuilder/types.ts:374](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L374)

***

### ParameterSchema

> **ParameterSchema**: `ParameterSchema`

Defined in: [AgentQueueBuilder/types.ts:373](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L373)

***

### PayloadSchema

> **PayloadSchema**: `PayloadSchema`

Defined in: [AgentQueueBuilder/types.ts:372](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L372)

***

### Resources

> **Resources**: `Resources`

Defined in: [AgentQueueBuilder/types.ts:375](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L375)
