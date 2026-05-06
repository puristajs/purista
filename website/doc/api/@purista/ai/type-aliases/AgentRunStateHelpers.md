[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRunStateHelpers

# Type Alias: AgentRunStateHelpers

> **AgentRunStateHelpers** = `object`

Defined in: [packages/ai/src/runtime/runState.ts:400](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L400)

## Methods

### checkpoint()

> **checkpoint**\<`T`\>(`name`, `value?`, `input?`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:413](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L413)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### name

`string`

##### value?

`T`

##### input?

[`AgentRunGetInput`](AgentRunGetInput.md) & `object`

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### completeTask()

> **completeTask**(`taskId`, `input?`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:411](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L411)

#### Parameters

##### taskId

`string`

##### input?

[`AgentRunGetInput`](AgentRunGetInput.md) & `object`

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### emit()

> **emit**(`input?`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \} \| `undefined`\>

Defined in: [packages/ai/src/runtime/runState.ts:427](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L427)

#### Parameters

##### input?

[`AgentRunGetInput`](AgentRunGetInput.md)

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \} \| `undefined`\>

***

### failTask()

> **failTask**(`taskId`, `input?`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:412](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L412)

#### Parameters

##### taskId

`string`

##### input?

[`AgentRunGetInput`](AgentRunGetInput.md) & `object`

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### finish()

> **finish**(`input`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:419](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L419)

#### Parameters

##### input

[`AgentRunGetInput`](AgentRunGetInput.md) & `object`

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### get()

> **get**(`input?`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \} \| `undefined`\>

Defined in: [packages/ai/src/runtime/runState.ts:402](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L402)

#### Parameters

##### input?

[`AgentRunGetInput`](AgentRunGetInput.md)

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \} \| `undefined`\>

***

### getCheckpoint()

> **getCheckpoint**\<`T`\>(`name`, `input?`): `Promise`\<`T` \| `undefined`\>

Defined in: [packages/ai/src/runtime/runState.ts:418](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L418)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### name

`string`

##### input?

[`AgentRunGetInput`](AgentRunGetInput.md)

#### Returns

`Promise`\<`T` \| `undefined`\>

***

### lock()

> **lock**(`input?`): `Promise`\<[`AgentRunLockHandle`](AgentRunLockHandle.md)\>

Defined in: [packages/ai/src/runtime/runState.ts:428](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L428)

#### Parameters

##### input?

[`AgentRunLockInput`](AgentRunLockInput.md)

#### Returns

`Promise`\<[`AgentRunLockHandle`](AgentRunLockHandle.md)\>

***

### replaceTasks()

> **replaceTasks**(`tasks`, `input?`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:409](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L409)

#### Parameters

##### tasks

[`AgentRunTaskInput`](AgentRunTaskInput.md)[]

##### input?

[`AgentRunGetInput`](AgentRunGetInput.md)

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### start()

> **start**(`input`): `Promise`\<[`AgentRunHandle`](AgentRunHandle.md)\>

Defined in: [packages/ai/src/runtime/runState.ts:401](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L401)

#### Parameters

##### input

[`AgentRunStartInput`](AgentRunStartInput.md)

#### Returns

`Promise`\<[`AgentRunHandle`](AgentRunHandle.md)\>

***

### startTask()

> **startTask**(`taskId`, `input?`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:410](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L410)

#### Parameters

##### taskId

`string`

##### input?

[`AgentRunGetInput`](AgentRunGetInput.md) & `object`

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### update()

> **update**(`input`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:403](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L403)

#### Parameters

##### input

[`AgentRunUpdateInput`](AgentRunUpdateInput.md) & [`AgentRunGetInput`](AgentRunGetInput.md)

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### updateTask()

> **updateTask**(`taskId`, `patch`, `input?`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:404](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L404)

#### Parameters

##### taskId

`string`

##### patch

`Partial`\<`Omit`\<[`AgentRunTask`](AgentRunTask.md), `"id"` \| `"order"` \| `"title"`\>\>

##### input?

[`AgentRunGetInput`](AgentRunGetInput.md)

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>
