[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / toAiSdkStreamEvents

# Function: toAiSdkStreamEvents()

> **toAiSdkStreamEvents**(`source`, `options?`): `AsyncGenerator`\<[`AiSdkStreamEvent`](../type-aliases/AiSdkStreamEvent.md)\>

Defined in: [packages/ai/src/protocol/aiSdkStream.ts:189](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/protocol/aiSdkStream.ts#L189)

Converts PURISTA protocol envelopes into SSE events compatible with AI SDK transports.

By default (`mode: 'responses'`) it emits `response.*` events.
In `mode: 'ui-message'` it emits UI Message stream events and can additionally map
protocol frames into typed `data-*` parts via `uiMessage.mapDataParts`.

## Parameters

### source

`Iterable`\<\{ `actor`: \{ `agent?`: `string`; `instanceId?`: `string`; `service`: `string`; `version?`: `string`; \}; `conversationId`: `string`; `frame`: \{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"system"` \| `"developer"` \| `"tool"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: `string` \| `Record`\<`string`, `unknown`\>; `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `activeWorkers?`: `number`; `durationMs?`: `number`; `effectiveMaxConcurrencyHint?`: `number`; `kind`: `"telemetry"`; `maxConcurrencyPerInstance?`: `number`; `poolId?`: `string`; `provider?`: `string`; `replicaCountHint?`: `number`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitingWorkers?`: `number`; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \}; `inReplyTo?`: `string`; `messageId`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `role?`: `"user"` \| `"assistant"` \| `"system"` \| `"developer"` \| `"tool"`; `tenantId?`: `string`; `timestamp`: `string`; `userId?`: `string`; `version`: `"purista.ai/1.0"`; \}, `any`, `any`\> | `AsyncIterable`\<\{ `actor`: \{ `agent?`: `string`; `instanceId?`: `string`; `service`: `string`; `version?`: `string`; \}; `conversationId`: `string`; `frame`: \{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"system"` \| `"developer"` \| `"tool"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: `string` \| `Record`\<`string`, `unknown`\>; `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `activeWorkers?`: `number`; `durationMs?`: `number`; `effectiveMaxConcurrencyHint?`: `number`; `kind`: `"telemetry"`; `maxConcurrencyPerInstance?`: `number`; `poolId?`: `string`; `provider?`: `string`; `replicaCountHint?`: `number`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitingWorkers?`: `number`; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \}; `inReplyTo?`: `string`; `messageId`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `role?`: `"user"` \| `"assistant"` \| `"system"` \| `"developer"` \| `"tool"`; `tenantId?`: `string`; `timestamp`: `string`; `userId?`: `string`; `version`: `"purista.ai/1.0"`; \}, `any`, `any`\>

### options?

[`ToAiSdkStreamOptions`](../type-aliases/ToAiSdkStreamOptions.md) = `{}`

## Returns

`AsyncGenerator`\<[`AiSdkStreamEvent`](../type-aliases/AiSdkStreamEvent.md)\>
