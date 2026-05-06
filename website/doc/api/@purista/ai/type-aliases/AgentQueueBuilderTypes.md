[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / AgentQueueBuilderTypes

# Type Alias: AgentQueueBuilderTypes\<PayloadSchema, ParameterSchema, OutputSchema, Resources, Models, CommandTools, AgentTools, Execution\>

> **AgentQueueBuilderTypes**\<`PayloadSchema`, `ParameterSchema`, `OutputSchema`, `Resources`, `Models`, `CommandTools`, `AgentTools`, `Execution`\> = `object`

Defined in: ai/src/builder/types.ts:292

## Type Parameters

### PayloadSchema

`PayloadSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

### ParameterSchema

`ParameterSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

### OutputSchema

`OutputSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`AgentModelBinding`](AgentModelBinding.md)\> = `Record`\<`string`, `never`\>

### CommandTools

`CommandTools` *extends* `Record`\<`string`, [`AllowedCommandToolDefinition`](AllowedCommandToolDefinition.md)\> = `Record`\<`string`, `never`\>

### AgentTools

`AgentTools` *extends* `Record`\<`string`, [`AllowedAgentDefinition`](AllowedAgentDefinition.md)\> = `Record`\<`string`, `never`\>

### Execution

`Execution` *extends* `AgentExecutionKind` \| `undefined` = `undefined`

## Properties

### AgentTools

> **AgentTools**: `AgentTools`

Defined in: ai/src/builder/types.ts:308

***

### CommandTools

> **CommandTools**: `CommandTools`

Defined in: ai/src/builder/types.ts:307

***

### Execution

> **Execution**: `Execution`

Defined in: ai/src/builder/types.ts:309

***

### Models

> **Models**: `Models`

Defined in: ai/src/builder/types.ts:306

***

### OutputSchema

> **OutputSchema**: `OutputSchema`

Defined in: ai/src/builder/types.ts:304

***

### ParameterSchema

> **ParameterSchema**: `ParameterSchema`

Defined in: ai/src/builder/types.ts:303

***

### PayloadSchema

> **PayloadSchema**: `PayloadSchema`

Defined in: ai/src/builder/types.ts:302

***

### Resources

> **Resources**: `Resources`

Defined in: ai/src/builder/types.ts:305
