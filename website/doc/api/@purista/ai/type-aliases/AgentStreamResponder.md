[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentStreamResponder

# Type Alias: AgentStreamResponder\<_EmitPayloads\>

> **AgentStreamResponder**\<`_EmitPayloads`\> = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:145](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/types/AgentDefinition.ts#L145)

## Type Parameters

### _EmitPayloads

`_EmitPayloads` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

## Methods

### onComplete()

> **onComplete**(): `void` \| `Promise`\<`void`\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:147](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/types/AgentDefinition.ts#L147)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onError()

> **onError**(`error`): `void` \| `Promise`\<`void`\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:148](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/types/AgentDefinition.ts#L148)

#### Parameters

##### error

`unknown`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFrame()

> **onFrame**(`frame`): `void` \| `Promise`\<`void`\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:146](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/types/AgentDefinition.ts#L146)

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
