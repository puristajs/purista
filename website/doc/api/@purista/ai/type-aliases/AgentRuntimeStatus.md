[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRuntimeStatus

# Type Alias: AgentRuntimeStatus

> **AgentRuntimeStatus** = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:99](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L99)

## Properties

### activeWorkers

> **activeWorkers**: `number`

Defined in: [packages/ai/src/types/AgentDefinition.ts:106](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L106)

Current number of running agent executions in this process/replica.

***

### agentName

> **agentName**: `string`

Defined in: [packages/ai/src/types/AgentDefinition.ts:100](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L100)

***

### agentVersion

> **agentVersion**: `string`

Defined in: [packages/ai/src/types/AgentDefinition.ts:101](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L101)

***

### concurrencyHints?

> `optional` **concurrencyHints**: `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:109](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L109)

#### effectiveMaxConcurrencyHint?

> `optional` **effectiveMaxConcurrencyHint**: `number`

Optional estimated global concurrency: replicaCountHint * maxConcurrencyPerInstance.

#### replicaCountHint?

> `optional` **replicaCountHint**: `number`

Optional host-provided replica count hint for observability only.

***

### maxConcurrencyPerInstance

> **maxConcurrencyPerInstance**: `number`

Defined in: [packages/ai/src/types/AgentDefinition.ts:104](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L104)

Per-process/per-replica execution cap for this pool.

***

### poolId

> **poolId**: `string`

Defined in: [packages/ai/src/types/AgentDefinition.ts:102](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L102)

***

### waitingWorkers

> **waitingWorkers**: `number`

Defined in: [packages/ai/src/types/AgentDefinition.ts:108](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L108)

Current number of queued executions waiting for a local pool slot.
