[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInvocationPipeline

# Type Alias: AgentInvocationPipeline

> **AgentInvocationPipeline** = `object`

Defined in: [packages/ai/src/runtime/context.ts:1448](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1448)

## Methods

### \[asyncIterator\]()

> **\[asyncIterator\]**(): `AsyncIterator`\<\{ `actor`: \{ `agent?`: `string`; `instanceId?`: `string`; `service`: `string`; `version?`: `string`; \}; `conversationId`: `string`; `frame`: \{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"tool"` \| `"system"` \| `"developer"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: [`JsonValue`](JsonValue.md); `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `activeWorkers?`: `number`; `durationMs?`: `number`; `effectiveMaxConcurrencyHint?`: `number`; `kind`: `"telemetry"`; `maxConcurrencyPerInstance?`: `number`; `poolId?`: `string`; `provider?`: `string`; `replicaCountHint?`: `number`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitingWorkers?`: `number`; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \}; `inReplyTo?`: `string`; `messageId`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `role?`: `"user"` \| `"assistant"` \| `"tool"` \| `"system"` \| `"developer"`; `tenantId?`: `string`; `timestamp`: `string`; `userId?`: `string`; `version`: `"purista.ai/1.0"`; \}\>

Defined in: [packages/ai/src/runtime/context.ts:1454](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1454)

#### Returns

`AsyncIterator`\<\{ `actor`: \{ `agent?`: `string`; `instanceId?`: `string`; `service`: `string`; `version?`: `string`; \}; `conversationId`: `string`; `frame`: \{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"tool"` \| `"system"` \| `"developer"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: [`JsonValue`](JsonValue.md); `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `activeWorkers?`: `number`; `durationMs?`: `number`; `effectiveMaxConcurrencyHint?`: `number`; `kind`: `"telemetry"`; `maxConcurrencyPerInstance?`: `number`; `poolId?`: `string`; `provider?`: `string`; `replicaCountHint?`: `number`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitingWorkers?`: `number`; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \}; `inReplyTo?`: `string`; `messageId`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `role?`: `"user"` \| `"assistant"` \| `"tool"` \| `"system"` \| `"developer"`; `tenantId?`: `string`; `timestamp`: `string`; `userId?`: `string`; `version`: `"purista.ai/1.0"`; \}\>

***

### collect()

> **collect**(): `Promise`\<`object`[]\>

Defined in: [packages/ai/src/runtime/context.ts:1450](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1450)

#### Returns

`Promise`\<`object`[]\>

***

### final()

> **final**(): `Promise`\<[`AgentInvocationFinalResult`](AgentInvocationFinalResult.md)\>

Defined in: [packages/ai/src/runtime/context.ts:1449](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1449)

#### Returns

`Promise`\<[`AgentInvocationFinalResult`](AgentInvocationFinalResult.md)\>

***

### forwardToCurrentStream()

> **forwardToCurrentStream**(`options?`): `AgentInvocationPipeline`

Defined in: [packages/ai/src/runtime/context.ts:1452](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1452)

#### Parameters

##### options?

[`AgentForwardingOptions`](AgentForwardingOptions.md)

#### Returns

`AgentInvocationPipeline`

***

### tap()

> **tap**(`listener`): `AgentInvocationPipeline`

Defined in: [packages/ai/src/runtime/context.ts:1451](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1451)

#### Parameters

##### listener

(`envelope`) => `void` \| `Promise`\<`void`\>

#### Returns

`AgentInvocationPipeline`

***

### toWriter()

> **toWriter**(`writer`): `Promise`\<`object`[]\>

Defined in: [packages/ai/src/runtime/context.ts:1453](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1453)

#### Parameters

##### writer

[`AgentEnvelopeWriter`](AgentEnvelopeWriter.md)

#### Returns

`Promise`\<`object`[]\>
