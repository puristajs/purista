[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRuntimeStatus

# Type Alias: AgentRuntimeStatus

> **AgentRuntimeStatus** = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:155](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/types/AgentDefinition.ts#L155)

## Properties

### activeWorkers

> **activeWorkers**: `number`

Defined in: [packages/ai/src/types/AgentDefinition.ts:162](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/types/AgentDefinition.ts#L162)

Current number of running agent executions in this process/replica.

***

### agentName

> **agentName**: `string`

Defined in: [packages/ai/src/types/AgentDefinition.ts:156](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/types/AgentDefinition.ts#L156)

***

### agentVersion

> **agentVersion**: `string`

Defined in: [packages/ai/src/types/AgentDefinition.ts:157](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/types/AgentDefinition.ts#L157)

***

### concurrencyHints?

> `optional` **concurrencyHints**: `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:165](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/types/AgentDefinition.ts#L165)

#### effectiveMaxConcurrencyHint?

> `optional` **effectiveMaxConcurrencyHint**: `number`

Optional estimated global concurrency: replicaCountHint * maxConcurrencyPerInstance.

#### replicaCountHint?

> `optional` **replicaCountHint**: `number`

Optional host-provided replica count hint for observability only.

***

### maxConcurrencyPerInstance

> **maxConcurrencyPerInstance**: `number`

Defined in: [packages/ai/src/types/AgentDefinition.ts:160](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/types/AgentDefinition.ts#L160)

Per-process/per-replica execution cap for this pool.

***

### poolId

> **poolId**: `string`

Defined in: [packages/ai/src/types/AgentDefinition.ts:158](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/types/AgentDefinition.ts#L158)

***

### waitingWorkers

> **waitingWorkers**: `number`

Defined in: [packages/ai/src/types/AgentDefinition.ts:164](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/types/AgentDefinition.ts#L164)

Current number of queued executions waiting for a local pool slot.
