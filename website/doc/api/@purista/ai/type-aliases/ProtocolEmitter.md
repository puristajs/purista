[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProtocolEmitter

# Type Alias: ProtocolEmitter

> **ProtocolEmitter** = `object`

Defined in: [packages/ai/src/runtime/context.ts:54](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L54)

## Methods

### emitArtifact()

> **emitArtifact**(`input`): `void`

Defined in: [packages/ai/src/runtime/context.ts:59](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L59)

#### Parameters

##### input

###### artifactId

`string`

###### content

`string` \| `Record`\<`string`, `unknown`\>

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

### emitError()

> **emitError**(`error`, `overrides?`): `void`

Defined in: [packages/ai/src/runtime/context.ts:87](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L87)

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

Defined in: [packages/ai/src/runtime/context.ts:55](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L55)

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

Defined in: [packages/ai/src/runtime/context.ts:67](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L67)

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

Defined in: [packages/ai/src/runtime/context.ts:79](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L79)

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

Defined in: [packages/ai/src/runtime/context.ts:88](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L88)

#### Parameters

##### kind

`"tool"` | `"error"` | `"message"` | `"artifact"` | `"telemetry"`

#### Returns

`boolean`
