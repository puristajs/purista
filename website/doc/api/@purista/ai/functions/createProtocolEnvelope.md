[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createProtocolEnvelope

# Function: createProtocolEnvelope()

> **createProtocolEnvelope**(`input`): `object`

Defined in: protocol/helpers.ts:29

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

> **frame**: \{ `content`: `string`; `kind`: `"message"`; `role`: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: `string` \| `Record`\<`string`, `unknown`\>; `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"chunk"` \| `"final"`; \} \| \{ `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"invoked"` \| `"succeeded"` \| `"failed"`; `toolName`: `string`; \} \| \{ `durationMs?`: `number`; `kind`: `"telemetry"`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \} = `agentProtocolFrameSchema`

### inReplyTo?

> `optional` **inReplyTo**: `string`

### messageId

> **messageId**: `string`

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

### role?

> `optional` **role**: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`

### tenantId?

> `optional` **tenantId**: `string`

### timestamp

> **timestamp**: `string`

### userId?

> `optional` **userId**: `string`

### version

> **version**: `"purista.ai/1.0"`
