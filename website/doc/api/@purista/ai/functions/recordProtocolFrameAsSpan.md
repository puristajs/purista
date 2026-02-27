[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / recordProtocolFrameAsSpan

# Function: recordProtocolFrameAsSpan()

> **recordProtocolFrameAsSpan**(`context`, `name`, `frame`, `fn`): `Promise`\<\{ `actor`: \{ `agent?`: `string`; `instanceId?`: `string`; `service`: `string`; `version?`: `string`; \}; `conversationId`: `string`; `frame`: \{ `content`: `string`; `kind`: `"message"`; `role`: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: `string` \| `Record`\<`string`, `unknown`\>; `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"chunk"` \| `"final"`; \} \| \{ `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"invoked"` \| `"succeeded"` \| `"failed"`; `toolName`: `string`; \} \| \{ `durationMs?`: `number`; `kind`: `"telemetry"`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \}; `inReplyTo?`: `string`; `messageId`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `role?`: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`; `tenantId?`: `string`; `timestamp`: `string`; `userId?`: `string`; `version`: `"purista.ai/1.0"`; \}\>

Defined in: protocol/purista.ts:78

## Parameters

### context

[`ContextBase`](../../core/type-aliases/ContextBase.md)

### name

`string`

### frame

\{ `content`: `string`; `kind`: `"message"`; `role`: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`; `summary?`: `string`; \} | \{ `artifactId`: `string`; `content`: `string` \| `Record`\<`string`, `unknown`\>; `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"chunk"` \| `"final"`; \} | \{ `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"invoked"` \| `"succeeded"` \| `"failed"`; `toolName`: `string`; \} | \{ `durationMs?`: `number`; `kind`: `"telemetry"`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; \} | \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \}

### fn

() => `Promise`\<\{ `actor`: \{ `agent?`: `string`; `instanceId?`: `string`; `service`: `string`; `version?`: `string`; \}; `conversationId`: `string`; `frame`: \{ `content`: `string`; `kind`: `"message"`; `role`: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: `string` \| `Record`\<`string`, `unknown`\>; `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"chunk"` \| `"final"`; \} \| \{ `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"invoked"` \| `"succeeded"` \| `"failed"`; `toolName`: `string`; \} \| \{ `durationMs?`: `number`; `kind`: `"telemetry"`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \}; `inReplyTo?`: `string`; `messageId`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `role?`: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`; `tenantId?`: `string`; `timestamp`: `string`; `userId?`: `string`; `version`: `"purista.ai/1.0"`; \}\>

## Returns

`Promise`\<\{ `actor`: \{ `agent?`: `string`; `instanceId?`: `string`; `service`: `string`; `version?`: `string`; \}; `conversationId`: `string`; `frame`: \{ `content`: `string`; `kind`: `"message"`; `role`: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: `string` \| `Record`\<`string`, `unknown`\>; `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"chunk"` \| `"final"`; \} \| \{ `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"invoked"` \| `"succeeded"` \| `"failed"`; `toolName`: `string`; \} \| \{ `durationMs?`: `number`; `kind`: `"telemetry"`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \}; `inReplyTo?`: `string`; `messageId`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `role?`: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`; `tenantId?`: `string`; `timestamp`: `string`; `userId?`: `string`; `version`: `"purista.ai/1.0"`; \}\>
