[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ModelProvider

# Interface: ModelProvider

Defined in: providers/runtime/ModelProvider.ts:25

Minimal interface providers must satisfy so they can be swapped at runtime.

## Properties

### name

> `readonly` **name**: `string`

Defined in: providers/runtime/ModelProvider.ts:26

## Methods

### generate()

> **generate**(`request`): `Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>

Defined in: providers/runtime/ModelProvider.ts:27

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

`Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>
