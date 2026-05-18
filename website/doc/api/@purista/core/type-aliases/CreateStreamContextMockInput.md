[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CreateStreamContextMockInput

# Type Alias: CreateStreamContextMockInput\<TBuilder\>

> **CreateStreamContextMockInput**\<`TBuilder`\> = `object`

Defined in: [testing/createStreamContextMock.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L35)

## Type Parameters

### TBuilder

`TBuilder` *extends* [`StreamDefinitionBuilder`](../classes/StreamDefinitionBuilder.md)\<`any`, `any`\>

## Properties

### message?

> `optional` **message?**: `Partial`\<[`StreamOpenRequest`](StreamOpenRequest.md)\<[`Infer`](Infer.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"PayloadSchema"`\]\>, [`Infer`](Infer.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"ParamsSchema"`\]\>\>\>

Defined in: [testing/createStreamContextMock.ts:40](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L40)

***

### parameter

> **parameter**: [`InferIn`](InferIn.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"ParamsSchema"`\]\>

Defined in: [testing/createStreamContextMock.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L37)

***

### payload

> **payload**: [`InferIn`](InferIn.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"PayloadSchema"`\]\>

Defined in: [testing/createStreamContextMock.ts:36](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L36)

***

### resources?

> `optional` **resources?**: `Partial`\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Resources"`\]\>

Defined in: [testing/createStreamContextMock.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L39)

***

### sandbox?

> `optional` **sandbox?**: `SinonSandbox`

Defined in: [testing/createStreamContextMock.ts:38](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L38)
