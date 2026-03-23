[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRuntimeStatus

# Type Alias: AgentRuntimeStatus

> **AgentRuntimeStatus** = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:100](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L100)

## Properties

### activeWorkers

> **activeWorkers**: `number`

Defined in: [packages/ai/src/types/AgentDefinition.ts:107](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L107)

Current number of running agent executions in this process/replica.

***

### agentName

> **agentName**: `string`

Defined in: [packages/ai/src/types/AgentDefinition.ts:101](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L101)

***

### agentVersion

> **agentVersion**: `string`

Defined in: [packages/ai/src/types/AgentDefinition.ts:102](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L102)

***

### concurrencyHints?

> `optional` **concurrencyHints**: `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:110](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L110)

#### effectiveMaxConcurrencyHint?

> `optional` **effectiveMaxConcurrencyHint**: `number`

Optional estimated global concurrency: replicaCountHint * maxConcurrencyPerInstance.

#### replicaCountHint?

> `optional` **replicaCountHint**: `number`

Optional host-provided replica count hint for observability only.

***

### maxConcurrencyPerInstance

> **maxConcurrencyPerInstance**: `number`

Defined in: [packages/ai/src/types/AgentDefinition.ts:105](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L105)

Per-process/per-replica execution cap for this pool.

***

### poolId

> **poolId**: `string`

Defined in: [packages/ai/src/types/AgentDefinition.ts:103](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L103)

***

### waitingWorkers

> **waitingWorkers**: `number`

Defined in: [packages/ai/src/types/AgentDefinition.ts:109](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L109)

Current number of queued executions waiting for a local pool slot.
