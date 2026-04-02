[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRunHandle

# Type Alias: AgentRunHandle

> **AgentRunHandle** = `object`

Defined in: [packages/ai/src/runtime/runState.ts:230](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L230)

## Properties

### state

> `readonly` **state**: [`AgentRunState`](AgentRunState.md)

Defined in: [packages/ai/src/runtime/runState.ts:231](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L231)

## Methods

### checkpoint()

> **checkpoint**\<`T`\>(`name`, `value?`, `options?`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:242](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L242)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### name

`string`

##### value?

`T`

##### options?

###### completed?

`boolean`

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### completeTask()

> **completeTask**(`taskId`, `detail?`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:240](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L240)

#### Parameters

##### taskId

`string`

##### detail?

`string`

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### emit()

> **emit**(): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:232](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L232)

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### failTask()

> **failTask**(`taskId`, `detail?`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:241](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L241)

#### Parameters

##### taskId

`string`

##### detail?

`string`

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### finish()

> **finish**(`input`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:246](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L246)

#### Parameters

##### input

###### error?

[`AgentRunError`](AgentRunError.md)

###### finalMessage?

`string`

###### status

`Extract`\<[`AgentRunStatus`](AgentRunStatus.md), `"completed"` \| `"failed"` \| `"cancelled"`\>

###### summary?

`string`

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### finishFailure()

> **finishFailure**(`summary?`, `error?`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:253](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L253)

#### Parameters

##### summary?

`string`

##### error?

###### code

`string` = `...`

###### handled

`boolean` = `...`

###### message

`string` = `...`

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### finishSuccess()

> **finishSuccess**(`summary?`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:252](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L252)

#### Parameters

##### summary?

`string`

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### getCheckpoint()

> **getCheckpoint**\<`T`\>(`name`): `Promise`\<`T` \| `undefined`\>

Defined in: [packages/ai/src/runtime/runState.ts:243](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L243)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`T` \| `undefined`\>

***

### phase()

> **phase**(`phase`, `status?`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:234](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L234)

#### Parameters

##### phase

`string`

##### status?

`"completed"` | `"queued"` | `"running"` | `"failed"` | `"idle"` | `"planning"` | `"recovering"` | `"retrying"` | `"summarizing"` | `"cancelled"`

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### plan()

> **plan**(`tasks`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:238](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L238)

#### Parameters

##### tasks

[`AgentRunTaskInput`](AgentRunTaskInput.md)[]

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### release()

> **release**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/runState.ts:254](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L254)

#### Returns

`Promise`\<`void`\>

***

### replaceTasks()

> **replaceTasks**(`tasks`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:237](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L237)

#### Parameters

##### tasks

[`AgentRunTaskInput`](AgentRunTaskInput.md)[]

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### setFinalMessage()

> **setFinalMessage**(`message`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:236](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L236)

#### Parameters

##### message

`string`

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### startTask()

> **startTask**(`taskId`, `detail?`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:239](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L239)

#### Parameters

##### taskId

`string`

##### detail?

`string`

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### step()

> **step**\<`T`\>(`id`, `fn`, `options?`): `Promise`\<`T`\>

Defined in: [packages/ai/src/runtime/runState.ts:244](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L244)

#### Type Parameters

##### T

`T`

#### Parameters

##### id

`string`

##### fn

() => `Promise`\<`T`\>

##### options?

###### checkpoint?

`string`

###### detail?

`string`

#### Returns

`Promise`\<`T`\>

***

### summary()

> **summary**(`summary`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:235](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L235)

#### Parameters

##### summary

`string`

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### task()

> **task**\<`T`\>(`taskId`, `fn`, `detail?`): `Promise`\<`T`\>

Defined in: [packages/ai/src/runtime/runState.ts:245](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L245)

#### Type Parameters

##### T

`T`

#### Parameters

##### taskId

`string`

##### fn

() => `Promise`\<`T`\>

##### detail?

`string`

#### Returns

`Promise`\<`T`\>

***

### update()

> **update**(`patch`): `Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:233](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L233)

#### Parameters

##### patch

[`AgentRunUpdateInput`](AgentRunUpdateInput.md)

#### Returns

`Promise`\<\{ `agentName`: `string`; `agentVersion`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `agentVersion`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `tenantId?`: `string`; \}; `startedAt`: `string`; `status`: `"completed"` \| `"queued"` \| `"running"` \| `"failed"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` \| `"cancelled"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>
