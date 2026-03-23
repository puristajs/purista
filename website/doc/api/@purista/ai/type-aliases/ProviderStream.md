[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderStream

# Type Alias: ProviderStream

> **ProviderStream** = `AsyncIterable`\<[`ProviderStreamChunk`](ProviderStreamChunk.md)\> & `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:160](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L160)

Stream handle returned by [ModelProvider.stream](../interfaces/ModelProvider.md#stream).
Consumers iterate chunks and call `final()` to obtain usage/metadata.

## Type Declaration

### final()

> **final**(): `Promise`\<[`ProviderResponse`](ProviderResponse.md)\>

#### Returns

`Promise`\<[`ProviderResponse`](ProviderResponse.md)\>
