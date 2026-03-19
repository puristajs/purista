[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRuntimeStatus

# Type Alias: AgentRuntimeStatus

> **AgentRuntimeStatus** = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:112](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L112)

## Properties

### activeWorkers

> **activeWorkers**: `number`

Defined in: [packages/ai/src/types/AgentDefinition.ts:119](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L119)

Current number of running agent executions in this process/replica.

***

### agentName

> **agentName**: `string`

Defined in: [packages/ai/src/types/AgentDefinition.ts:113](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L113)

***

### agentVersion

> **agentVersion**: `string`

Defined in: [packages/ai/src/types/AgentDefinition.ts:114](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L114)

***

### concurrencyHints?

> `optional` **concurrencyHints**: `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:122](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L122)

#### effectiveMaxConcurrencyHint?

> `optional` **effectiveMaxConcurrencyHint**: `number`

Optional estimated global concurrency: replicaCountHint * maxConcurrencyPerInstance.

#### replicaCountHint?

> `optional` **replicaCountHint**: `number`

Optional host-provided replica count hint for observability only.

***

### maxConcurrencyPerInstance

> **maxConcurrencyPerInstance**: `number`

Defined in: [packages/ai/src/types/AgentDefinition.ts:117](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L117)

Per-process/per-replica execution cap for this pool.

***

### poolId

> **poolId**: `string`

Defined in: [packages/ai/src/types/AgentDefinition.ts:115](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L115)

***

### waitingWorkers

> **waitingWorkers**: `number`

Defined in: [packages/ai/src/types/AgentDefinition.ts:121](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L121)

Current number of queued executions waiting for a local pool slot.
