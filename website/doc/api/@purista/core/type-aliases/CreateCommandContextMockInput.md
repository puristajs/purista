[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CreateCommandContextMockInput

# Type Alias: CreateCommandContextMockInput\<TBuilder\>

> **CreateCommandContextMockInput**\<`TBuilder`\> = `object`

Defined in: testing/createCommandContextMock.ts:29

## Type Parameters

### TBuilder

`TBuilder` *extends* [`CommandDefinitionBuilder`](../classes/CommandDefinitionBuilder.md)\<`any`, `any`\>

## Properties

### message?

> `optional` **message**: `object`

Defined in: testing/createCommandContextMock.ts:40

#### parameter

> **parameter**: [`GetMessageParamsType`](GetMessageParamsType.md)\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"ParamsSchema"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"TransformInputParamsSchema"`\]\>

#### payload

> **payload**: [`GetMessagePayloadType`](GetMessagePayloadType.md)\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"PayloadSchema"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"TransformInputPayloadSchema"`\]\>

***

### parameter

> **parameter**: [`GetMessageParamsType`](GetMessageParamsType.md)\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"ParamsSchema"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"TransformInputParamsSchema"`\]\>

Defined in: testing/createCommandContextMock.ts:34

***

### payload

> **payload**: [`GetMessagePayloadType`](GetMessagePayloadType.md)\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"PayloadSchema"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"TransformInputPayloadSchema"`\]\>

Defined in: testing/createCommandContextMock.ts:30

***

### resources?

> `optional` **resources**: `Partial`\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Resources"`\]\>

Defined in: testing/createCommandContextMock.ts:39

***

### sandbox?

> `optional` **sandbox**: `SinonSandbox`

Defined in: testing/createCommandContextMock.ts:38
