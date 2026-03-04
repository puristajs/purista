[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / CreateAgentHandlerContextInput

# Type Alias: CreateAgentHandlerContextInput\<Payload, Parameter, Resources, Models\>

> **CreateAgentHandlerContextInput**\<`Payload`, `Parameter`, `Resources`, `Models`\> = `object`

Defined in: [ai/src/runtime/context.ts:400](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L400)

## Type Parameters

### Payload

`Payload`

### Parameter

`Parameter`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

## Properties

### knowledgeAdapters

> **knowledgeAdapters**: `Record`\<`string`, [`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md) \| `undefined`\>

Defined in: [ai/src/runtime/context.ts:410](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L410)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [ai/src/runtime/context.ts:414](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L414)

***

### models

> **models**: `Models`

Defined in: [ai/src/runtime/context.ts:413](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L413)

***

### parameter

> **parameter**: `Parameter`

Defined in: [ai/src/runtime/context.ts:408](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L408)

***

### payload

> **payload**: `Payload`

Defined in: [ai/src/runtime/context.ts:407](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L407)

***

### protocol

> **protocol**: `ProtocolEmitter`

Defined in: [ai/src/runtime/context.ts:411](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L411)

***

### resources

> **resources**: `Resources`

Defined in: [ai/src/runtime/context.ts:412](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L412)

***

### serviceContext

> **serviceContext**: [`CommandFunctionContext`](../../core/type-aliases/CommandFunctionContext.md)\<`Payload`, `Parameter`\>

Defined in: [ai/src/runtime/context.ts:406](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L406)

***

### sessionStore

> **sessionStore**: [`SessionStore`](../interfaces/SessionStore.md)

Defined in: [ai/src/runtime/context.ts:409](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L409)
