[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / AgentRuntimeModelBinding

# Type Alias: AgentRuntimeModelBinding\<Binding\>

> **AgentRuntimeModelBinding**\<`Binding`\> = `object` & `Partial`\<`Pick`\<`Binding`, `"model"`\>\>

Defined in: [AgentQueueBuilder/types.ts:50](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L50)

## Type Declaration

### capabilities?

> `optional` **capabilities?**: readonly [`AgentModelCapability`](AgentModelCapability.md)[]

### defaults?

> `optional` **defaults?**: `ModelDefaults`

### model?

> `optional` **model?**: `string`

### provider

> **provider**: `ModelProvider`

### providerOptions?

> `optional` **providerOptions?**: `Record`\<`string`, `unknown`\>

## Type Parameters

### Binding

`Binding` *extends* [`AgentModelBinding`](AgentModelBinding.md) = [`AgentModelBinding`](AgentModelBinding.md)
