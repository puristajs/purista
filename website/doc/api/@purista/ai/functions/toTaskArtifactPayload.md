[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / toTaskArtifactPayload

# Function: toTaskArtifactPayload()

> **toTaskArtifactPayload**(`state`, `task`, `options?`): `object`

Defined in: packages/ai/src/protocol/taskArtifacts.ts:188

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

### task

#### approval?

\{ `checkpoint`: `string`; `onExpiry?`: `"fail"` \| `"return-expired"`; `required`: `boolean`; `timeoutMs?`: `number`; \} = `agentRunTaskApprovalSchema`

#### approval.checkpoint

`string` = `...`

#### approval.onExpiry?

`"fail"` \| `"return-expired"` = `...`

#### approval.required

`boolean` = `...`

#### approval.timeoutMs?

`number` = `...`

#### completedAt?

`string` = `...`

#### delegate?

`string` = `...`

#### dependsOn?

`string`[] = `...`

#### detail?

`string` = `...`

#### executor?

\{ `handler`: `string`; `type`: `"local"`; \} \| \{ `commandName`: `string`; `serviceName`: `string`; `serviceVersion`: `string`; `type`: `"tool"`; \} \| \{ `agentName`: `string`; `forwardToCurrentStream?`: `boolean` \| \{ `artifacts?`: `boolean` \| \{ `files?`: `boolean`; `generic?`: `boolean`; `output?`: `boolean`; `sources?`: `boolean`; `workflow?`: `boolean`; \}; `assistant?`: `boolean`; `errors?`: `boolean`; `reasoning?`: `boolean`; `toolEvents?`: `boolean`; \}; `serviceVersion`: `string`; `type`: `"agent"`; \} \| \{ `checkpoint`: `string`; `type`: `"approval"`; \} = `...`

#### handoff?

\{ `description?`: `string`; `targetName`: `string`; `targetType?`: `"tool"` \| `"agent"`; `targetVersion?`: `string`; \} = `agentRunTaskHandoffSchema`

#### handoff.description?

`string` = `...`

#### handoff.targetName

`string` = `...`

#### handoff.targetType?

`"tool"` \| `"agent"` = `...`

#### handoff.targetVersion?

`string` = `...`

#### id

`string` = `...`

#### input?

`unknown` = `...`

#### instruction?

`string` = `...`

#### kind?

`"tool"` \| `"agent"` \| `"custom"` \| `"model"` \| `"reasoning"` \| `"checkpoint"` \| `"approval"` = `...`

#### order

`number` = `...`

#### output?

`unknown` = `...`

#### retryPolicy?

\{ `backoffMs?`: `number`; `maxAttempts?`: `number`; \} = `agentRunTaskRetryPolicySchema`

#### retryPolicy.backoffMs?

`number` = `...`

#### retryPolicy.maxAttempts?

`number` = `...`

#### startedAt?

`string` = `...`

#### status

`"failed"` \| `"pending"` \| `"running"` \| `"blocked"` \| `"waiting-approval"` \| `"completed"` \| `"cancelled"` = `agentRunTaskStatusSchema`

#### summary?

`string` = `...`

#### timeoutMs?

`number` = `...`

#### title

`string` = `...`

#### updatedAt?

`string` = `...`

### options?

#### summary?

`string`

## Returns

`object`

### approval?

> `optional` **approval**: `unknown`

### completedAt?

> `optional` **completedAt**: `string`

### delegate?

> `optional` **delegate**: `string`

### dependsOn?

> `optional` **dependsOn**: `string`[]

### detail?

> `optional` **detail**: `string`

### executor?

> `optional` **executor**: `unknown`

### handoff?

> `optional` **handoff**: `unknown`

### input?

> `optional` **input**: `unknown`

### instruction?

> `optional` **instruction**: `string`

### kind?

> `optional` **kind**: `"tool"` \| `"agent"` \| `"custom"` \| `"model"` \| `"reasoning"` \| `"checkpoint"` \| `"approval"`

### order

> **order**: `number`

### output?

> `optional` **output**: `unknown`

### retryPolicy?

> `optional` **retryPolicy**: `unknown`

### runId

> **runId**: `string`

### startedAt?

> `optional` **startedAt**: `string`

### status

> **status**: `"failed"` \| `"pending"` \| `"running"` \| `"blocked"` \| `"waiting-approval"` \| `"completed"` \| `"cancelled"` = `taskStatusSchema`

### summary?

> `optional` **summary**: `string`

### taskId

> **taskId**: `string`

### timeoutMs?

> `optional` **timeoutMs**: `number`

### title

> **title**: `string`

### type

> **type**: `"purista-ai-task"`

### updatedAt?

> `optional` **updatedAt**: `string`
