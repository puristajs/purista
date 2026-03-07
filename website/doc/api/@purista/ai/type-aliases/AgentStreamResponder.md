[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentStreamResponder

# Type Alias: AgentStreamResponder

> **AgentStreamResponder** = `object`

Defined in: [ai/src/types/AgentDefinition.ts:73](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L73)

## Methods

### onComplete()

> **onComplete**(): `void`

Defined in: [ai/src/types/AgentDefinition.ts:75](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L75)

#### Returns

`void`

***

### onError()

> **onError**(`error`): `void`

Defined in: [ai/src/types/AgentDefinition.ts:76](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L76)

#### Parameters

##### error

`unknown`

#### Returns

`void`

***

### onFrame()

> **onFrame**(`frame`): `void`

Defined in: [ai/src/types/AgentDefinition.ts:74](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L74)

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

\{ `content`: `string`; `final?`: `boolean`; `kind`: `"message"`; `partial?`: `boolean`; `role`: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`; `summary?`: `string`; \} \| \{ `artifactId`: `string`; `content`: `string` \| `Record`\<`string`, `unknown`\>; `kind`: `"artifact"`; `lastChunk?`: `boolean`; `mimeType?`: `string`; `phase`: `"final"` \| `"chunk"`; `sequence?`: `number`; `total?`: `number`; \} \| \{ `errorCode?`: `string`; `input?`: `unknown`; `kind`: `"tool"`; `message?`: `string`; `output?`: `unknown`; `status`: `"error"` \| `"success"` \| `"invoked"`; `toolName`: `string`; \} \| \{ `durationMs?`: `number`; `kind`: `"telemetry"`; `poolId?`: `string`; `provider?`: `string`; `usage?`: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; `waitTimeMs?`: `number`; \} \| \{ `code`: `string`; `details?`: `unknown`; `handled`: `boolean`; `kind`: `"error"`; `message`: `string`; \} = `agentProtocolFrameSchema`

###### inReplyTo?

`string` = `...`

###### messageId

`string` = `...`

###### metadata?

`Record`\<`string`, `unknown`\> = `...`

###### role?

`"user"` \| `"assistant"` \| `"system"` \| `"tool"` = `...`

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
