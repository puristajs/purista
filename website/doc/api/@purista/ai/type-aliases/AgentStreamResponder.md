[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentStreamResponder

# Type Alias: AgentStreamResponder

> **AgentStreamResponder** = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:89](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentDefinition.ts#L89)

## Methods

### onComplete()

> **onComplete**(): `void` \| `Promise`\<`void`\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:91](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentDefinition.ts#L91)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onError()

> **onError**(`error`): `void` \| `Promise`\<`void`\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:92](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentDefinition.ts#L92)

#### Parameters

##### error

`unknown`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFrame()

> **onFrame**(`frame`): `void` \| `Promise`\<`void`\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:90](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/types/AgentDefinition.ts#L90)

#### Parameters

##### frame

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

\{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"system"` \| `"developer"` \| `"tool"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: `string` \| `Record`\<`string`, `unknown`\>; `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `activeWorkers?`: `number`; `durationMs?`: `number`; `effectiveMaxConcurrencyHint?`: `number`; `kind`: `"telemetry"`; `maxConcurrencyPerInstance?`: `number`; `poolId?`: `string`; `provider?`: `string`; `replicaCountHint?`: `number`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitingWorkers?`: `number`; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \} = `agentProtocolFrameSchema`

###### inReplyTo?

`string` = `...`

###### messageId

`string` = `...`

###### metadata?

`Record`\<`string`, `unknown`\> = `...`

###### role?

`"user"` \| `"assistant"` \| `"system"` \| `"developer"` \| `"tool"` = `...`

###### tenantId?

`string` = `...`

###### timestamp

`string` = `...`

###### userId?

`string` = `...`

###### version

`"purista.ai/1.0"` = `...`

#### Returns

`void` \| `Promise`\<`void`\>
