[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AiSdkProviderMetadata

# Type Alias: AiSdkProviderMetadata

> **AiSdkProviderMetadata** = `object`

Defined in: [ai/src/providers/runtime/AiSdkProvider.ts:50](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/providers/runtime/AiSdkProvider.ts#L50)

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

> `optional` **aiSdk**: [`AiSdkProviderOverrides`](AiSdkProviderOverrides.md)

Defined in: [ai/src/providers/runtime/AiSdkProvider.ts:51](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/providers/runtime/AiSdkProvider.ts#L51)
