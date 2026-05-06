[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRunHandle

# Type Alias: AgentRunHandle

> **AgentRunHandle** = `object`

Defined in: [packages/ai/src/runtime/runState.ts:372](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L372)

## Properties

### state

> `readonly` **state**: [`AgentRunState`](AgentRunState.md)

Defined in: [packages/ai/src/runtime/runState.ts:373](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L373)

## Methods

### checkpoint()

> **checkpoint**\<`T`\>(`name`, `value?`, `options?`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:385](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L385)

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

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### completeTask()

> **completeTask**(`taskId`, `detail?`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:383](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L383)

#### Parameters

##### taskId

`string`

##### detail?

`string`

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### emit()

> **emit**(): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:374](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L374)

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### failTask()

> **failTask**(`taskId`, `detail?`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:384](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L384)

#### Parameters

##### taskId

`string`

##### detail?

`string`

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### finish()

> **finish**(`input`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:389](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L389)

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

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### finishFailure()

> **finishFailure**(`summary?`, `error?`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:396](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L396)

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

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### finishSuccess()

> **finishSuccess**(`summary?`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:395](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L395)

#### Parameters

##### summary?

`string`

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### getCheckpoint()

> **getCheckpoint**\<`T`\>(`name`): `Promise`\<`T` \| `undefined`\>

Defined in: [packages/ai/src/runtime/runState.ts:386](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L386)

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

> **phase**(`phase`, `status?`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:376](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L376)

#### Parameters

##### phase

`string`

##### status?

`"failed"` | `"running"` | `"completed"` | `"cancelled"` | `"queued"` | `"idle"` | `"planning"` | `"recovering"` | `"retrying"` | `"summarizing"`

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### plan()

> **plan**(`tasks`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:381](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L381)

#### Parameters

##### tasks

[`AgentRunTaskInput`](AgentRunTaskInput.md)[]

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### release()

> **release**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/runState.ts:397](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L397)

#### Returns

`Promise`\<`void`\>

***

### replaceTasks()

> **replaceTasks**(`tasks`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:380](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L380)

#### Parameters

##### tasks

[`AgentRunTaskInput`](AgentRunTaskInput.md)[]

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### setFinalMessage()

> **setFinalMessage**(`message`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:378](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L378)

#### Parameters

##### message

`string`

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### startTask()

> **startTask**(`taskId`, `detail?`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:382](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L382)

#### Parameters

##### taskId

`string`

##### detail?

`string`

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### step()

> **step**\<`T`\>(`id`, `fn`, `options?`): `Promise`\<`T`\>

Defined in: [packages/ai/src/runtime/runState.ts:387](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L387)

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

> **summary**(`summary`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:377](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L377)

#### Parameters

##### summary

`string`

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### task()

> **task**\<`T`\>(`taskId`, `fn`, `detail?`): `Promise`\<`T`\>

Defined in: [packages/ai/src/runtime/runState.ts:388](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L388)

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

> **update**(`patch`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:375](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L375)

#### Parameters

##### patch

[`AgentRunUpdateInput`](AgentRunUpdateInput.md)

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

***

### updateTask()

> **updateTask**(`taskId`, `patch`): `Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:379](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L379)

#### Parameters

##### taskId

`string`

##### patch

`Partial`\<`Omit`\<[`AgentRunTask`](AgentRunTask.md), `"id"` \| `"order"` \| `"title"`\>\>

#### Returns

`Promise`\<\{ `agentName`: `string`; `attempt`: `number`; `checkpoints`: `Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\>; `completedAt?`: `string`; `error?`: \{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \}; `finalMessage?`: `string`; `heartbeatAt?`: `string`; `lock?`: \{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}; `metadata?`: `Record`\<`string`, `unknown`\>; `owner?`: \{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \}; `phase`: `string`; `recovery?`: \{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \}; `retention?`: \{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \}; `runId`: `string`; `scope`: \{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \}; `serviceVersion`: `string`; `startedAt`: `string`; `status`: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"`; `summary?`: `string`; `tasks`: `object`[]; `title`: `string`; `updatedAt`: `string`; \}\>
