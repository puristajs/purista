[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / CreateAgentHandlerContextInput

# Type Alias: CreateAgentHandlerContextInput\<Payload, Parameter, Resources, Models, AgentInvokes\>

> **CreateAgentHandlerContextInput**\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`\> = `object`

Defined in: [packages/ai/src/runtime/context.ts:573](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/context.ts#L573)

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

Defined in: [packages/ai/src/runtime/context.ts:604](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/context.ts#L604)

***

### embeddings

> **embeddings**: `Record`\<`string`, \{ `embed`: (`request`) => `Promise`\<[`ProviderEmbedResponse`](ProviderEmbedResponse.md)\>; `name`: `string`; \}\>

Defined in: [packages/ai/src/runtime/context.ts:608](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/context.ts#L608)

***

### eventBridge

> **eventBridge**: [`EventBridge`](../../core/interfaces/EventBridge.md)

Defined in: [packages/ai/src/runtime/context.ts:601](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/context.ts#L601)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/runtime/context.ts:618](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/context.ts#L618)

***

### models

> **models**: `Models`

Defined in: [packages/ai/src/runtime/context.ts:607](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/context.ts#L607)

***

### parameter

> **parameter**: `Parameter`

Defined in: [packages/ai/src/runtime/context.ts:603](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/context.ts#L603)

***

### payload

> **payload**: `Payload`

Defined in: [packages/ai/src/runtime/context.ts:602](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/context.ts#L602)

***

### protocol

> **protocol**: [`ProtocolEmitter`](ProtocolEmitter.md)

Defined in: [packages/ai/src/runtime/context.ts:605](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/context.ts#L605)

***

### rerankers

> **rerankers**: `Record`\<`string`, \{ `name`: `string`; `rerank`: \<`Document`\>(`request`) => `Promise`\<[`ProviderRerankResponse`](ProviderRerankResponse.md)\<`Document`\>\>; \}\>

Defined in: [packages/ai/src/runtime/context.ts:609](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/context.ts#L609)

***

### resources

> **resources**: `Resources`

Defined in: [packages/ai/src/runtime/context.ts:606](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/context.ts#L606)

***

### serviceContext

> **serviceContext**: [`CommandFunctionContext`](../../core/type-aliases/CommandFunctionContext.md)\<`Payload`, `Parameter`, `Resources`, [`InvokeList`](../../core/type-aliases/InvokeList.md), [`StreamInvokeList`](../../core/type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>, [`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md), `AgentInvokes`\> \| [`StreamFunctionContext`](../../core/type-aliases/StreamFunctionContext.md)\<`Payload`, `Parameter`, `Resources`, [`InvokeList`](../../core/type-aliases/InvokeList.md), [`StreamInvokeList`](../../core/type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>, [`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md), `AgentInvokes`\>

Defined in: [packages/ai/src/runtime/context.ts:580](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/context.ts#L580)
