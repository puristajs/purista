[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AddModelAlias

# Type Alias: AddModelAlias\<T, Alias, Capabilities\>

> **AddModelAlias**\<`T`, `Alias`, `Capabilities`\> = `SetNewTypeValue`\<`T`, `"Models"`, `T`\[`"Models"`\] & `Record`\<`Alias`, [`ModelProviderForCapabilities`](ModelProviderForCapabilities.md)\<`Capabilities`\>\>\>

Defined in: packages/ai/src/builder/AgentQueueBuilderTypes.ts:78

## Type Parameters

### T

`T` *extends* [`AgentQueueBuilderTypes`](AgentQueueBuilderTypes.md)

### Alias

`Alias` *extends* `string`

### Capabilities

`Capabilities` *extends* readonly [`ModelProviderCapability`](ModelProviderCapability.md)[] = *typeof* [`defaultAgentModelCapabilities`](../variables/defaultAgentModelCapabilities.md)
