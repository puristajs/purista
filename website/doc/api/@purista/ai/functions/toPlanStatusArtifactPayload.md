[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / toPlanStatusArtifactPayload

# Function: toPlanStatusArtifactPayload()

> **toPlanStatusArtifactPayload**(`state`): `object`

Defined in: packages/ai/src/protocol/taskArtifacts.ts:177

## Parameters

### state

#### agentName

`string` = `...`

#### attempt

`number` = `...`

#### checkpoints

`Record`\<`string`, \{ `completed`: `boolean`; `name`: `string`; `updatedAt`: `string`; `value?`: `unknown`; \}\> = `...`

#### completedAt?

`string` = `...`

#### error?

\{ `code`: `string`; `handled`: `boolean`; `message`: `string`; \} = `...`

#### error.code

`string` = `...`

#### error.handled

`boolean` = `...`

#### error.message

`string` = `...`

#### finalMessage?

`string` = `...`

#### heartbeatAt?

`string` = `...`

#### lock?

\{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \} = `...`

#### lock.acquiredAt

`string` = `...`

#### lock.expiresAt

`string` = `...`

#### lock.heartbeatAt

`string` = `...`

#### lock.key

`string` = `...`

#### lock.lockId

`string` = `...`

#### lock.runId?

`string` = `...`

#### lock.scopeKey

`string` = `...`

#### metadata?

`Record`\<`string`, `unknown`\> = `...`

#### owner?

\{ `attachedAt`: `string`; `leaseId?`: `string`; `queueName?`: `string`; `workerId`: `string`; \} = `...`

#### owner.attachedAt

`string` = `...`

#### owner.leaseId?

`string` = `...`

#### owner.queueName?

`string` = `...`

#### owner.workerId

`string` = `...`

#### phase

`string` = `...`

#### recovery?

\{ `checkpoint?`: `string`; `reason?`: `string`; `resumedAt?`: `string`; `status`: `"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"`; \} = `...`

#### recovery.checkpoint?

`string` = `...`

#### recovery.reason?

`string` = `...`

#### recovery.resumedAt?

`string` = `...`

#### recovery.status

`"retrying"` \| `"fresh"` \| `"resumed"` \| `"recovered-stale"` = `...`

#### retention?

\{ `finalRunRecordTtlMs?`: `number`; `keepFinalRunRecord?`: `boolean`; `transientStateTtlMs?`: `number`; \} = `...`

#### retention.finalRunRecordTtlMs?

`number` = `...`

#### retention.keepFinalRunRecord?

`boolean` = `...`

#### retention.transientStateTtlMs?

`number` = `...`

#### runId

`string` = `...`

#### scope

\{ `agentName`: `string`; `conversationId?`: `string`; `extra`: `Record`\<`string`, `string`\>; `principalId?`: `string`; `serviceVersion`: `string`; `tenantId?`: `string`; \} = `agentRunStateScopeSchema`

#### scope.agentName

`string` = `...`

#### scope.conversationId?

`string` = `...`

#### scope.extra

`Record`\<`string`, `string`\> = `...`

#### scope.principalId?

`string` = `...`

#### scope.serviceVersion

`string` = `...`

#### scope.tenantId?

`string` = `...`

#### serviceVersion

`string` = `...`

#### startedAt

`string` = `...`

#### status

`"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` = `agentRunStatusSchema`

#### summary?

`string` = `...`

#### tasks

`object`[] = `...`

#### title

`string` = `...`

#### updatedAt

`string` = `...`

## Returns

`object`

### activeTaskId?

> `optional` **activeTaskId**: `string`

### finalMessage?

> `optional` **finalMessage**: `string`

### phase

> **phase**: `string`

### runId

> **runId**: `string`

### status

> **status**: `"failed"` \| `"running"` \| `"completed"` \| `"cancelled"` \| `"queued"` \| `"idle"` \| `"planning"` \| `"recovering"` \| `"retrying"` \| `"summarizing"` = `planStatusSchema`

### summary?

> `optional` **summary**: `string`

### title

> **title**: `string`

### type

> **type**: `"purista-ai-plan-status"`
