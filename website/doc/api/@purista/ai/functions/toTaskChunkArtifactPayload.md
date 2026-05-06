[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / toTaskChunkArtifactPayload

# Function: toTaskChunkArtifactPayload()

> **toTaskChunkArtifactPayload**(`input`): `object`

Defined in: packages/ai/src/protocol/taskArtifacts.ts:217

## Parameters

### input

#### content

[`JsonValue`](../type-aliases/JsonValue.md)

#### kind?

`string`

#### metadata?

`Record`\<`string`, `unknown`\>

#### runId?

`string`

#### sequence?

`number`

#### taskId

`string`

## Returns

`object`

### content

> **content**: `unknown`

### kind

> **kind**: `string`

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

### runId?

> `optional` **runId**: `string`

### sequence?

> `optional` **sequence**: `number`

### taskId

> **taskId**: `string`

### type

> **type**: `"purista-ai-task-chunk"`
