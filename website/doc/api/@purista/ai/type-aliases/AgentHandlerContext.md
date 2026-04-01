[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentHandlerContext

# Type Alias: AgentHandlerContext\<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads\>

> **AgentHandlerContext**\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`, `EmitPayloads`\> = `object`

Defined in: [packages/ai/src/runtime/context.ts:655](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/context.ts#L655)

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

### ai

> **ai**: `object`

Defined in: [packages/ai/src/runtime/context.ts:704](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/context.ts#L704)

#### embeddings

> **embeddings**: `{ [Alias in keyof Models as Models[Alias] extends { embed: (args: any[]) => any } ? Alias : never]: { name: string; embed: any; embedMany?: any } }`

#### models

> **models**: `Models`

#### policy

> **policy**: [`AgentPolicyHelpers`](AgentPolicyHelpers.md)

#### reflect

> **reflect**: [`AgentReflectionHelpers`](AgentReflectionHelpers.md)

#### reply

> **reply**: `object`

##### reply.compose()

> **compose**\<`Alias`\>(`request`): `Promise`\<`string`\>

###### Type Parameters

###### Alias

`Alias` *extends* `string`

###### Parameters

###### request

`object` & [`ProviderRequest`](ProviderRequest.md) & `object`

###### Returns

`Promise`\<`string`\>

##### reply.generate()

> **generate**\<`Alias`\>(`request`): `Promise`\<`string`\>

###### Type Parameters

###### Alias

`Alias` *extends* `string`

###### Parameters

###### request

`object` & [`ProviderRequest`](ProviderRequest.md) & `object`

###### Returns

`Promise`\<`string`\>

##### reply.publish()

> **publish**(`input`): `string`

###### Parameters

###### input

`string` | \{ `chunked?`: `boolean`; `summary?`: `string`; `text`: `string`; \}

###### Returns

`string`

#### rerankers

> **rerankers**: `{ [Alias in keyof Models as Models[Alias] extends { rerank: (args: any[]) => any } ? Alias : never]: { name: string; rerank: any } }`

#### skills

> **skills**: `object`

##### skills.available

> **available**: `boolean`

##### skills.config?

> `optional` **config**: [`AgentSkillConfig`](AgentSkillConfig.md)

##### skills.names

> **names**: `string`[]

##### skills.list()

> **list**(): `Promise`\<[`SkillMetadata`](SkillMetadata.md)[]\>

###### Returns

`Promise`\<[`SkillMetadata`](SkillMetadata.md)[]\>

##### skills.load()

> **load**(`skillName`): `Promise`\<[`SkillDocument`](SkillDocument.md)\>

###### Parameters

###### skillName

`string`

###### Returns

`Promise`\<[`SkillDocument`](SkillDocument.md)\>

##### skills.loadAvailable()

> **loadAvailable**(): `Promise`\<[`SkillDocument`](SkillDocument.md)[]\>

###### Returns

`Promise`\<[`SkillDocument`](SkillDocument.md)[]\>

##### skills.loadMany()

> **loadMany**(`skillNames`): `Promise`\<[`SkillDocument`](SkillDocument.md)[]\>

###### Parameters

###### skillNames

`string`[]

###### Returns

`Promise`\<[`SkillDocument`](SkillDocument.md)[]\>

##### skills.loadReferences()

> **loadReferences**(`skillName`): `Promise`\<[`SkillReferenceDocument`](SkillReferenceDocument.md)[]\>

###### Parameters

###### skillName

`string`

###### Returns

`Promise`\<[`SkillReferenceDocument`](SkillReferenceDocument.md)[]\>

##### skills.search()

> **search**(`input?`): `Promise`\<[`SkillDocument`](SkillDocument.md)[]\>

###### Parameters

###### input?

[`SkillSearchInput`](SkillSearchInput.md)

###### Returns

`Promise`\<[`SkillDocument`](SkillDocument.md)[]\>

##### skills.selectReferences()

> **selectReferences**(`input`): `Promise`\<[`SkillReferenceDocument`](SkillReferenceDocument.md)[]\>

###### Parameters

###### input

[`SkillReferenceSelectionInput`](SkillReferenceSelectionInput.md)

###### Returns

`Promise`\<[`SkillReferenceDocument`](SkillReferenceDocument.md)[]\>

***

### app

> **app**: `object`

Defined in: [packages/ai/src/runtime/context.ts:749](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/context.ts#L749)

#### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

#### resources

> **resources**: `Resources`

***

### input

> **input**: `object`

Defined in: [packages/ai/src/runtime/context.ts:664](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/context.ts#L664)

#### message

> **message**: [`ProtocolContext`](ProtocolContext.md)\<`Payload`, `Parameter`, `Resources`, `AgentInvokes`, `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>\>\[`"message"`\]

#### parameter

> **parameter**: `Parameter`

#### payload

> **payload**: `Payload`

***

### invoke

> **invoke**: `object`

Defined in: [packages/ai/src/runtime/context.ts:677](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/context.ts#L677)

#### agents

> **agents**: `object`

##### agents.invoke

> **invoke**: `AgentInvokes` & (`options`) => `Promise`\<[`AgentProtocolEnvelope`](AgentProtocolEnvelope.md)[]\>

Invokes another agent via EventBridge and returns its emitted envelopes.
Supports both direct options-based calls and typed chained access:
`context.invoke.agents.invoke({ agentName, agentVersion, payload })`
and `context.invoke.agents.invoke.someAgent['1'].call(payload, parameter)`.

##### agents.forward()

> **forward**(`options`): `Promise`\<`object`[]\>

Invokes another agent and forwards its live output into the current stream.
Defaults to forwarding assistant text, reasoning, artifacts, and errors while suppressing
synthetic outer `agent.run` tool telemetry.

###### Parameters

###### options

[`AgentForwardInvocationOptions`](AgentForwardInvocationOptions.md)

###### Returns

`Promise`\<`object`[]\>

##### agents.runObject()

> **runObject**\<`T`\>(`options`): `Promise`\<`T`\>

Invokes another agent and parses the final assistant message as JSON.

###### Type Parameters

###### T

`T` = `unknown`

###### Parameters

###### options

[`AgentInvocationOptions`](AgentInvocationOptions.md)

###### Returns

`Promise`\<`T`\>

##### agents.runText()

> **runText**(`options`): `Promise`\<`string`\>

Invokes another agent and extracts a best-effort assistant text output from message frames.

###### Parameters

###### options

[`AgentInvocationOptions`](AgentInvocationOptions.md)

###### Returns

`Promise`\<`string`\>

#### expose

> **expose**: [`ExposeHelpers`](ExposeHelpers.md)

#### tools

> **tools**: [`ToolInvoker`](ToolInvoker.md)

***

### io

> **io**: `object`

Defined in: [packages/ai/src/runtime/context.ts:745](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/context.ts#L745)

#### protocol

> **protocol**: [`ProtocolEmitter`](ProtocolEmitter.md)

#### stream

> **stream**: [`AgentStreamEmitter`](AgentStreamEmitter.md)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [packages/ai/src/runtime/context.ts:663](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/context.ts#L663)

***

### memory

> **memory**: `object`

Defined in: [packages/ai/src/runtime/context.ts:672](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/context.ts#L672)

#### conversation

> **conversation**: [`ConversationHelpers`](ConversationHelpers.md)

#### run

> **run**: [`AgentRunStateHelpers`](AgentRunStateHelpers.md)

#### session

> **session**: [`SessionHelpers`](SessionHelpers.md)

***

### output

> **output**: `object`

Defined in: [packages/ai/src/runtime/context.ts:669](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/context.ts#L669)

#### emit

> **emit**: [`EmitCustomMessageFunction`](../../core/type-aliases/EmitCustomMessageFunction.md)\<`EmitPayloads`\>

***

### runtime

> **runtime**: `object`

Defined in: [packages/ai/src/runtime/context.ts:753](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/context.ts#L753)

#### approvals

> **approvals**: [`AgentApprovalHelpers`](AgentApprovalHelpers.md)

#### service

> **service**: [`ProtocolContext`](ProtocolContext.md)\<`Payload`, `Parameter`, `Resources`, `AgentInvokes`, `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>\>

#### stores

> **stores**: `object`

##### stores.configs

> **configs**: [`ProtocolContext`](ProtocolContext.md)\<`Payload`, `Parameter`, `Resources`, `AgentInvokes`, `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>\>\[`"configs"`\]

##### stores.secrets

> **secrets**: [`ProtocolContext`](ProtocolContext.md)\<`Payload`, `Parameter`, `Resources`, `AgentInvokes`, `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>\>\[`"secrets"`\]

##### stores.states

> **states**: [`ProtocolContext`](ProtocolContext.md)\<`Payload`, `Parameter`, `Resources`, `AgentInvokes`, `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>\>\[`"states"`\]
