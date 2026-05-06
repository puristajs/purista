[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / CreateAgentHandlerContextInput

# Type Alias: CreateAgentHandlerContextInput\<Payload, Parameter, Resources, Models, AgentInvokes, ToolInvokes\>

> **CreateAgentHandlerContextInput**\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`, `ToolInvokes`\> = `object`

Defined in: [packages/ai/src/runtime/context.ts:1288](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1288)

## Type Parameters

### Payload

`Payload`

### Parameter

`Parameter`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md) = [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md)

### ToolInvokes

`ToolInvokes` *extends* [`ToolInvokeMap`](ToolInvokeMap.md) = [`ToolInvokeMap`](ToolInvokeMap.md)

## Properties

### conversationStore

> **conversationStore**: [`ConversationStore`](../interfaces/ConversationStore.md)

Defined in: [packages/ai/src/runtime/context.ts:1300](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1300)

***

### embeddings

> **embeddings**: [`ModelEmbeddings`](ModelEmbeddings.md)\<`Models`\>

Defined in: [packages/ai/src/runtime/context.ts:1304](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1304)

***

### eventBridge

> **eventBridge**: [`EventBridge`](../../core/interfaces/EventBridge.md)

Defined in: [packages/ai/src/runtime/context.ts:1297](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1297)

***

### executionBudget?

> `optional` **executionBudget**: `AgentExecutionBudget`

Defined in: [packages/ai/src/runtime/context.ts:1307](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1307)

***

### identity?

> `optional` **identity**: `AgentInvocationIdentity`

Defined in: [packages/ai/src/runtime/context.ts:1309](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1309)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/runtime/context.ts:1306](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1306)

***

### models

> **models**: `Models`

Defined in: [packages/ai/src/runtime/context.ts:1303](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1303)

***

### parameter

> **parameter**: `Parameter`

Defined in: [packages/ai/src/runtime/context.ts:1299](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1299)

***

### payload

> **payload**: `Payload`

Defined in: [packages/ai/src/runtime/context.ts:1298](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1298)

***

### protocol

> **protocol**: [`ProtocolEmitter`](ProtocolEmitter.md)

Defined in: [packages/ai/src/runtime/context.ts:1301](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1301)

***

### rerankers

> **rerankers**: [`ModelRerankers`](ModelRerankers.md)\<`Models`\>

Defined in: [packages/ai/src/runtime/context.ts:1305](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1305)

***

### resources

> **resources**: `Resources`

Defined in: [packages/ai/src/runtime/context.ts:1302](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1302)

***

### sandbox?

> `optional` **sandbox**: [`AgentSandboxRuntimeConfig`](AgentSandboxRuntimeConfig.md)\<`Resources`\>

Defined in: [packages/ai/src/runtime/context.ts:1310](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1310)

***

### serviceContext

> **serviceContext**: [`ProtocolContext`](ProtocolContext.md)\<`Payload`, `Parameter`, `Resources`, `AgentInvokes`, `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>\>

Defined in: [packages/ai/src/runtime/context.ts:1296](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1296)

***

### toolInvokes?

> `optional` **toolInvokes**: `ToolInvokes`

Defined in: [packages/ai/src/runtime/context.ts:1308](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1308)
