[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ModelProvider

# Interface: ModelProvider

Defined in: [ai/src/providers/runtime/ModelProvider.ts:26](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/providers/runtime/ModelProvider.ts#L26)

Minimal interface providers must satisfy so they can be swapped at runtime.

## Properties

### name

> `readonly` **name**: `string`

Defined in: [ai/src/providers/runtime/ModelProvider.ts:27](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/providers/runtime/ModelProvider.ts#L27)

## Methods

### generate()

> **generate**(`request`): `Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>

Defined in: [ai/src/providers/runtime/ModelProvider.ts:28](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/providers/runtime/ModelProvider.ts#L28)

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

`Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>
