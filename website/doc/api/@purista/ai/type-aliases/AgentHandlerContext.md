[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentHandlerContext

# Type Alias: AgentHandlerContext\<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes\>

> **AgentHandlerContext**\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`, `EmitPayloads`, `ToolInvokes`\> = `object`

Defined in: [packages/ai/src/runtime/context.ts:1136](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1136)

Typed runtime context injected into attached-agent handlers.

This is the canonical public surface for:
- run-state + session memory helpers
- typed tool/agent invocation
- model execution and planner executor factories
- protocol stream emission

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

### ToolInvokes

`ToolInvokes` *extends* [`ToolInvokeMap`](ToolInvokeMap.md) = [`ToolInvokeMap`](ToolInvokeMap.md)

## Properties

### ai

> **ai**: `object`

Defined in: [packages/ai/src/runtime/context.ts:1167](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1167)

#### embeddings

> **embeddings**: [`ModelEmbeddings`](ModelEmbeddings.md)\<`Models`\>

#### models

> **models**: `Models`

#### policy

> **policy**: [`AgentPolicyHelpers`](AgentPolicyHelpers.md)

#### reflect

> **reflect**: [`AgentReflectionHelpers`](AgentReflectionHelpers.md)

#### rerankers

> **rerankers**: [`ModelRerankers`](ModelRerankers.md)\<`Models`\>

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

#### createAgentExecutorFromInvoke()

> **createAgentExecutorFromInvoke**(`call`, `options`): [`AgentPlanExecutor`](AgentPlanExecutor.md)\<`AgentHandlerContext`\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`, `EmitPayloads`, `ToolInvokes`\>\>

Wrap an allowed child-agent invoke call as a planner delegate executor.

##### Parameters

###### call

(`payload`, `parameter?`) => `object`

###### options

[`AgentAgentExecutorFromInvokeOptions`](AgentAgentExecutorFromInvokeOptions.md)

##### Returns

[`AgentPlanExecutor`](AgentPlanExecutor.md)\<`AgentHandlerContext`\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`, `EmitPayloads`, `ToolInvokes`\>\>

#### createModelExecutor()

> **createModelExecutor**\<`Alias`, `OutputSchema`\>(`options`): [`AgentPlanExecutor`](AgentPlanExecutor.md)\<`AgentHandlerContext`\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`, `EmitPayloads`, `ToolInvokes`\>, `AgentModelExecutorResult`\<`OutputSchema`\>\>

Create a reusable planner executor backed by a declared model alias.

This is the default worker/delegate path for planner execution.

##### Type Parameters

###### Alias

`Alias` *extends* `string`

###### OutputSchema

`OutputSchema` = `undefined`

##### Parameters

###### options

[`AgentModelExecutorOptions`](AgentModelExecutorOptions.md)\<`Alias`, `OutputSchema`\>

##### Returns

[`AgentPlanExecutor`](AgentPlanExecutor.md)\<`AgentHandlerContext`\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`, `EmitPayloads`, `ToolInvokes`\>, `AgentModelExecutorResult`\<`OutputSchema`\>\>

##### Example

```ts
const worker = context.ai.createModelExecutor({
  model: 'openai:gpt-4o-mini',
  systemPrompt: 'You are a support worker.',
})
```

#### createToolExecutorFromInvoke()

> **createToolExecutorFromInvoke**\<`InvokePayload`, `InvokeParameter`\>(`call`, `options`): [`AgentPlanExecutor`](AgentPlanExecutor.md)\<`AgentHandlerContext`\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`, `EmitPayloads`, `ToolInvokes`\>\>

Wrap a typed tool invoke call as a planner delegate executor.

##### Type Parameters

###### InvokePayload

`InvokePayload` = `unknown`

###### InvokeParameter

`InvokeParameter` = `unknown`

##### Parameters

###### call

(`payload`, `parameter?`) => `Promise`\<`unknown`\>

###### options

[`AgentToolExecutorFromInvokeOptions`](AgentToolExecutorFromInvokeOptions.md)

##### Returns

[`AgentPlanExecutor`](AgentPlanExecutor.md)\<`AgentHandlerContext`\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`, `EmitPayloads`, `ToolInvokes`\>\>

#### createToolExecutorLogic()

> **createToolExecutorLogic**(`options`): [`AgentPlanExecutor`](AgentPlanExecutor.md)\<`AgentHandlerContext`\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`, `EmitPayloads`, `ToolInvokes`\>\>

Advanced escape hatch for custom planner executor logic.

##### Parameters

###### options

[`AgentToolExecutorLogicOptions`](AgentToolExecutorLogicOptions.md)\<`AgentHandlerContext`\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`, `EmitPayloads`, `ToolInvokes`\>\>

##### Returns

[`AgentPlanExecutor`](AgentPlanExecutor.md)\<`AgentHandlerContext`\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`, `EmitPayloads`, `ToolInvokes`\>\>

#### reply()

##### Call Signature

> **reply**(`options`): `string`

###### Parameters

###### options

[`AgentReplyTextOptions`](AgentReplyTextOptions.md)

###### Returns

`string`

##### Call Signature

> **reply**\<`Alias`\>(`options`): `Promise`\<`string`\>

###### Type Parameters

###### Alias

`Alias` *extends* `string`

###### Parameters

###### options

[`AgentReplyModelOptions`](AgentReplyModelOptions.md)\<`Alias`\>

###### Returns

`Promise`\<`string`\>

##### Call Signature

> **reply**(`options`): `string`

###### Parameters

###### options

[`AgentReplyStructuredOptions`](AgentReplyStructuredOptions.md)

###### Returns

`string`

##### Call Signature

> **reply**(`options`): `string` \| `Promise`\<`string`\>

###### Parameters

###### options

[`AgentReplyOptions`](AgentReplyOptions.md)\<`Extract`\<keyof `Models`, `string`\>\>

###### Returns

`string` \| `Promise`\<`string`\>

#### replyObject()

> **replyObject**\<`Alias`, `OutputSchema`\>(`options`): `Promise`\<[`ProviderJsonOutputFromSchema`](ProviderJsonOutputFromSchema.md)\<`OutputSchema`, `unknown`\>\>

Generate a typed structured reply, optionally grounding it in the current
conversation history and persisting the assistant-visible message.

##### Type Parameters

###### Alias

`Alias` *extends* `string`

###### OutputSchema

`OutputSchema`

##### Parameters

###### options

[`AgentReplyObjectOptions`](AgentReplyObjectOptions.md)\<`Alias`, `OutputSchema`\>

##### Returns

`Promise`\<[`ProviderJsonOutputFromSchema`](ProviderJsonOutputFromSchema.md)\<`OutputSchema`, `unknown`\>\>

#### streamObject()

> **streamObject**\<`Alias`, `T`, `OutputSchema`\>(`options`): `Promise`\<[`ProviderJsonOutputFromSchema`](ProviderJsonOutputFromSchema.md)\<`OutputSchema`, `T`\>\>

Stream structured sections/final output and return the validated final object.
Use `schema` in options for typed validation.

##### Type Parameters

###### Alias

`Alias` *extends* `string`

###### T

`T` = `unknown`

###### OutputSchema

`OutputSchema` = `unknown`

##### Parameters

###### options

[`AgentStreamObjectOptions`](AgentStreamObjectOptions.md)\<`Alias`, `T`, `OutputSchema`\>

##### Returns

`Promise`\<[`ProviderJsonOutputFromSchema`](ProviderJsonOutputFromSchema.md)\<`OutputSchema`, `T`\>\>

#### streamText()

> **streamText**\<`Alias`\>(`options`): `Promise`\<`string`\>

Stream text deltas + final message into the current protocol stream and
return the final text value.

##### Type Parameters

###### Alias

`Alias` *extends* `string`

##### Parameters

###### options

[`AgentStreamTextOptions`](AgentStreamTextOptions.md)\<`Alias`\>

##### Returns

`Promise`\<`string`\>

***

### app

> **app**: `object`

Defined in: [packages/ai/src/runtime/context.ts:1272](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1272)

#### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

#### resources

> **resources**: `Resources`

***

### input

> **input**: `object`

Defined in: [packages/ai/src/runtime/context.ts:1149](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1149)

#### message

> **message**: [`ProtocolContext`](ProtocolContext.md)\<`Payload`, `Parameter`, `Resources`, `AgentInvokes`, `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>\>\[`"message"`\]

#### parameter

> **parameter**: `Parameter`

#### payload

> **payload**: `Payload`

***

### invoke

> **invoke**: `object`

Defined in: [packages/ai/src/runtime/context.ts:1162](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1162)

#### agents

> **agents**: [`AgentInvokeHelpers`](AgentInvokeHelpers.md)\<`AgentInvokes`\>

#### expose

> **expose**: [`ExposeHelpers`](ExposeHelpers.md)

#### tools

> **tools**: [`ToolInvoker`](ToolInvoker.md)\<`ToolInvokes`\>

***

### io

> **io**: `object`

Defined in: [packages/ai/src/runtime/context.ts:1266](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1266)

#### protocol

> **protocol**: [`ProtocolEmitter`](ProtocolEmitter.md)

#### stream

> **stream**: [`AgentStreamEmitter`](AgentStreamEmitter.md)

#### tasks

> **tasks**: [`AgentTaskEmitter`](AgentTaskEmitter.md)

#### workflow

> **workflow**: [`AgentWorkflowEmitter`](AgentWorkflowEmitter.md)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [packages/ai/src/runtime/context.ts:1148](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1148)

Structured logger scoped to the current invocation.

***

### memory

> **memory**: `object`

Defined in: [packages/ai/src/runtime/context.ts:1157](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1157)

#### conversation

> **conversation**: [`ConversationHelpers`](ConversationHelpers.md)

#### run

> **run**: [`AgentRunStateHelpers`](AgentRunStateHelpers.md)

#### session

> **session**: [`SessionHelpers`](SessionHelpers.md)

***

### output

> **output**: `object`

Defined in: [packages/ai/src/runtime/context.ts:1154](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1154)

#### emit

> **emit**: [`EmitCustomMessageFunction`](../../core/type-aliases/EmitCustomMessageFunction.md)\<`EmitPayloads`\>

***

### plan

> **plan**: [`AgentPlanHelpers`](AgentPlanHelpers.md)\<`AgentHandlerContext`\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`, `EmitPayloads`, `ToolInvokes`\>, `Models`\>

Defined in: [packages/ai/src/runtime/context.ts:1262](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1262)

***

### runtime

> **runtime**: `object`

Defined in: [packages/ai/src/runtime/context.ts:1276](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1276)

#### approvals

> **approvals**: [`AgentApprovalHelpers`](AgentApprovalHelpers.md)

#### sandbox

> **sandbox**: `AgentSandboxHelpers`

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
