[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / CreateAgentHandlerContextInput

# Type Alias: CreateAgentHandlerContextInput\<Payload, Parameter, Resources, Models, AgentInvokes\>

> **CreateAgentHandlerContextInput**\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`\> = `object`

Defined in: [packages/ai/src/runtime/context.ts:601](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L601)

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

Defined in: [packages/ai/src/runtime/context.ts:612](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L612)

***

### embeddings

> **embeddings**: `Record`\<`string`, \{ `embed`: (`request`) => `Promise`\<[`ProviderEmbedResponse`](ProviderEmbedResponse.md)\>; `name`: `string`; \}\>

Defined in: [packages/ai/src/runtime/context.ts:616](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L616)

***

### eventBridge

> **eventBridge**: [`EventBridge`](../../core/interfaces/EventBridge.md)

Defined in: [packages/ai/src/runtime/context.ts:609](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L609)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/runtime/context.ts:626](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L626)

***

### models

> **models**: `Models`

Defined in: [packages/ai/src/runtime/context.ts:615](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L615)

***

### parameter

> **parameter**: `Parameter`

Defined in: [packages/ai/src/runtime/context.ts:611](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L611)

***

### payload

> **payload**: `Payload`

Defined in: [packages/ai/src/runtime/context.ts:610](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L610)

***

### protocol

> **protocol**: [`ProtocolEmitter`](ProtocolEmitter.md)

Defined in: [packages/ai/src/runtime/context.ts:613](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L613)

***

### rerankers

> **rerankers**: `Record`\<`string`, \{ `name`: `string`; `rerank`: \<`Document`\>(`request`) => `Promise`\<[`ProviderRerankResponse`](ProviderRerankResponse.md)\<`Document`\>\>; \}\>

Defined in: [packages/ai/src/runtime/context.ts:617](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L617)

***

### resources

> **resources**: `Resources`

Defined in: [packages/ai/src/runtime/context.ts:614](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L614)

***

### serviceContext

> **serviceContext**: [`ProtocolContext`](ProtocolContext.md)\<`Payload`, `Parameter`, `Resources`, `AgentInvokes`, `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>\>

Defined in: [packages/ai/src/runtime/context.ts:608](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L608)
