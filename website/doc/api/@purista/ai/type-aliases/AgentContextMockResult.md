[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentContextMockResult

# Type Alias: AgentContextMockResult\<Payload, Parameter, Resources, Models\>

> **AgentContextMockResult**\<`Payload`, `Parameter`, `Resources`, `Models`\> = `object`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:66](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L66)

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\> = `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

## Properties

### context

> **context**: [`AgentHandlerContext`](AgentHandlerContext.md)\<`Payload`, `Parameter`, `Resources`, `Models`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:72](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L72)

***

### protocol

> **protocol**: `ReturnType`\<*typeof* [`createProtocolBuffer`](../functions/createProtocolBuffer.md)\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:73](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L73)

***

### stubs

> **stubs**: `object`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:74](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L74)

#### agents

> **agents**: `NestedAgentSpyMap`

#### commands

> **commands**: `NestedSpyMap`

#### configs

> **configs**: `object`

##### configs.getConfig

> **getConfig**: `TestSpy`\<\[`string`\], `Promise`\<`unknown`\>\>

##### configs.removeConfig

> **removeConfig**: `TestSpy`\<\[`string`\], `Promise`\<`void`\>\>

##### configs.setConfig

> **setConfig**: `TestSpy`\<\[`string`, `unknown`\], `Promise`\<`void`\>\>

#### emit

> **emit**: `TestSpy`\<\[`string`, `unknown`\], `Promise`\<`void`\>\>

#### logger

> **logger**: `Record`\<`"error"` \| `"warn"` \| `"info"` \| `"debug"` \| `"trace"` \| `"fatal"`, `TestSpy`\<\[`unknown`, `...unknown[]`\], `void`\>\>

#### secrets

> **secrets**: `object`

##### secrets.getSecret

> **getSecret**: `TestSpy`\<\[`string`\], `Promise`\<`unknown`\>\>

##### secrets.removeSecret

> **removeSecret**: `TestSpy`\<\[`string`\], `Promise`\<`void`\>\>

##### secrets.setSecret

> **setSecret**: `TestSpy`\<\[`string`, `unknown`\], `Promise`\<`void`\>\>

#### startActiveSpan

> **startActiveSpan**: `TestSpy`\<\[`string`, `unknown`, `unknown`, (`span`) => `unknown` \| `Promise`\<`unknown`\>\], `Promise`\<`unknown`\>\>

#### states

> **states**: `object`

##### states.getState

> **getState**: `TestSpy`\<\[`...string[]`\], `Promise`\<`Record`\<`string`, `unknown`\>\>\>

##### states.removeState

> **removeState**: `TestSpy`\<\[`string`\], `Promise`\<`void`\>\>

##### states.setState

> **setState**: `TestSpy`\<\[`string`, `unknown`\], `Promise`\<`void`\>\>

## Methods

### envelopes()

> **envelopes**(): `object`[]

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:100](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L100)

#### Returns

`object`[]

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:101](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L101)

#### Returns

`Promise`\<`void`\>

***

### frames()

> **frames**(): (\{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"system"` \| `"developer"` \| `"tool"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: `string` \| `Record`\<`string`, `unknown`\>; `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `activeWorkers?`: `number`; `durationMs?`: `number`; `effectiveMaxConcurrencyHint?`: `number`; `kind`: `"telemetry"`; `maxConcurrencyPerInstance?`: `number`; `poolId?`: `string`; `provider?`: `string`; `replicaCountHint?`: `number`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitingWorkers?`: `number`; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \})[]

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:99](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/testing/createAgentContextMock.ts#L99)

#### Returns

(\{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"system"` \| `"developer"` \| `"tool"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: `string` \| `Record`\<`string`, `unknown`\>; `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `activeWorkers?`: `number`; `durationMs?`: `number`; `effectiveMaxConcurrencyHint?`: `number`; `kind`: `"telemetry"`; `maxConcurrencyPerInstance?`: `number`; `poolId?`: `string`; `provider?`: `string`; `replicaCountHint?`: `number`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitingWorkers?`: `number`; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \})[]
