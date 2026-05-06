[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / StreamProtocolAdapter

# Interface: StreamProtocolAdapter

Defined in: [packages/ai/src/protocol/types.ts:140](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/protocol/types.ts#L140)

## Properties

### contentType

> `readonly` **contentType**: `string`

Defined in: [packages/ai/src/protocol/types.ts:142](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/protocol/types.ts#L142)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/ai/src/protocol/types.ts:141](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/protocol/types.ts#L141)

## Methods

### fromWire()?

> `optional` **fromWire**(`event`): \{ `actor`: \{ `agent?`: `string`; `instanceId?`: `string`; `service`: `string`; `version?`: `string`; \}; `conversationId`: `string`; `frame`: \{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"tool"` \| `"system"` \| `"developer"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: [`JsonValue`](../type-aliases/JsonValue.md); `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `activeWorkers?`: `number`; `durationMs?`: `number`; `effectiveMaxConcurrencyHint?`: `number`; `kind`: `"telemetry"`; `maxConcurrencyPerInstance?`: `number`; `poolId?`: `string`; `provider?`: `string`; `replicaCountHint?`: `number`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitingWorkers?`: `number`; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \}; `inReplyTo?`: `string`; `messageId`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `role?`: `"user"` \| `"assistant"` \| `"tool"` \| `"system"` \| `"developer"`; `tenantId?`: `string`; `timestamp`: `string`; `userId?`: `string`; `version`: `"purista.ai/1.0"`; \} \| `null`

Defined in: [packages/ai/src/protocol/types.ts:144](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/protocol/types.ts#L144)

#### Parameters

##### event

`unknown`

#### Returns

\{ `actor`: \{ `agent?`: `string`; `instanceId?`: `string`; `service`: `string`; `version?`: `string`; \}; `conversationId`: `string`; `frame`: \{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"tool"` \| `"system"` \| `"developer"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: [`JsonValue`](../type-aliases/JsonValue.md); `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `activeWorkers?`: `number`; `durationMs?`: `number`; `effectiveMaxConcurrencyHint?`: `number`; `kind`: `"telemetry"`; `maxConcurrencyPerInstance?`: `number`; `poolId?`: `string`; `provider?`: `string`; `replicaCountHint?`: `number`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitingWorkers?`: `number`; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \}; `inReplyTo?`: `string`; `messageId`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `role?`: `"user"` \| `"assistant"` \| `"tool"` \| `"system"` \| `"developer"`; `tenantId?`: `string`; `timestamp`: `string`; `userId?`: `string`; `version`: `"purista.ai/1.0"`; \} \| `null`

***

### getOpenApiSpec()?

> `optional` **getOpenApiSpec**(): `object`

Defined in: [packages/ai/src/protocol/types.ts:145](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/protocol/types.ts#L145)

#### Returns

`object`

##### contentType

> **contentType**: `string`

##### encoding?

> `optional` **encoding**: `string`

***

### toWire()

> **toWire**(`envelopes`): `AsyncGenerator`\<[`WireEvent`](../type-aliases/WireEvent.md)\>

Defined in: [packages/ai/src/protocol/types.ts:143](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/protocol/types.ts#L143)

#### Parameters

##### envelopes

`object`[]

#### Returns

`AsyncGenerator`\<[`WireEvent`](../type-aliases/WireEvent.md)\>
