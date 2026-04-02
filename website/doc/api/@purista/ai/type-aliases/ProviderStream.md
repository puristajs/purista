[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderStream

# Type Alias: ProviderStream

> **ProviderStream** = `AsyncIterable`\<[`ProviderStreamChunk`](ProviderStreamChunk.md)\> & `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:255](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/providers/runtime/ModelProvider.ts#L255)

Stream handle returned by [ModelProvider.stream](../interfaces/ModelProvider.md#stream).
Consumers iterate chunks and call `final()` to obtain usage/metadata.

## Type Declaration

### final()

> **final**(): `Promise`\<[`ProviderResponse`](ProviderResponse.md)\>

#### Returns

`Promise`\<[`ProviderResponse`](ProviderResponse.md)\>
