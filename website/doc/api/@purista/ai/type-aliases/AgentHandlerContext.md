[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentHandlerContext

# Type Alias: AgentHandlerContext\<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads\>

> **AgentHandlerContext**\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`, `EmitPayloads`\> = `object`

Defined in: [packages/ai/src/runtime/context.ts:523](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L523)

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\> = `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md) = [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md)

### EmitPayloads

`EmitPayloads` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

## Properties

### agents

> **agents**: `object`

Defined in: [packages/ai/src/runtime/context.ts:555](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L555)

#### invoke

> **invoke**: `AgentInvokes` & (`options`) => `Promise`\<[`AgentProtocolEnvelope`](AgentProtocolEnvelope.md)[]\>

Invokes another agent via EventBridge and returns its emitted envelopes.
Supports both direct options-based calls and typed chained access:
`context.agents.invoke({ agentName, agentVersion, payload })`
and `context.agents.invoke.someAgent['1'].call(payload, parameter)`.

#### forward()

> **forward**(`options`): `Promise`\<`object`[]\>

Invokes another agent and forwards its live output into the current stream.
Defaults to forwarding assistant text, reasoning, artifacts, and errors while suppressing
synthetic outer `agent.run` tool telemetry.

##### Parameters

###### options

[`AgentForwardInvocationOptions`](AgentForwardInvocationOptions.md)

##### Returns

`Promise`\<`object`[]\>

#### runObject()

> **runObject**\<`T`\>(`options`): `Promise`\<`T`\>

Invokes another agent and parses the final assistant message as JSON.

##### Type Parameters

###### T

`T` = `unknown`

##### Parameters

###### options

[`AgentInvocationOptions`](AgentInvocationOptions.md)

##### Returns

`Promise`\<`T`\>

#### runText()

> **runText**(`options`): `Promise`\<`string`\>

Invokes another agent and extracts a best-effort assistant text output from message frames.

##### Parameters

###### options

[`AgentInvocationOptions`](AgentInvocationOptions.md)

##### Returns

`Promise`\<`string`\>

***

### configs

> **configs**: [`ProtocolContext`](ProtocolContext.md)\<`Payload`, `Parameter`, `Resources`, `AgentInvokes`, `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>\>\[`"configs"`\]

Defined in: [packages/ai/src/runtime/context.ts:595](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L595)

***

### conversation

> **conversation**: [`ConversationHelpers`](ConversationHelpers.md)

Defined in: [packages/ai/src/runtime/context.ts:536](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L536)

***

### embeddings

> **embeddings**: `{ [Alias in keyof Models as Models[Alias] extends { embed: (args: any[]) => any } ? Alias : never]: { name: string; embed: any; embedMany?: any } }`

Defined in: [packages/ai/src/runtime/context.ts:578](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L578)

***

### emit

> **emit**: [`EmitCustomMessageFunction`](../../core/type-aliases/EmitCustomMessageFunction.md)\<`EmitPayloads`\>

Defined in: [packages/ai/src/runtime/context.ts:535](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L535)

***

### expose

> **expose**: [`ExposeHelpers`](ExposeHelpers.md)

Defined in: [packages/ai/src/runtime/context.ts:541](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L541)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [packages/ai/src/runtime/context.ts:531](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L531)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/runtime/context.ts:598](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L598)

***

### message

> **message**: [`ProtocolContext`](ProtocolContext.md)\<`Payload`, `Parameter`, `Resources`, `AgentInvokes`, `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>\>\[`"message"`\]

Defined in: [packages/ai/src/runtime/context.ts:534](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L534)

***

### models

> **models**: `Models`

Defined in: [packages/ai/src/runtime/context.ts:554](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L554)

***

### parameter

> **parameter**: `Parameter`

Defined in: [packages/ai/src/runtime/context.ts:533](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L533)

***

### payload

> **payload**: `Payload`

Defined in: [packages/ai/src/runtime/context.ts:532](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L532)

***

### protocol

> **protocol**: [`ProtocolEmitter`](ProtocolEmitter.md)

Defined in: [packages/ai/src/runtime/context.ts:539](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L539)

***

### rerankers

> **rerankers**: `{ [Alias in keyof Models as Models[Alias] extends { rerank: (args: any[]) => any } ? Alias : never]: { name: string; rerank: any } }`

Defined in: [packages/ai/src/runtime/context.ts:585](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L585)

***

### resources

> **resources**: `Resources`

Defined in: [packages/ai/src/runtime/context.ts:553](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L553)

***

### runState

> **runState**: [`AgentRunStateHelpers`](AgentRunStateHelpers.md)

Defined in: [packages/ai/src/runtime/context.ts:597](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L597)

***

### secrets

> **secrets**: [`ProtocolContext`](ProtocolContext.md)\<`Payload`, `Parameter`, `Resources`, `AgentInvokes`, `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>\>\[`"secrets"`\]

Defined in: [packages/ai/src/runtime/context.ts:594](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L594)

***

### serviceContext

> **serviceContext**: [`ProtocolContext`](ProtocolContext.md)\<`Payload`, `Parameter`, `Resources`, `AgentInvokes`, `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>\>

Defined in: [packages/ai/src/runtime/context.ts:593](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L593)

***

### session

> **session**: [`SessionHelpers`](SessionHelpers.md)

Defined in: [packages/ai/src/runtime/context.ts:537](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L537)

***

### skills

> **skills**: `object`

Defined in: [packages/ai/src/runtime/context.ts:542](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L542)

#### available

> **available**: `boolean`

#### config?

> `optional` **config**: [`AgentSkillConfig`](AgentSkillConfig.md)

#### names

> **names**: `string`[]

#### list()

> **list**(): `Promise`\<[`SkillMetadata`](SkillMetadata.md)[]\>

##### Returns

`Promise`\<[`SkillMetadata`](SkillMetadata.md)[]\>

#### load()

> **load**(`skillName`): `Promise`\<[`SkillDocument`](SkillDocument.md)\>

##### Parameters

###### skillName

`string`

##### Returns

`Promise`\<[`SkillDocument`](SkillDocument.md)\>

#### loadAvailable()

> **loadAvailable**(): `Promise`\<[`SkillDocument`](SkillDocument.md)[]\>

##### Returns

`Promise`\<[`SkillDocument`](SkillDocument.md)[]\>

#### loadMany()

> **loadMany**(`skillNames`): `Promise`\<[`SkillDocument`](SkillDocument.md)[]\>

##### Parameters

###### skillNames

`string`[]

##### Returns

`Promise`\<[`SkillDocument`](SkillDocument.md)[]\>

#### loadReferences()

> **loadReferences**(`skillName`): `Promise`\<[`SkillReferenceDocument`](SkillReferenceDocument.md)[]\>

##### Parameters

###### skillName

`string`

##### Returns

`Promise`\<[`SkillReferenceDocument`](SkillReferenceDocument.md)[]\>

#### search()

> **search**(`input?`): `Promise`\<[`SkillDocument`](SkillDocument.md)[]\>

##### Parameters

###### input?

[`SkillSearchInput`](SkillSearchInput.md)

##### Returns

`Promise`\<[`SkillDocument`](SkillDocument.md)[]\>

***

### states

> **states**: [`ProtocolContext`](ProtocolContext.md)\<`Payload`, `Parameter`, `Resources`, `AgentInvokes`, `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>\>\[`"states"`\]

Defined in: [packages/ai/src/runtime/context.ts:596](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L596)

***

### stream

> **stream**: [`AgentStreamEmitter`](AgentStreamEmitter.md)

Defined in: [packages/ai/src/runtime/context.ts:538](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L538)

***

### tools

> **tools**: [`ToolInvoker`](ToolInvoker.md)

Defined in: [packages/ai/src/runtime/context.ts:540](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L540)
