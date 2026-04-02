[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / CreateAgentHandlerContextInput

# Type Alias: CreateAgentHandlerContextInput\<Payload, Parameter, Resources, Models, AgentInvokes\>

> **CreateAgentHandlerContextInput**\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`\> = `object`

Defined in: [packages/ai/src/runtime/context.ts:764](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/context.ts#L764)

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

## Properties

### conversationStore

> **conversationStore**: [`ConversationStore`](../interfaces/ConversationStore.md)

Defined in: [packages/ai/src/runtime/context.ts:775](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/context.ts#L775)

***

### embeddings

> **embeddings**: `Record`\<`string`, \{ `embed`: (`request`) => `Promise`\<[`ProviderEmbedResponse`](ProviderEmbedResponse.md)\>; `name`: `string`; \}\>

Defined in: [packages/ai/src/runtime/context.ts:779](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/context.ts#L779)

***

### eventBridge

> **eventBridge**: [`EventBridge`](../../core/interfaces/EventBridge.md)

Defined in: [packages/ai/src/runtime/context.ts:772](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/context.ts#L772)

***

### executionBudget?

> `optional` **executionBudget**: `AgentExecutionBudget`

Defined in: [packages/ai/src/runtime/context.ts:790](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/context.ts#L790)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/runtime/context.ts:789](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/context.ts#L789)

***

### models

> **models**: `Models`

Defined in: [packages/ai/src/runtime/context.ts:778](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/context.ts#L778)

***

### parameter

> **parameter**: `Parameter`

Defined in: [packages/ai/src/runtime/context.ts:774](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/context.ts#L774)

***

### payload

> **payload**: `Payload`

Defined in: [packages/ai/src/runtime/context.ts:773](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/context.ts#L773)

***

### protocol

> **protocol**: [`ProtocolEmitter`](ProtocolEmitter.md)

Defined in: [packages/ai/src/runtime/context.ts:776](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/context.ts#L776)

***

### rerankers

> **rerankers**: `Record`\<`string`, \{ `name`: `string`; `rerank`: \<`Document`\>(`request`) => `Promise`\<[`ProviderRerankResponse`](ProviderRerankResponse.md)\<`Document`\>\>; \}\>

Defined in: [packages/ai/src/runtime/context.ts:780](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/context.ts#L780)

***

### resources

> **resources**: `Resources`

Defined in: [packages/ai/src/runtime/context.ts:777](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/context.ts#L777)

***

### serviceContext

> **serviceContext**: [`ProtocolContext`](ProtocolContext.md)\<`Payload`, `Parameter`, `Resources`, `AgentInvokes`, `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>\>

Defined in: [packages/ai/src/runtime/context.ts:771](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/context.ts#L771)
