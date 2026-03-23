[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRuntimeStatus

# Type Alias: AgentRuntimeStatus

> **AgentRuntimeStatus** = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:133](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L133)

## Properties

### activeWorkers

> **activeWorkers**: `number`

Defined in: [packages/ai/src/types/AgentDefinition.ts:140](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L140)

Current number of running agent executions in this process/replica.

***

### agentName

> **agentName**: `string`

Defined in: [packages/ai/src/types/AgentDefinition.ts:134](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L134)

***

### agentVersion

> **agentVersion**: `string`

Defined in: [packages/ai/src/types/AgentDefinition.ts:135](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L135)

***

### concurrencyHints?

> `optional` **concurrencyHints**: `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:143](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L143)

#### effectiveMaxConcurrencyHint?

> `optional` **effectiveMaxConcurrencyHint**: `number`

Optional estimated global concurrency: replicaCountHint * maxConcurrencyPerInstance.

#### replicaCountHint?

> `optional` **replicaCountHint**: `number`

Optional host-provided replica count hint for observability only.

***

### maxConcurrencyPerInstance

> **maxConcurrencyPerInstance**: `number`

Defined in: [packages/ai/src/types/AgentDefinition.ts:138](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L138)

Per-process/per-replica execution cap for this pool.

***

### poolId

> **poolId**: `string`

Defined in: [packages/ai/src/types/AgentDefinition.ts:136](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L136)

***

### waitingWorkers

> **waitingWorkers**: `number`

Defined in: [packages/ai/src/types/AgentDefinition.ts:142](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L142)

Current number of queued executions waiting for a local pool slot.
