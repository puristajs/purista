[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ServiceHealthState

# Type Alias: ServiceHealthState

> **ServiceHealthState** = `object`

Defined in: [core/types/ServiceHealthState.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceHealthState.ts#L15)

## Properties

### eventBridgeHealthy

> **eventBridgeHealthy**: `boolean`

Defined in: [core/types/ServiceHealthState.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceHealthState.ts#L17)

***

### pausedQueueWorkers

> **pausedQueueWorkers**: [`QueueWorkerPauseHealthState`](QueueWorkerPauseHealthState.md)[]

Defined in: [core/types/ServiceHealthState.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceHealthState.ts#L20)

***

### pausedSubscriptionConsumers

> **pausedSubscriptionConsumers**: [`PausedSubscriptionConsumerHealthState`](PausedSubscriptionConsumerHealthState.md)[]

Defined in: [core/types/ServiceHealthState.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceHealthState.ts#L21)

***

### queueBridgeHealthy

> **queueBridgeHealthy**: `boolean`

Defined in: [core/types/ServiceHealthState.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceHealthState.ts#L18)

***

### queues

> **queues**: [`QueueHealthState`](QueueHealthState.md)[]

Defined in: [core/types/ServiceHealthState.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceHealthState.ts#L19)

***

### status

> **status**: [`ServiceHealthStatus`](ServiceHealthStatus.md)

Defined in: [core/types/ServiceHealthState.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceHealthState.ts#L16)
