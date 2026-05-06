[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ModelProviderForCapabilities

# Type Alias: ModelProviderForCapabilities\<Capabilities\>

> **ModelProviderForCapabilities**\<`Capabilities`\> = `Pick`\<[`ModelProvider`](../interfaces/ModelProvider.md), `"name"` \| `"capabilities"`\> & `Required`\<`Pick`\<[`ModelProvider`](../interfaces/ModelProvider.md), `MethodKeysForCapabilities`\<`Capabilities`\>\>\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:314](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L314)

## Type Parameters

### Capabilities

`Capabilities` *extends* readonly [`ModelProviderCapability`](ModelProviderCapability.md)[]
