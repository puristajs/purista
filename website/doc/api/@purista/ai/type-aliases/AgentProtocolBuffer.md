[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentProtocolBuffer

# Type Alias: AgentProtocolBuffer

> **AgentProtocolBuffer** = `object`

Defined in: [packages/ai/src/runtime/context.ts:91](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L91)

## Properties

### protocol

> **protocol**: [`ProtocolEmitter`](ProtocolEmitter.md)

Defined in: [packages/ai/src/runtime/context.ts:92](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L92)

## Methods

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/context.ts:95](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L95)

#### Returns

`Promise`\<`void`\>

***

### frames()

> **frames**(): (\{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"system"` \| `"developer"` \| `"tool"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: `string` \| `Record`\<`string`, `unknown`\>; `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `activeWorkers?`: `number`; `durationMs?`: `number`; `effectiveMaxConcurrencyHint?`: `number`; `kind`: `"telemetry"`; `maxConcurrencyPerInstance?`: `number`; `poolId?`: `string`; `provider?`: `string`; `replicaCountHint?`: `number`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitingWorkers?`: `number`; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \})[]

Defined in: [packages/ai/src/runtime/context.ts:94](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L94)

#### Returns

(\{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"system"` \| `"developer"` \| `"tool"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: `string` \| `Record`\<`string`, `unknown`\>; `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `activeWorkers?`: `number`; `durationMs?`: `number`; `effectiveMaxConcurrencyHint?`: `number`; `kind`: `"telemetry"`; `maxConcurrencyPerInstance?`: `number`; `poolId?`: `string`; `provider?`: `string`; `replicaCountHint?`: `number`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitingWorkers?`: `number`; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \})[]

***

### toEnvelopes()

> **toEnvelopes**(): `object`[]

Defined in: [packages/ai/src/runtime/context.ts:93](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L93)

#### Returns

`object`[]
