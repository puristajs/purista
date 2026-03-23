[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRuntimeStatus

# Type Alias: AgentRuntimeStatus

> **AgentRuntimeStatus** = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:137](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L137)

## Properties

### activeWorkers

> **activeWorkers**: `number`

Defined in: [packages/ai/src/types/AgentDefinition.ts:144](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L144)

Current number of running agent executions in this process/replica.

***

### agentName

> **agentName**: `string`

Defined in: [packages/ai/src/types/AgentDefinition.ts:138](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L138)

***

### agentVersion

> **agentVersion**: `string`

Defined in: [packages/ai/src/types/AgentDefinition.ts:139](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L139)

***

### concurrencyHints?

> `optional` **concurrencyHints**: `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:147](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L147)

#### effectiveMaxConcurrencyHint?

> `optional` **effectiveMaxConcurrencyHint**: `number`

Optional estimated global concurrency: replicaCountHint * maxConcurrencyPerInstance.

#### replicaCountHint?

> `optional` **replicaCountHint**: `number`

Optional host-provided replica count hint for observability only.

***

### maxConcurrencyPerInstance

> **maxConcurrencyPerInstance**: `number`

Defined in: [packages/ai/src/types/AgentDefinition.ts:142](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L142)

Per-process/per-replica execution cap for this pool.

***

### poolId

> **poolId**: `string`

Defined in: [packages/ai/src/types/AgentDefinition.ts:140](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L140)

***

### waitingWorkers

> **waitingWorkers**: `number`

Defined in: [packages/ai/src/types/AgentDefinition.ts:146](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L146)

Current number of queued executions waiting for a local pool slot.
