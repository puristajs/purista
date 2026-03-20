[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentHandlerContext

# Type Alias: AgentHandlerContext\<Payload, Parameter, Resources, Models, AgentInvokes\>

> **AgentHandlerContext**\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`\> = `object`

Defined in: [packages/ai/src/runtime/context.ts:489](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L489)

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

Defined in: [packages/ai/src/runtime/context.ts:509](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L509)

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

Defined in: [packages/ai/src/runtime/context.ts:549](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L549)

***

### conversation

> **conversation**: [`ConversationHelpers`](ConversationHelpers.md)

Defined in: [packages/ai/src/runtime/context.ts:501](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L501)

***

### embeddings

> **embeddings**: `{ [Alias in keyof Models as Models[Alias] extends { embed: (args: any[]) => any } ? Alias : never]: { name: string; embed: any; embedMany?: any } }`

Defined in: [packages/ai/src/runtime/context.ts:532](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L532)

***

### emit

> **emit**: `ProtocolContext`\[`"emit"`\]

Defined in: [packages/ai/src/runtime/context.ts:500](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L500)

***

### expose

> **expose**: [`ExposeHelpers`](ExposeHelpers.md)

Defined in: [packages/ai/src/runtime/context.ts:506](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L506)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [packages/ai/src/runtime/context.ts:496](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L496)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/runtime/context.ts:552](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L552)

***

### message

> **message**: `ProtocolContext`\[`"message"`\]

Defined in: [packages/ai/src/runtime/context.ts:499](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L499)

***

### models

> **models**: `Models`

Defined in: [packages/ai/src/runtime/context.ts:508](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L508)

***

### parameter

> **parameter**: `Parameter`

Defined in: [packages/ai/src/runtime/context.ts:498](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L498)

***

### payload

> **payload**: `Payload`

Defined in: [packages/ai/src/runtime/context.ts:497](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L497)

***

### protocol

> **protocol**: [`ProtocolEmitter`](ProtocolEmitter.md)

Defined in: [packages/ai/src/runtime/context.ts:504](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L504)

***

### rerankers

> **rerankers**: `{ [Alias in keyof Models as Models[Alias] extends { rerank: (args: any[]) => any } ? Alias : never]: { name: string; rerank: any } }`

Defined in: [packages/ai/src/runtime/context.ts:539](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L539)

***

### resources

> **resources**: `Resources`

Defined in: [packages/ai/src/runtime/context.ts:507](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L507)

***

### runState

> **runState**: [`AgentRunStateHelpers`](AgentRunStateHelpers.md)

Defined in: [packages/ai/src/runtime/context.ts:551](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L551)

***

### secrets

> **secrets**: `ProtocolContext`\[`"secrets"`\]

Defined in: [packages/ai/src/runtime/context.ts:548](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L548)

***

### serviceContext

> **serviceContext**: `ProtocolContext`

Defined in: [packages/ai/src/runtime/context.ts:547](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L547)

***

### session

> **session**: [`SessionHelpers`](SessionHelpers.md)

Defined in: [packages/ai/src/runtime/context.ts:502](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L502)

***

### states

> **states**: `ProtocolContext`\[`"states"`\]

Defined in: [packages/ai/src/runtime/context.ts:550](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L550)

***

### stream

> **stream**: [`AgentStreamEmitter`](AgentStreamEmitter.md)

Defined in: [packages/ai/src/runtime/context.ts:503](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L503)

***

### tools

> **tools**: `ToolInvoker`

Defined in: [packages/ai/src/runtime/context.ts:505](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L505)
