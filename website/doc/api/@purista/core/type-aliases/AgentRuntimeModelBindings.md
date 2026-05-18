[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / AgentRuntimeModelBindings

# Type Alias: AgentRuntimeModelBindings\<Models\>

> **AgentRuntimeModelBindings**\<`Models`\> = `{ [K in keyof Models]: AgentRuntimeModelBinding<Models[K]> }`

Defined in: [AgentQueueBuilder/types.ts:58](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L58)

## Type Parameters

### Models

`Models` *extends* `Record`\<`string`, [`AgentModelBinding`](AgentModelBinding.md)\>
