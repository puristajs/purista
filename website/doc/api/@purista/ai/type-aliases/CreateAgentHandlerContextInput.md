[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / CreateAgentHandlerContextInput

# Type Alias: CreateAgentHandlerContextInput\<Payload, Parameter, Resources, Models, KnowledgeAliases, AgentInvokes\>

> **CreateAgentHandlerContextInput**\<`Payload`, `Parameter`, `Resources`, `Models`, `KnowledgeAliases`, `AgentInvokes`\> = `object`

Defined in: [packages/ai/src/runtime/context.ts:695](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L695)

## Type Parameters

### Payload

`Payload`

### Parameter

`Parameter`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

### KnowledgeAliases

`KnowledgeAliases` *extends* `string` = `string`

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md) = [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md)

## Properties

### conversationStore

> **conversationStore**: [`ConversationStore`](../interfaces/ConversationStore.md)

Defined in: [packages/ai/src/runtime/context.ts:727](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L727)

***

### embeddings

> **embeddings**: `Record`\<`string`, \{ `embed`: (`request`) => `Promise`\<[`ProviderEmbedResponse`](ProviderEmbedResponse.md)\>; `name`: `string`; \}\>

Defined in: [packages/ai/src/runtime/context.ts:732](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L732)

***

### eventBridge

> **eventBridge**: [`EventBridge`](../../core/interfaces/EventBridge.md)

Defined in: [packages/ai/src/runtime/context.ts:724](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L724)

***

### knowledgeAdapters

> **knowledgeAdapters**: `Record`\<`KnowledgeAliases`, [`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md) \| `undefined`\>

Defined in: [packages/ai/src/runtime/context.ts:728](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L728)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/runtime/context.ts:742](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L742)

***

### models

> **models**: `Models`

Defined in: [packages/ai/src/runtime/context.ts:731](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L731)

***

### parameter

> **parameter**: `Parameter`

Defined in: [packages/ai/src/runtime/context.ts:726](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L726)

***

### payload

> **payload**: `Payload`

Defined in: [packages/ai/src/runtime/context.ts:725](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L725)

***

### protocol

> **protocol**: [`ProtocolEmitter`](ProtocolEmitter.md)

Defined in: [packages/ai/src/runtime/context.ts:729](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L729)

***

### rerankers

> **rerankers**: `Record`\<`string`, \{ `name`: `string`; `rerank`: \<`Document`\>(`request`) => `Promise`\<[`ProviderRerankResponse`](ProviderRerankResponse.md)\<`Document`\>\>; \}\>

Defined in: [packages/ai/src/runtime/context.ts:733](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L733)

***

### resources

> **resources**: `Resources`

Defined in: [packages/ai/src/runtime/context.ts:730](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L730)

***

### serviceContext

> **serviceContext**: [`CommandFunctionContext`](../../core/type-aliases/CommandFunctionContext.md)\<`Payload`, `Parameter`, `Resources`, [`InvokeList`](../../core/type-aliases/InvokeList.md), [`StreamInvokeList`](../../core/type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>, [`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md), `AgentInvokes`\> \| [`StreamFunctionContext`](../../core/type-aliases/StreamFunctionContext.md)\<`Payload`, `Parameter`, `Resources`, [`InvokeList`](../../core/type-aliases/InvokeList.md), [`StreamInvokeList`](../../core/type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>, [`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md), `AgentInvokes`\>

Defined in: [packages/ai/src/runtime/context.ts:703](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L703)
