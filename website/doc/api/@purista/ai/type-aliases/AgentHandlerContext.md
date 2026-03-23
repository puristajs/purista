[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentHandlerContext

# Type Alias: AgentHandlerContext\<Payload, Parameter, Resources, Models, AgentInvokes\>

> **AgentHandlerContext**\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`\> = `object`

Defined in: [packages/ai/src/runtime/context.ts:496](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L496)

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

## Properties

### agents

> **agents**: `object`

Defined in: [packages/ai/src/runtime/context.ts:527](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L527)

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

> **configs**: [`ProtocolContext`](ProtocolContext.md)\[`"configs"`\]

Defined in: [packages/ai/src/runtime/context.ts:567](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L567)

***

### conversation

> **conversation**: [`ConversationHelpers`](ConversationHelpers.md)

Defined in: [packages/ai/src/runtime/context.ts:508](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L508)

***

### embeddings

> **embeddings**: `{ [Alias in keyof Models as Models[Alias] extends { embed: (args: any[]) => any } ? Alias : never]: { name: string; embed: any; embedMany?: any } }`

Defined in: [packages/ai/src/runtime/context.ts:550](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L550)

***

### emit

> **emit**: [`ProtocolContext`](ProtocolContext.md)\[`"emit"`\]

Defined in: [packages/ai/src/runtime/context.ts:507](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L507)

***

### expose

> **expose**: [`ExposeHelpers`](ExposeHelpers.md)

Defined in: [packages/ai/src/runtime/context.ts:513](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L513)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [packages/ai/src/runtime/context.ts:503](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L503)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/runtime/context.ts:570](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L570)

***

### message

> **message**: [`ProtocolContext`](ProtocolContext.md)\[`"message"`\]

Defined in: [packages/ai/src/runtime/context.ts:506](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L506)

***

### models

> **models**: `Models`

Defined in: [packages/ai/src/runtime/context.ts:526](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L526)

***

### parameter

> **parameter**: `Parameter`

Defined in: [packages/ai/src/runtime/context.ts:505](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L505)

***

### payload

> **payload**: `Payload`

Defined in: [packages/ai/src/runtime/context.ts:504](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L504)

***

### protocol

> **protocol**: [`ProtocolEmitter`](ProtocolEmitter.md)

Defined in: [packages/ai/src/runtime/context.ts:511](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L511)

***

### rerankers

> **rerankers**: `{ [Alias in keyof Models as Models[Alias] extends { rerank: (args: any[]) => any } ? Alias : never]: { name: string; rerank: any } }`

Defined in: [packages/ai/src/runtime/context.ts:557](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L557)

***

### resources

> **resources**: `Resources`

Defined in: [packages/ai/src/runtime/context.ts:525](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L525)

***

### runState

> **runState**: [`AgentRunStateHelpers`](AgentRunStateHelpers.md)

Defined in: [packages/ai/src/runtime/context.ts:569](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L569)

***

### secrets

> **secrets**: [`ProtocolContext`](ProtocolContext.md)\[`"secrets"`\]

Defined in: [packages/ai/src/runtime/context.ts:566](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L566)

***

### serviceContext

> **serviceContext**: [`ProtocolContext`](ProtocolContext.md)

Defined in: [packages/ai/src/runtime/context.ts:565](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L565)

***

### session

> **session**: [`SessionHelpers`](SessionHelpers.md)

Defined in: [packages/ai/src/runtime/context.ts:509](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L509)

***

### skills

> **skills**: `object`

Defined in: [packages/ai/src/runtime/context.ts:514](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L514)

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

> **states**: [`ProtocolContext`](ProtocolContext.md)\[`"states"`\]

Defined in: [packages/ai/src/runtime/context.ts:568](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L568)

***

### stream

> **stream**: [`AgentStreamEmitter`](AgentStreamEmitter.md)

Defined in: [packages/ai/src/runtime/context.ts:510](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L510)

***

### tools

> **tools**: [`ToolInvoker`](ToolInvoker.md)

Defined in: [packages/ai/src/runtime/context.ts:512](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L512)
