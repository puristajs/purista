[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CreateCommandContextMockInput

# Type Alias: CreateCommandContextMockInput\<TBuilder\>

> **CreateCommandContextMockInput**\<`TBuilder`\> = `object`

Defined in: [testing/createCommandContextMock.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createCommandContextMock.ts#L23)

## Type Parameters

### TBuilder

`TBuilder` *extends* [`CommandDefinitionBuilder`](../classes/CommandDefinitionBuilder.md)\<`any`, `any`\>

## Properties

### message?

> `optional` **message?**: `object`

Defined in: [testing/createCommandContextMock.ts:34](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createCommandContextMock.ts#L34)

#### parameter

> **parameter**: [`GetMessageParamsType`](GetMessageParamsType.md)\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"ParamsSchema"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"TransformInputParamsSchema"`\]\>

#### payload

> **payload**: [`GetMessagePayloadType`](GetMessagePayloadType.md)\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"PayloadSchema"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"TransformInputPayloadSchema"`\]\>

***

### parameter

> **parameter**: [`GetMessageParamsType`](GetMessageParamsType.md)\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"ParamsSchema"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"TransformInputParamsSchema"`\]\>

Defined in: [testing/createCommandContextMock.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createCommandContextMock.ts#L28)

***

### payload

> **payload**: [`GetMessagePayloadType`](GetMessagePayloadType.md)\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"PayloadSchema"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"TransformInputPayloadSchema"`\]\>

Defined in: [testing/createCommandContextMock.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createCommandContextMock.ts#L24)

***

### resources?

> `optional` **resources?**: `Partial`\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Resources"`\]\>

Defined in: [testing/createCommandContextMock.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createCommandContextMock.ts#L33)

***

### sandbox?

> `optional` **sandbox?**: `SinonSandbox`

Defined in: [testing/createCommandContextMock.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createCommandContextMock.ts#L32)
