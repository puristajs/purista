[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderStream

# Type Alias: ProviderStream

> **ProviderStream** = `AsyncIterable`\<[`ProviderStreamChunk`](ProviderStreamChunk.md)\> & `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:180](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/providers/runtime/ModelProvider.ts#L180)

Stream handle returned by [ModelProvider.stream](../interfaces/ModelProvider.md#stream).
Consumers iterate chunks and call `final()` to obtain usage/metadata.

## Type Declaration

### final()

> **final**(): `Promise`\<[`ProviderResponse`](ProviderResponse.md)\>

#### Returns

`Promise`\<[`ProviderResponse`](ProviderResponse.md)\>
