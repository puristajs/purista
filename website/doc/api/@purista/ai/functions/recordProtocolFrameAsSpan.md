[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / recordProtocolFrameAsSpan

# Function: recordProtocolFrameAsSpan()

> **recordProtocolFrameAsSpan**(`context`, `name`, `frame`, `fn`): `Promise`\<\{ `actor`: \{ `agent?`: `string`; `instanceId?`: `string`; `service`: `string`; `version?`: `string`; \}; `conversationId`: `string`; `frame`: \{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: `string` \| `Record`\<`string`, `unknown`\>; `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `durationMs?`: `number`; `kind`: `"telemetry"`; `poolId?`: `string`; `provider?`: `string`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \}; `inReplyTo?`: `string`; `messageId`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `role?`: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`; `tenantId?`: `string`; `timestamp`: `string`; `userId?`: `string`; `version`: `"purista.ai/1.0"`; \}\>

Defined in: [ai/src/protocol/purista.ts:78](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/protocol/purista.ts#L78)

## Parameters

### context

[`ContextBase`](../../core/type-aliases/ContextBase.md)

### name

`string`

### frame

\{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`; `summary?`: `string`; \} | \{ `artifactId`: `string`; `content`: `string` \| `Record`\<`string`, `unknown`\>; `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} | \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} | \{ `durationMs?`: `number`; `kind`: `"telemetry"`; `poolId?`: `string`; `provider?`: `string`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitTimeMs?`: `number`; \} | \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \}

### fn

() => `Promise`\<\{ `actor`: \{ `agent?`: `string`; `instanceId?`: `string`; `service`: `string`; `version?`: `string`; \}; `conversationId`: `string`; `frame`: \{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: `string` \| `Record`\<`string`, `unknown`\>; `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `durationMs?`: `number`; `kind`: `"telemetry"`; `poolId?`: `string`; `provider?`: `string`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \}; `inReplyTo?`: `string`; `messageId`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `role?`: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`; `tenantId?`: `string`; `timestamp`: `string`; `userId?`: `string`; `version`: `"purista.ai/1.0"`; \}\>

## Returns

`Promise`\<\{ `actor`: \{ `agent?`: `string`; `instanceId?`: `string`; `service`: `string`; `version?`: `string`; \}; `conversationId`: `string`; `frame`: \{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: `string` \| `Record`\<`string`, `unknown`\>; `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `durationMs?`: `number`; `kind`: `"telemetry"`; `poolId?`: `string`; `provider?`: `string`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \}; `inReplyTo?`: `string`; `messageId`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `role?`: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`; `tenantId?`: `string`; `timestamp`: `string`; `userId?`: `string`; `version`: `"purista.ai/1.0"`; \}\>
