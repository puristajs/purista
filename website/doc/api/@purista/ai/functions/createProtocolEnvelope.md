[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createProtocolEnvelope

# Function: createProtocolEnvelope()

> **createProtocolEnvelope**(`input`): `object`

Defined in: [packages/ai/src/protocol/helpers.ts:29](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/protocol/helpers.ts#L29)

Creates a protocol-compliant envelope. Input is validated via zod, so invalid metadata throws with helpful errors.

## Parameters

### input

[`CreateEnvelopeInput`](../type-aliases/CreateEnvelopeInput.md)

## Returns

`object`

### actor

> **actor**: `object` = `protocolActorSchema`

#### actor.agent?

> `optional` **agent**: `string`

#### actor.instanceId?

> `optional` **instanceId**: `string`

#### actor.service

> **service**: `string`

#### actor.version?

> `optional` **version**: `string`

### conversationId

> **conversationId**: `string`

### frame

> **frame**: \{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"system"` \| `"developer"` \| `"tool"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: `string` \| `Record`\<`string`, `unknown`\>; `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `activeWorkers?`: `number`; `durationMs?`: `number`; `effectiveMaxConcurrencyHint?`: `number`; `kind`: `"telemetry"`; `maxConcurrencyPerInstance?`: `number`; `poolId?`: `string`; `provider?`: `string`; `replicaCountHint?`: `number`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitingWorkers?`: `number`; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \} = `agentProtocolFrameSchema`

### inReplyTo?

> `optional` **inReplyTo**: `string`

### messageId

> **messageId**: `string`

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

### role?

> `optional` **role**: `"user"` \| `"assistant"` \| `"system"` \| `"developer"` \| `"tool"`

### tenantId?

> `optional` **tenantId**: `string`

### timestamp

> **timestamp**: `string`

### userId?

> `optional` **userId**: `string`

### version

> **version**: `"purista.ai/1.0"`
