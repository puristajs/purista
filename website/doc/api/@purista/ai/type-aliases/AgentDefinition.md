[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / AgentDefinition

# Type Alias: AgentDefinition\<S\>

> **AgentDefinition**\<`S`\> = `object`

Defined in: [builder/types.ts:321](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L321)

## Type Parameters

### S

`S` *extends* `AnyAgentQueueBuilderTypes` = [`AgentQueueBuilderTypes`](AgentQueueBuilderTypes.md)

## Properties

### execution

> **execution**: `AgentExecutionDefinition`\<[`InferIn`](../../core/type-aliases/InferIn.md)\<`S`\[`"PayloadSchema"`\]\>, [`InferIn`](../../core/type-aliases/InferIn.md)\<`S`\[`"ParameterSchema"`\]\>, `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], [`Infer`](../../core/type-aliases/Infer.md)\<`S`\[`"OutputSchema"`\]\>\>

Defined in: [builder/types.ts:326](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L326)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)\<`S`\[`"Models"`\]\>

Defined in: [builder/types.ts:322](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L322)

***

### outputSchema?

> `optional` **outputSchema?**: `S`\[`"OutputSchema"`\]

Defined in: [builder/types.ts:325](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L325)

***

### parameterSchema?

> `optional` **parameterSchema?**: `S`\[`"ParameterSchema"`\]

Defined in: [builder/types.ts:324](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L324)

***

### payloadSchema?

> `optional` **payloadSchema?**: `S`\[`"PayloadSchema"`\]

Defined in: [builder/types.ts:323](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L323)

***

### runtime

> **runtime**: `AgentRuntimeRef`\<[`Infer`](../../core/type-aliases/Infer.md)\<`S`\[`"OutputSchema"`\]\>\>

Defined in: [builder/types.ts:335](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L335)
