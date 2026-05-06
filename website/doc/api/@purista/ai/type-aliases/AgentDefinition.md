[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / AgentDefinition

# Type Alias: AgentDefinition\<S\>

> **AgentDefinition**\<`S`\> = `object`

Defined in: ai/src/builder/types.ts:263

## Type Parameters

### S

`S` *extends* `AnyAgentQueueBuilderTypes` = [`AgentQueueBuilderTypes`](AgentQueueBuilderTypes.md)

## Properties

### execution

> **execution**: `AgentExecutionDefinition`\<[`InferIn`](../../core/type-aliases/InferIn.md)\<`S`\[`"PayloadSchema"`\]\>, [`InferIn`](../../core/type-aliases/InferIn.md)\<`S`\[`"ParameterSchema"`\]\>, `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], [`Infer`](../../core/type-aliases/Infer.md)\<`S`\[`"OutputSchema"`\]\>\>

Defined in: ai/src/builder/types.ts:268

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)\<`S`\[`"Models"`\]\>

Defined in: ai/src/builder/types.ts:264

***

### outputSchema?

> `optional` **outputSchema**: `S`\[`"OutputSchema"`\]

Defined in: ai/src/builder/types.ts:267

***

### parameterSchema?

> `optional` **parameterSchema**: `S`\[`"ParameterSchema"`\]

Defined in: ai/src/builder/types.ts:266

***

### payloadSchema?

> `optional` **payloadSchema**: `S`\[`"PayloadSchema"`\]

Defined in: ai/src/builder/types.ts:265

***

### runtime

> **runtime**: `AgentRuntimeRef`\<[`Infer`](../../core/type-aliases/Infer.md)\<`S`\[`"OutputSchema"`\]\>\>

Defined in: ai/src/builder/types.ts:277
