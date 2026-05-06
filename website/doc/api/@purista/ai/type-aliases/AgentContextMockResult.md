[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentContextMockResult

# Type Alias: AgentContextMockResult\<Payload, Parameter, Resources, Models\>

> **AgentContextMockResult**\<`Payload`, `Parameter`, `Resources`, `Models`\> = `object`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:92](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L92)

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

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:98](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L98)

***

### protocol

> **protocol**: `ReturnType`\<*typeof* [`createProtocolBuffer`](../functions/createProtocolBuffer.md)\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:99](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L99)

***

### stubs

> **stubs**: `object`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:100](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L100)

#### agents

> **agents**: [`NestedAgentSpyMap`](NestedAgentSpyMap.md)

#### commands

> **commands**: [`NestedSpyMap`](NestedSpyMap.md)

#### configs

> **configs**: `object`

##### configs.getConfig

> **getConfig**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`string`\], `Promise`\<`unknown`\>\>

##### configs.removeConfig

> **removeConfig**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`string`\], `Promise`\<`void`\>\>

##### configs.setConfig

> **setConfig**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`string`, `unknown`\], `Promise`\<`void`\>\>

#### emit

> **emit**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`string`, `unknown`\], `Promise`\<`void`\>\>

#### logger

> **logger**: `Record`\<`"error"` \| `"warn"` \| `"info"` \| `"debug"` \| `"trace"` \| `"fatal"`, [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`unknown`, `...unknown[]`\], `void`\>\>

#### secrets

> **secrets**: `object`

##### secrets.getSecret

> **getSecret**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`string`\], `Promise`\<`unknown`\>\>

##### secrets.removeSecret

> **removeSecret**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`string`\], `Promise`\<`void`\>\>

##### secrets.setSecret

> **setSecret**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`string`, `unknown`\], `Promise`\<`void`\>\>

#### startActiveSpan

> **startActiveSpan**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`string`, `unknown`, `unknown`, (`span`) => `unknown` \| `Promise`\<`unknown`\>\], `Promise`\<`unknown`\>\>

#### states

> **states**: `object`

##### states.getState

> **getState**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`...string[]`\], `Promise`\<`Record`\<`string`, `unknown`\>\>\>

##### states.removeState

> **removeState**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`string`\], `Promise`\<`void`\>\>

##### states.setState

> **setState**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`string`, `unknown`\], `Promise`\<`void`\>\>

## Methods

### envelopes()

> **envelopes**(): `object`[]

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:129](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L129)

#### Returns

`object`[]

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:130](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L130)

#### Returns

`Promise`\<`void`\>

***

### frames()

> **frames**(): (\{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"tool"` \| `"system"` \| `"developer"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: [`JsonValue`](JsonValue.md); `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `activeWorkers?`: `number`; `durationMs?`: `number`; `effectiveMaxConcurrencyHint?`: `number`; `kind`: `"telemetry"`; `maxConcurrencyPerInstance?`: `number`; `poolId?`: `string`; `provider?`: `string`; `replicaCountHint?`: `number`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitingWorkers?`: `number`; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \})[]

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:128](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L128)

#### Returns

(\{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"tool"` \| `"system"` \| `"developer"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: [`JsonValue`](JsonValue.md); `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `activeWorkers?`: `number`; `durationMs?`: `number`; `effectiveMaxConcurrencyHint?`: `number`; `kind`: `"telemetry"`; `maxConcurrencyPerInstance?`: `number`; `poolId?`: `string`; `provider?`: `string`; `replicaCountHint?`: `number`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitingWorkers?`: `number`; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \})[]
