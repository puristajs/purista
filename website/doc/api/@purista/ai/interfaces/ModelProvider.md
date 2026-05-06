[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ModelProvider

# Interface: ModelProvider

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:264](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L264)

Minimal interface providers must satisfy so they can be swapped at runtime.

## Properties

### capabilities

> `readonly` **capabilities**: [`ModelProviderCapabilities`](../type-aliases/ModelProviderCapabilities.md)

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:266](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L266)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:265](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L265)

## Methods

### embed()?

> `optional` **embed**(`request`): `Promise`\<[`ProviderEmbedResponse`](../type-aliases/ProviderEmbedResponse.md)\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:291](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L291)

#### Parameters

##### request

[`ProviderEmbedRequest`](../type-aliases/ProviderEmbedRequest.md)

#### Returns

`Promise`\<[`ProviderEmbedResponse`](../type-aliases/ProviderEmbedResponse.md)\>

***

### embedMany()?

> `optional` **embedMany**(`request`): `Promise`\<[`ProviderEmbedManyResponse`](../type-aliases/ProviderEmbedManyResponse.md)\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:292](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L292)

#### Parameters

##### request

[`ProviderEmbedManyRequest`](../type-aliases/ProviderEmbedManyRequest.md)

#### Returns

`Promise`\<[`ProviderEmbedManyResponse`](../type-aliases/ProviderEmbedManyResponse.md)\>

***

### generateObject()?

> `optional` **generateObject**\<`T`, `OutputSchema`\>(`request`): `Promise`\<[`ProviderJsonResponse`](../type-aliases/ProviderJsonResponse.md)\<[`ProviderJsonOutputFromSchema`](../type-aliases/ProviderJsonOutputFromSchema.md)\<`OutputSchema`, `T`\>\>\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:285](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L285)

#### Type Parameters

##### T

`T` = `unknown`

##### OutputSchema

`OutputSchema` = `unknown`

#### Parameters

##### request

[`ProviderJsonRequest`](../type-aliases/ProviderJsonRequest.md)\<`OutputSchema`\>

#### Returns

`Promise`\<[`ProviderJsonResponse`](../type-aliases/ProviderJsonResponse.md)\<[`ProviderJsonOutputFromSchema`](../type-aliases/ProviderJsonOutputFromSchema.md)\<`OutputSchema`, `T`\>\>\>

***

### generateText()?

> `optional` **generateText**(`request`): `Promise`\<`string`\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:283](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L283)

High-level helper that yields one final text output while automatically
preferring `streamText()` when available.

#### Parameters

##### request

[`ProviderGenerateTextRequest`](../type-aliases/ProviderGenerateTextRequest.md)

#### Returns

`Promise`\<`string`\>

#### Example

```ts
const answer = await context.models['openai:primary'].generateText({
  developerInstruction: 'Use the available tools before answering.',
  prompt: payload.prompt,
  onTextDelta: delta => context.stream.sendDelta(delta),
})
```

In normal handler code the PURISTA runtime fills in declared skills and
allowlisted bindings automatically when you omit them.

***

### rerank()?

> `optional` **rerank**\<`Document`\>(`request`): `Promise`\<[`ProviderRerankResponse`](../type-aliases/ProviderRerankResponse.md)\<`Document`\>\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:293](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L293)

#### Type Parameters

##### Document

`Document` = `string` \| `Record`\<`string`, `unknown`\>

#### Parameters

##### request

[`ProviderRerankRequest`](../type-aliases/ProviderRerankRequest.md)\<`Document`\>

#### Returns

`Promise`\<[`ProviderRerankResponse`](../type-aliases/ProviderRerankResponse.md)\<`Document`\>\>

***

### streamObject()?

> `optional` **streamObject**\<`T`, `OutputSchema`\>(`request`): [`ProviderObjectStream`](../type-aliases/ProviderObjectStream.md)\<[`ProviderJsonOutputFromSchema`](../type-aliases/ProviderJsonOutputFromSchema.md)\<`OutputSchema`, `T`\>\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:288](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L288)

#### Type Parameters

##### T

`T` = `unknown`

##### OutputSchema

`OutputSchema` = `unknown`

#### Parameters

##### request

[`ProviderObjectStreamRequest`](../type-aliases/ProviderObjectStreamRequest.md)\<[`ProviderJsonOutputFromSchema`](../type-aliases/ProviderJsonOutputFromSchema.md)\<`OutputSchema`, `T`\>, `OutputSchema`\>

#### Returns

[`ProviderObjectStream`](../type-aliases/ProviderObjectStream.md)\<[`ProviderJsonOutputFromSchema`](../type-aliases/ProviderJsonOutputFromSchema.md)\<`OutputSchema`, `T`\>\>

***

### streamText()?

> `optional` **streamText**(`request`): [`ProviderStream`](../type-aliases/ProviderStream.md)

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:284](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L284)

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

[`ProviderStream`](../type-aliases/ProviderStream.md)
