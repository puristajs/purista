[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRunStateHelpers

# Type Alias: AgentRunStateHelpers

> **AgentRunStateHelpers** = `object`

Defined in: [packages/ai/src/runtime/runState.ts:257](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/runState.ts#L257)

## Methods

### checkpoint()

> **checkpoint**\<`T`\>(`name`, `value?`, `input?`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:265](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/runState.ts#L265)

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

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### completeTask()

> **completeTask**(`taskId`, `input?`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:263](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/runState.ts#L263)

#### Parameters

##### taskId

`string`

##### input?

[`AgentRunGetInput`](AgentRunGetInput.md) & `object`

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### emit()

> **emit**(`input?`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \} \| `undefined`\>

Defined in: [packages/ai/src/runtime/runState.ts:279](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/runState.ts#L279)

#### Parameters

##### input?

[`AgentRunGetInput`](AgentRunGetInput.md)

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \} \| `undefined`\>

***

### failTask()

> **failTask**(`taskId`, `input?`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:264](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/runState.ts#L264)

#### Parameters

##### taskId

`string`

##### input?

[`AgentRunGetInput`](AgentRunGetInput.md) & `object`

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### finish()

> **finish**(`input`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:271](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/runState.ts#L271)

#### Parameters

##### input

[`AgentRunGetInput`](AgentRunGetInput.md) & `object`

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### get()

> **get**(`input?`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \} \| `undefined`\>

Defined in: [packages/ai/src/runtime/runState.ts:259](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/runState.ts#L259)

#### Parameters

##### input?

[`AgentRunGetInput`](AgentRunGetInput.md)

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \} \| `undefined`\>

***

### getCheckpoint()

> **getCheckpoint**\<`T`\>(`name`, `input?`): `Promise`\<`T` \| `undefined`\>

Defined in: [packages/ai/src/runtime/runState.ts:270](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/runState.ts#L270)

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

Defined in: [packages/ai/src/runtime/runState.ts:280](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/runState.ts#L280)

#### Parameters

##### input?

[`AgentRunLockInput`](AgentRunLockInput.md)

#### Returns

`Promise`\<[`AgentRunLockHandle`](AgentRunLockHandle.md)\>

***

### replaceTasks()

> **replaceTasks**(`tasks`, `input?`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:261](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/runState.ts#L261)

#### Parameters

##### tasks

[`AgentRunTaskInput`](AgentRunTaskInput.md)[]

##### input?

[`AgentRunGetInput`](AgentRunGetInput.md)

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### start()

> **start**(`input`): `Promise`\<[`AgentRunHandle`](AgentRunHandle.md)\>

Defined in: [packages/ai/src/runtime/runState.ts:258](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/runState.ts#L258)

#### Parameters

##### input

[`AgentRunStartInput`](AgentRunStartInput.md)

#### Returns

`Promise`\<[`AgentRunHandle`](AgentRunHandle.md)\>

***

### startTask()

> **startTask**(`taskId`, `input?`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:262](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/runState.ts#L262)

#### Parameters

##### taskId

`string`

##### input?

[`AgentRunGetInput`](AgentRunGetInput.md) & `object`

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### update()

> **update**(`input`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:260](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/runState.ts#L260)

#### Parameters

##### input

[`AgentRunUpdateInput`](AgentRunUpdateInput.md) & [`AgentRunGetInput`](AgentRunGetInput.md)

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>
