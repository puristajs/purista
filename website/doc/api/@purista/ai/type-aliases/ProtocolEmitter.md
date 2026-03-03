[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProtocolEmitter

# Type Alias: ProtocolEmitter

> **ProtocolEmitter** = `object`

Defined in: [ai/src/runtime/context.ts:22](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L22)

## Methods

### emitArtifact()

> **emitArtifact**(`input`): `void`

Defined in: [ai/src/runtime/context.ts:27](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L27)

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

Defined in: [ai/src/runtime/context.ts:50](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L50)

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

Defined in: [ai/src/runtime/context.ts:23](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L23)

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

Defined in: [ai/src/runtime/context.ts:35](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L35)

#### Parameters

##### metrics

###### durationMs?

`number`

###### poolId?

`string`

###### provider?

`string`

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

###### waitTimeMs?

`number`

#### Returns

`void`

***

### emitToolEvent()

> **emitToolEvent**(`event`): `void`

Defined in: [ai/src/runtime/context.ts:42](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L42)

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

Defined in: [ai/src/runtime/context.ts:51](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L51)

#### Parameters

##### kind

`"tool"` | `"error"` | `"message"` | `"artifact"` | `"telemetry"`

#### Returns

`boolean`
