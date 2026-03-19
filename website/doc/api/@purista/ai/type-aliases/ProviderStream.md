[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderStream

# Type Alias: ProviderStream

> **ProviderStream** = `AsyncIterable`\<[`ProviderStreamChunk`](ProviderStreamChunk.md)\> & `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:154](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/providers/runtime/ModelProvider.ts#L154)

Stream handle returned by [ModelProvider.stream](../interfaces/ModelProvider.md#stream).
Consumers iterate chunks and call `final()` to obtain usage/metadata.

## Type Declaration

### final()

> **final**(): `Promise`\<[`ProviderResponse`](ProviderResponse.md)\>

#### Returns

`Promise`\<[`ProviderResponse`](ProviderResponse.md)\>
