[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / CreateAgentHandlerContextInput

# Type Alias: CreateAgentHandlerContextInput\<Payload, Parameter, Resources, Models, AgentInvokes\>

> **CreateAgentHandlerContextInput**\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`\> = `object`

Defined in: [packages/ai/src/runtime/context.ts:555](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L555)

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

Defined in: [packages/ai/src/runtime/context.ts:586](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L586)

***

### embeddings

> **embeddings**: `Record`\<`string`, \{ `embed`: (`request`) => `Promise`\<[`ProviderEmbedResponse`](ProviderEmbedResponse.md)\>; `name`: `string`; \}\>

Defined in: [packages/ai/src/runtime/context.ts:590](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L590)

***

### eventBridge

> **eventBridge**: [`EventBridge`](../../core/interfaces/EventBridge.md)

Defined in: [packages/ai/src/runtime/context.ts:583](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L583)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/runtime/context.ts:600](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L600)

***

### models

> **models**: `Models`

Defined in: [packages/ai/src/runtime/context.ts:589](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L589)

***

### parameter

> **parameter**: `Parameter`

Defined in: [packages/ai/src/runtime/context.ts:585](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L585)

***

### payload

> **payload**: `Payload`

Defined in: [packages/ai/src/runtime/context.ts:584](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L584)

***

### protocol

> **protocol**: [`ProtocolEmitter`](ProtocolEmitter.md)

Defined in: [packages/ai/src/runtime/context.ts:587](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L587)

***

### rerankers

> **rerankers**: `Record`\<`string`, \{ `name`: `string`; `rerank`: \<`Document`\>(`request`) => `Promise`\<[`ProviderRerankResponse`](ProviderRerankResponse.md)\<`Document`\>\>; \}\>

Defined in: [packages/ai/src/runtime/context.ts:591](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L591)

***

### resources

> **resources**: `Resources`

Defined in: [packages/ai/src/runtime/context.ts:588](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L588)

***

### serviceContext

> **serviceContext**: [`CommandFunctionContext`](../../core/type-aliases/CommandFunctionContext.md)\<`Payload`, `Parameter`, `Resources`, [`InvokeList`](../../core/type-aliases/InvokeList.md), [`StreamInvokeList`](../../core/type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>, [`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md), `AgentInvokes`\> \| [`StreamFunctionContext`](../../core/type-aliases/StreamFunctionContext.md)\<`Payload`, `Parameter`, `Resources`, [`InvokeList`](../../core/type-aliases/InvokeList.md), [`StreamInvokeList`](../../core/type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>, [`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md), `AgentInvokes`\>

Defined in: [packages/ai/src/runtime/context.ts:562](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L562)
