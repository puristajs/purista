[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / toAgent2AgentReferenceMessage

# Function: toAgent2AgentReferenceMessage()

> **toAgent2AgentReferenceMessage**(`envelope`): [`Agent2AgentReferenceMessage`](../type-aliases/Agent2AgentReferenceMessage.md)

Defined in: [packages/ai/src/protocol/interoperability.ts:28](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/protocol/interoperability.ts#L28)

Converts a PURISTA AI protocol envelope into an Agent-to-Agent reference message.
This is a reference adapter and not a claim of full compliance with any external standard.

## Parameters

### envelope

#### actor

\{ `agent?`: `string`; `instanceId?`: `string`; `service`: `string`; `version?`: `string`; \} = `protocolActorSchema`

#### actor.agent?

`string` = `...`

#### actor.instanceId?

`string` = `...`

#### actor.service

`string` = `...`

#### actor.version?

`string` = `...`

#### conversationId

`string` = `...`

#### frame

\{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"tool"` \| `"system"` \| `"developer"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: [`JsonValue`](../type-aliases/JsonValue.md); `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `activeWorkers?`: `number`; `durationMs?`: `number`; `effectiveMaxConcurrencyHint?`: `number`; `kind`: `"telemetry"`; `maxConcurrencyPerInstance?`: `number`; `poolId?`: `string`; `provider?`: `string`; `replicaCountHint?`: `number`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitingWorkers?`: `number`; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \} = `agentProtocolFrameSchema`

#### inReplyTo?

`string` = `...`

#### messageId

`string` = `...`

#### metadata?

`Record`\<`string`, `unknown`\> = `...`

#### role?

`"user"` \| `"assistant"` \| `"tool"` \| `"system"` \| `"developer"` = `...`

#### tenantId?

`string` = `...`

#### timestamp

`string` = `...`

#### userId?

`string` = `...`

#### version

`"purista.ai/1.0"` = `...`

## Returns

[`Agent2AgentReferenceMessage`](../type-aliases/Agent2AgentReferenceMessage.md)
