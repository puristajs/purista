[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentHandlerContext

# Type Alias: AgentHandlerContext\<Payload, Parameter, Resources, Models, KnowledgeAliases, AgentInvokes\>

> **AgentHandlerContext**\<`Payload`, `Parameter`, `Resources`, `Models`, `KnowledgeAliases`, `AgentInvokes`\> = `object`

Defined in: [packages/ai/src/runtime/context.ts:627](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L627)

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\> = `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

### KnowledgeAliases

`KnowledgeAliases` *extends* `string` = `never`

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md) = [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md)

## Properties

### agents

> **agents**: `object`

Defined in: [packages/ai/src/runtime/context.ts:649](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L649)

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

> **configs**: `ProtocolContext`\[`"configs"`\]

Defined in: [packages/ai/src/runtime/context.ts:689](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L689)

***

### conversation

> **conversation**: [`ConversationHelpers`](ConversationHelpers.md)

Defined in: [packages/ai/src/runtime/context.ts:640](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L640)

***

### embeddings

> **embeddings**: `{ [Alias in keyof Models as Models[Alias] extends { embed: (args: any[]) => any } ? Alias : never]: { name: string; embed: any; embedMany?: any } }`

Defined in: [packages/ai/src/runtime/context.ts:672](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L672)

***

### emit

> **emit**: `ProtocolContext`\[`"emit"`\]

Defined in: [packages/ai/src/runtime/context.ts:639](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L639)

***

### expose

> **expose**: [`ExposeHelpers`](ExposeHelpers.md)

Defined in: [packages/ai/src/runtime/context.ts:646](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L646)

***

### knowledge

> **knowledge**: [`KnowledgeHelpers`](KnowledgeHelpers.md)\<`KnowledgeAliases`\>

Defined in: [packages/ai/src/runtime/context.ts:642](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L642)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [packages/ai/src/runtime/context.ts:635](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L635)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/runtime/context.ts:692](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L692)

***

### message

> **message**: `ProtocolContext`\[`"message"`\]

Defined in: [packages/ai/src/runtime/context.ts:638](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L638)

***

### models

> **models**: `Models`

Defined in: [packages/ai/src/runtime/context.ts:648](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L648)

***

### parameter

> **parameter**: `Parameter`

Defined in: [packages/ai/src/runtime/context.ts:637](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L637)

***

### payload

> **payload**: `Payload`

Defined in: [packages/ai/src/runtime/context.ts:636](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L636)

***

### protocol

> **protocol**: [`ProtocolEmitter`](ProtocolEmitter.md)

Defined in: [packages/ai/src/runtime/context.ts:644](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L644)

***

### rerankers

> **rerankers**: `{ [Alias in keyof Models as Models[Alias] extends { rerank: (args: any[]) => any } ? Alias : never]: { name: string; rerank: any } }`

Defined in: [packages/ai/src/runtime/context.ts:679](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L679)

***

### resources

> **resources**: `Resources`

Defined in: [packages/ai/src/runtime/context.ts:647](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L647)

***

### runState

> **runState**: [`AgentRunStateHelpers`](AgentRunStateHelpers.md)

Defined in: [packages/ai/src/runtime/context.ts:691](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L691)

***

### secrets

> **secrets**: `ProtocolContext`\[`"secrets"`\]

Defined in: [packages/ai/src/runtime/context.ts:688](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L688)

***

### serviceContext

> **serviceContext**: `ProtocolContext`

Defined in: [packages/ai/src/runtime/context.ts:687](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L687)

***

### session

> **session**: [`SessionHelpers`](SessionHelpers.md)

Defined in: [packages/ai/src/runtime/context.ts:641](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L641)

***

### states

> **states**: `ProtocolContext`\[`"states"`\]

Defined in: [packages/ai/src/runtime/context.ts:690](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L690)

***

### stream

> **stream**: [`AgentStreamEmitter`](AgentStreamEmitter.md)

Defined in: [packages/ai/src/runtime/context.ts:643](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L643)

***

### tools

> **tools**: `ToolInvoker`

Defined in: [packages/ai/src/runtime/context.ts:645](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L645)
