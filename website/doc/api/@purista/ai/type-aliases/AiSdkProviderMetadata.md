[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AiSdkProviderMetadata

# Type Alias: AiSdkProviderMetadata

> **AiSdkProviderMetadata** = `object`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:101](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/AiSdkProvider.ts#L101)

Request metadata field understood by [AiSdkProvider](../classes/AiSdkProvider.md). Attach it to [ProviderRequest.metadata](ProviderRequest.md#metadata)
to override call settings per invocation, including bounded invocation policy.

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

> `optional` **aiSdk**: [`AiSdkProviderDefaults`](AiSdkProviderDefaults.md) & `object`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:102](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/AiSdkProvider.ts#L102)

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
