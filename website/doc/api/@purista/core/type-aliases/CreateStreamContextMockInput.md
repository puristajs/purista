[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CreateStreamContextMockInput

# Type Alias: CreateStreamContextMockInput\<TBuilder\>

> **CreateStreamContextMockInput**\<`TBuilder`\> = `object`

Defined in: [testing/createStreamContextMock.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L24)

## Type Parameters

### TBuilder

`TBuilder` *extends* [`StreamDefinitionBuilder`](../classes/StreamDefinitionBuilder.md)\<`any`, `any`\>

## Properties

### message?

> `optional` **message?**: `Partial`\<[`StreamOpenRequest`](StreamOpenRequest.md)\<[`Infer`](Infer.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"PayloadSchema"`\]\>, [`Infer`](Infer.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"ParamsSchema"`\]\>\>\>

Defined in: [testing/createStreamContextMock.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L29)

***

### parameter

> **parameter**: [`InferIn`](InferIn.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"ParamsSchema"`\]\>

Defined in: [testing/createStreamContextMock.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L26)

***

### payload

> **payload**: [`InferIn`](InferIn.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"PayloadSchema"`\]\>

Defined in: [testing/createStreamContextMock.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L25)

***

### resources?

> `optional` **resources?**: `Partial`\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Resources"`\]\>

Defined in: [testing/createStreamContextMock.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L28)

***

### sandbox?

> `optional` **sandbox?**: `SinonSandbox`

Defined in: [testing/createStreamContextMock.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L27)
