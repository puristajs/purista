[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CreateStreamContextMockInput

# Type Alias: CreateStreamContextMockInput\<TBuilder\>

> **CreateStreamContextMockInput**\<`TBuilder`\> = `object`

Defined in: testing/createStreamContextMock.ts:30

## Type Parameters

### TBuilder

`TBuilder` *extends* [`StreamDefinitionBuilder`](../classes/StreamDefinitionBuilder.md)\<`any`, `any`\>

## Properties

### message?

> `optional` **message**: `Partial`\<[`StreamOpenRequest`](StreamOpenRequest.md)\<[`Infer`](Infer.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"PayloadSchema"`\]\>, [`Infer`](Infer.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"ParamsSchema"`\]\>\>\>

Defined in: testing/createStreamContextMock.ts:35

***

### parameter

> **parameter**: [`InferIn`](InferIn.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"ParamsSchema"`\]\>

Defined in: testing/createStreamContextMock.ts:32

***

### payload

> **payload**: [`InferIn`](InferIn.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"PayloadSchema"`\]\>

Defined in: testing/createStreamContextMock.ts:31

***

### resources?

> `optional` **resources**: `Partial`\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Resources"`\]\>

Defined in: testing/createStreamContextMock.ts:34

***

### sandbox?

> `optional` **sandbox**: `SinonSandbox`

Defined in: testing/createStreamContextMock.ts:33
