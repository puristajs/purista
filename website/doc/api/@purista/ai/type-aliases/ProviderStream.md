[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderStream

# Type Alias: ProviderStream

> **ProviderStream** = `AsyncIterable`\<[`ProviderStreamChunk`](ProviderStreamChunk.md)\> & `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:255](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/providers/runtime/ModelProvider.ts#L255)

Stream handle returned by [ModelProvider.stream](../interfaces/ModelProvider.md#stream).
Consumers iterate chunks and call `final()` to obtain usage/metadata.

## Type Declaration

### final()

> **final**(): `Promise`\<[`ProviderResponse`](ProviderResponse.md)\>

#### Returns

`Promise`\<[`ProviderResponse`](ProviderResponse.md)\>
