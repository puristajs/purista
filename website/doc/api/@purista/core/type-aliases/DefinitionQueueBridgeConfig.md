[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefinitionQueueBridgeConfig

# Type Alias: DefinitionQueueBridgeConfig

> **DefinitionQueueBridgeConfig** = `object`

Defined in: [core/types/DefinitionQueueBridgeConfig.ts:8](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/DefinitionQueueBridgeConfig.ts#L8)

Advisory settings for queue bridges. Similar to `DefinitionEventBridgeConfig`,
these values are hints that individual bridge implementations may or may not
be able to honor depending on their provider capabilities.

## Properties

### orderingGuarantee

> **orderingGuarantee**: [`QueueOrderingGuarantee`](QueueOrderingGuarantee.md)

Defined in: [core/types/DefinitionQueueBridgeConfig.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/DefinitionQueueBridgeConfig.ts#L13)

Whether jobs must be processed in strict FIFO order, partitioned order (per key),
or if the provider can deliver them without ordering guarantees.

***

### prefetch

> **prefetch**: `number`

Defined in: [core/types/DefinitionQueueBridgeConfig.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/DefinitionQueueBridgeConfig.ts#L17)

Desired number of jobs a worker should prefetch/lease at once.
