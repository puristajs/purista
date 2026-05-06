[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CreateCommandContextMockInput

# Type Alias: CreateCommandContextMockInput\<TBuilder\>

> **CreateCommandContextMockInput**\<`TBuilder`\> = `object`

Defined in: [testing/createCommandContextMock.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createCommandContextMock.ts#L28)

## Type Parameters

### TBuilder

`TBuilder` *extends* [`CommandDefinitionBuilder`](../classes/CommandDefinitionBuilder.md)\<`any`, `any`\>

## Properties

### message?

> `optional` **message**: `object`

Defined in: [testing/createCommandContextMock.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createCommandContextMock.ts#L39)

#### parameter

> **parameter**: [`GetMessageParamsType`](GetMessageParamsType.md)\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"ParamsSchema"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"TransformInputParamsSchema"`\]\>

#### payload

> **payload**: [`GetMessagePayloadType`](GetMessagePayloadType.md)\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"PayloadSchema"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"TransformInputPayloadSchema"`\]\>

***

### parameter

> **parameter**: [`GetMessageParamsType`](GetMessageParamsType.md)\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"ParamsSchema"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"TransformInputParamsSchema"`\]\>

Defined in: [testing/createCommandContextMock.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createCommandContextMock.ts#L33)

***

### payload

> **payload**: [`GetMessagePayloadType`](GetMessagePayloadType.md)\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"PayloadSchema"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"TransformInputPayloadSchema"`\]\>

Defined in: [testing/createCommandContextMock.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createCommandContextMock.ts#L29)

***

### resources?

> `optional` **resources**: `Partial`\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Resources"`\]\>

Defined in: [testing/createCommandContextMock.ts:38](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createCommandContextMock.ts#L38)

***

### sandbox?

> `optional` **sandbox**: `SinonSandbox`

Defined in: [testing/createCommandContextMock.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createCommandContextMock.ts#L37)
