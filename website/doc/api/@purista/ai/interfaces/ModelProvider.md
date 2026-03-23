[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ModelProvider

# Interface: ModelProvider

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:187](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/ModelProvider.ts#L187)

Minimal interface providers must satisfy so they can be swapped at runtime.

## Properties

### capabilities

> `readonly` **capabilities**: [`ModelProviderCapabilities`](../type-aliases/ModelProviderCapabilities.md)

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:189](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/ModelProvider.ts#L189)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:188](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/ModelProvider.ts#L188)

## Methods

### embed()?

> `optional` **embed**(`request`): `Promise`\<[`ProviderEmbedResponse`](../type-aliases/ProviderEmbedResponse.md)\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:210](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/ModelProvider.ts#L210)

#### Parameters

##### request

[`ProviderEmbedRequest`](../type-aliases/ProviderEmbedRequest.md)

#### Returns

`Promise`\<[`ProviderEmbedResponse`](../type-aliases/ProviderEmbedResponse.md)\>

***

### embedMany()?

> `optional` **embedMany**(`request`): `Promise`\<[`ProviderEmbedManyResponse`](../type-aliases/ProviderEmbedManyResponse.md)\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:211](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/ModelProvider.ts#L211)

#### Parameters

##### request

[`ProviderEmbedManyRequest`](../type-aliases/ProviderEmbedManyRequest.md)

#### Returns

`Promise`\<[`ProviderEmbedManyResponse`](../type-aliases/ProviderEmbedManyResponse.md)\>

***

### generate()?

> `optional` **generate**(`request`): `Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:190](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/ModelProvider.ts#L190)

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

`Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>

***

### generateJson()?

> `optional` **generateJson**\<`T`\>(`request`): `Promise`\<[`ProviderJsonResponse`](../type-aliases/ProviderJsonResponse.md)\<`T`\>\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:209](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/ModelProvider.ts#L209)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### request

[`ProviderJsonRequest`](../type-aliases/ProviderJsonRequest.md)

#### Returns

`Promise`\<[`ProviderJsonResponse`](../type-aliases/ProviderJsonResponse.md)\<`T`\>\>

***

### generateText()?

> `optional` **generateText**(`request`): `Promise`\<`string`\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:208](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/ModelProvider.ts#L208)

High-level helper that yields one final text output while automatically
preferring `stream()` and falling back to `generate()`.

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
  onTextDelta: delta => context.stream.sendChunk(delta),
})
```

In normal handler code the PURISTA runtime fills in declared skills and
allowlisted bindings automatically when you omit them.

***

### rerank()?

> `optional` **rerank**\<`Document`\>(`request`): `Promise`\<[`ProviderRerankResponse`](../type-aliases/ProviderRerankResponse.md)\<`Document`\>\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:212](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/ModelProvider.ts#L212)

#### Type Parameters

##### Document

`Document` = `string` \| `Record`\<`string`, `unknown`\>

#### Parameters

##### request

[`ProviderRerankRequest`](../type-aliases/ProviderRerankRequest.md)\<`Document`\>

#### Returns

`Promise`\<[`ProviderRerankResponse`](../type-aliases/ProviderRerankResponse.md)\<`Document`\>\>

***

### stream()?

> `optional` **stream**(`request`): [`ProviderStream`](../type-aliases/ProviderStream.md)

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:191](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/ModelProvider.ts#L191)

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

[`ProviderStream`](../type-aliases/ProviderStream.md)
