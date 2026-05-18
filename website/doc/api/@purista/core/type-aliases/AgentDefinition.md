[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / AgentDefinition

# Type Alias: AgentDefinition\<S\>

> **AgentDefinition**\<`S`\> = `object`

Defined in: [AgentQueueBuilder/types.ts:331](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L331)

## Type Parameters

### S

`S` *extends* `AnyAgentQueueBuilderTypes` = [`AgentQueueBuilderTypes`](AgentQueueBuilderTypes.md)

## Properties

### execution

> **execution**: `AgentExecutionDefinition`\<[`InferIn`](InferIn.md)\<`S`\[`"PayloadSchema"`\]\>, [`InferIn`](InferIn.md)\<`S`\[`"ParameterSchema"`\]\>, `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], [`Infer`](Infer.md)\<`S`\[`"OutputSchema"`\]\>, `S`\[`"Metrics"`\]\>

Defined in: [AgentQueueBuilder/types.ts:336](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L336)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)\<`S`\[`"Models"`\]\>

Defined in: [AgentQueueBuilder/types.ts:332](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L332)

***

### outputSchema?

> `optional` **outputSchema?**: `S`\[`"OutputSchema"`\]

Defined in: [AgentQueueBuilder/types.ts:335](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L335)

***

### parameterSchema?

> `optional` **parameterSchema?**: `S`\[`"ParameterSchema"`\]

Defined in: [AgentQueueBuilder/types.ts:334](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L334)

***

### payloadSchema?

> `optional` **payloadSchema?**: `S`\[`"PayloadSchema"`\]

Defined in: [AgentQueueBuilder/types.ts:333](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L333)

***

### runtime

> **runtime**: `AgentRuntimeRef`\<[`Infer`](Infer.md)\<`S`\[`"OutputSchema"`\]\>\>

Defined in: [AgentQueueBuilder/types.ts:346](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L346)
