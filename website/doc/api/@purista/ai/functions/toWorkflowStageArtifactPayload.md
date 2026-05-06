[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / toWorkflowStageArtifactPayload

# Function: toWorkflowStageArtifactPayload()

> **toWorkflowStageArtifactPayload**(`input`): `object`

Defined in: packages/ai/src/protocol/taskArtifacts.ts:234

## Parameters

### input

#### finalMessage?

`string`

#### name

`string`

#### runId?

`string`

#### status

`"failed"` \| `"running"` \| `"completed"`

#### summary?

`string`

#### updatedAt?

`string`

## Returns

`object`

### finalMessage?

> `optional` **finalMessage**: `string`

### name

> **name**: `string`

### runId?

> `optional` **runId**: `string`

### status

> **status**: `"failed"` \| `"running"` \| `"completed"` = `workflowStageStatusSchema`

### summary?

> `optional` **summary**: `string`

### type

> **type**: `"purista-ai-workflow-stage"`

### updatedAt?

> `optional` **updatedAt**: `string`
