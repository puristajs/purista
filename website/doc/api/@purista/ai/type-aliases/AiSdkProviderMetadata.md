[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AiSdkProviderMetadata

# Type Alias: AiSdkProviderMetadata

> **AiSdkProviderMetadata** = `object`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:86](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/AiSdkProvider.ts#L86)

Request metadata field understood by [AiSdkProvider](../classes/AiSdkProvider.md). Attach it to [ProviderRequest.metadata](ProviderRequest.md#metadata)
to override call settings per invocation.

## Example

```ts
await provider.generate({
  prompt: 'Summarise the ticket',
  metadata: {
    aiSdk: {
      temperature: 0.2,
      maxOutputTokens: 512,
    },
  },
})
```

## Properties

### aiSdk?

> `optional` **aiSdk**: [`AiSdkProviderOverrides`](AiSdkProviderOverrides.md) & `object`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:87](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/AiSdkProvider.ts#L87)

#### Type Declaration

##### embed?

> `optional` **embed**: [`AiSdkEmbedOverrides`](AiSdkEmbedOverrides.md)

##### embedMany?

> `optional` **embedMany**: [`AiSdkEmbedManyOverrides`](AiSdkEmbedManyOverrides.md)

##### generate?

> `optional` **generate**: [`AiSdkProviderOverrides`](AiSdkProviderOverrides.md)

##### generateJson?

> `optional` **generateJson**: [`AiSdkGenerateJsonOverrides`](AiSdkGenerateJsonOverrides.md)

##### rerank?

> `optional` **rerank**: [`AiSdkRerankOverrides`](AiSdkRerankOverrides.md)
