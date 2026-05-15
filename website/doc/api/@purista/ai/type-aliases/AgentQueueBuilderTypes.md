[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / AgentQueueBuilderTypes

# Type Alias: AgentQueueBuilderTypes\<PayloadSchema, ParameterSchema, OutputSchema, Resources, Models, CommandTools, AgentTools, Execution\>

> **AgentQueueBuilderTypes**\<`PayloadSchema`, `ParameterSchema`, `OutputSchema`, `Resources`, `Models`, `CommandTools`, `AgentTools`, `Execution`\> = `object`

Defined in: [builder/types.ts:350](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L350)

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

`Models` *extends* `Record`\<`string`, [`AgentModelBinding`](AgentModelBinding.md)\> = `Record`\<`never`, `never`\>

### CommandTools

`CommandTools` *extends* `Record`\<`string`, [`AllowedCommandToolDefinition`](AllowedCommandToolDefinition.md)\> = `Record`\<`never`, `never`\>

### AgentTools

`AgentTools` *extends* `Record`\<`string`, [`AllowedAgentDefinition`](AllowedAgentDefinition.md)\> = `Record`\<`never`, `never`\>

### Execution

`Execution` *extends* `AgentExecutionKind` \| `undefined` = `undefined`

## Properties

### AgentTools

> **AgentTools**: `AgentTools`

Defined in: [builder/types.ts:366](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L366)

***

### CommandTools

> **CommandTools**: `CommandTools`

Defined in: [builder/types.ts:365](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L365)

***

### Execution

> **Execution**: `Execution`

Defined in: [builder/types.ts:367](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L367)

***

### Models

> **Models**: `Models`

Defined in: [builder/types.ts:364](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L364)

***

### OutputSchema

> **OutputSchema**: `OutputSchema`

Defined in: [builder/types.ts:362](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L362)

***

### ParameterSchema

> **ParameterSchema**: `ParameterSchema`

Defined in: [builder/types.ts:361](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L361)

***

### PayloadSchema

> **PayloadSchema**: `PayloadSchema`

Defined in: [builder/types.ts:360](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L360)

***

### Resources

> **Resources**: `Resources`

Defined in: [builder/types.ts:363](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L363)
