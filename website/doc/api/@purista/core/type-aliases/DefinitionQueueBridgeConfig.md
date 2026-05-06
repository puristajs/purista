[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefinitionQueueBridgeConfig

# Type Alias: DefinitionQueueBridgeConfig

> **DefinitionQueueBridgeConfig** = `object`

Defined in: [core/types/DefinitionQueueBridgeConfig.ts:8](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/DefinitionQueueBridgeConfig.ts#L8)

Queue bridge delivery requirements requested by the service definition.
In strict mode, startup validation rejects queues when a bridge cannot
satisfy these settings with its declared capabilities.

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
