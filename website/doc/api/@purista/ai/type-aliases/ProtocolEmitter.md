[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProtocolEmitter

# Type Alias: ProtocolEmitter

> **ProtocolEmitter** = `object`

Defined in: [packages/ai/src/runtime/context.ts:389](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L389)

## Methods

### emitArtifact()

> **emitArtifact**(`input`): `void`

Defined in: [packages/ai/src/runtime/context.ts:394](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L394)

#### Parameters

##### input

###### artifactId

`string`

###### content

[`JsonValue`](JsonValue.md)

###### final?

`boolean`

###### mimeType?

`string`

###### sequence?

`number`

###### total?

`number`

#### Returns

`void`

***

### emitEnvelope()

> **emitEnvelope**(`envelope`): `void`

Defined in: [packages/ai/src/runtime/context.ts:402](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L402)

#### Parameters

##### envelope

###### actor

\{ `agent?`: `string`; `instanceId?`: `string`; `service`: `string`; `version?`: `string`; \} = `protocolActorSchema`

###### actor.agent?

`string` = `...`

###### actor.instanceId?

`string` = `...`

###### actor.service

`string` = `...`

###### actor.version?

`string` = `...`

###### conversationId

`string` = `...`

###### frame

\{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"tool"` \| `"system"` \| `"developer"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: [`JsonValue`](JsonValue.md); `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `activeWorkers?`: `number`; `durationMs?`: `number`; `effectiveMaxConcurrencyHint?`: `number`; `kind`: `"telemetry"`; `maxConcurrencyPerInstance?`: `number`; `poolId?`: `string`; `provider?`: `string`; `replicaCountHint?`: `number`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitingWorkers?`: `number`; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \} = `agentProtocolFrameSchema`

###### inReplyTo?

`string` = `...`

###### messageId

`string` = `...`

###### metadata?

`Record`\<`string`, `unknown`\> = `...`

###### role?

`"user"` \| `"assistant"` \| `"tool"` \| `"system"` \| `"developer"` = `...`

###### tenantId?

`string` = `...`

###### timestamp

`string` = `...`

###### userId?

`string` = `...`

###### version

`"purista.ai/1.0"` = `...`

#### Returns

`void`

***

### emitError()

> **emitError**(`error`, `overrides?`): `void`

Defined in: [packages/ai/src/runtime/context.ts:423](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L423)

#### Parameters

##### error

`unknown`

##### overrides?

###### code?

`string`

###### handled?

`boolean`

#### Returns

`void`

***

### emitMessage()

> **emitMessage**(`content`, `options?`): `void`

Defined in: [packages/ai/src/runtime/context.ts:390](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L390)

#### Parameters

##### content

`string` | \{ `content`: `string`; `final?`: `boolean`; `partial?`: `boolean`; `summary?`: `string`; \}

##### options?

###### final?

`boolean`

###### partial?

`boolean`

###### summary?

`string`

#### Returns

`void`

***

### emitTelemetry()

> **emitTelemetry**(`metrics`): `void`

Defined in: [packages/ai/src/runtime/context.ts:403](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L403)

#### Parameters

##### metrics

###### activeWorkers?

`number`

###### durationMs?

`number`

###### effectiveMaxConcurrencyHint?

`number`

###### maxConcurrencyPerInstance?

`number`

###### poolId?

`string`

###### provider?

`string`

###### replicaCountHint?

`number`

###### usage?

\{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}

###### usage.completionTokens?

`number`

###### usage.costUsd?

`number`

###### usage.promptTokens?

`number`

###### usage.totalTokens?

`number`

###### waitingWorkers?

`number`

###### waitTimeMs?

`number`

#### Returns

`void`

***

### emitToolEvent()

> **emitToolEvent**(`event`): `void`

Defined in: [packages/ai/src/runtime/context.ts:415](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L415)

#### Parameters

##### event

###### errorCode?

`string`

###### input?

`unknown`

###### message?

`string`

###### output?

`unknown`

###### status

`"invoked"` \| `"success"` \| `"error"`

###### toolName

`string`

#### Returns

`void`

***

### has()

> **has**(`kind`): `boolean`

Defined in: [packages/ai/src/runtime/context.ts:424](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L424)

#### Parameters

##### kind

`"tool"` | `"error"` | `"message"` | `"artifact"` | `"telemetry"`

#### Returns

`boolean`
