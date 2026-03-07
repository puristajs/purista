[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StreamDefinitionBuilderTypes

# Type Alias: StreamDefinitionBuilderTypes\<PayloadSchema, ParamsSchema, ChunkSchema, FinalSchema, Resources, Invokes, StreamInvokes, EmitList, QueueInvokes, AgentInvokes\>

> **StreamDefinitionBuilderTypes**\<`PayloadSchema`, `ParamsSchema`, `ChunkSchema`, `FinalSchema`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `AgentInvokes`\> = `object`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:8](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L8)

## Type Parameters

### PayloadSchema

`PayloadSchema` *extends* [`Schema`](Schema.md) = [`Schema`](Schema.md)

### ParamsSchema

`ParamsSchema` *extends* [`Schema`](Schema.md) = [`Schema`](Schema.md)

### ChunkSchema

`ChunkSchema` *extends* [`Schema`](Schema.md) = [`Schema`](Schema.md)

### FinalSchema

`FinalSchema` *extends* [`Schema`](Schema.md) = [`Schema`](Schema.md)

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](EmptyObject.md)

### Invokes

`Invokes` *extends* [`InvokeList`](InvokeList.md) = [`InvokeList`](InvokeList.md)

### StreamInvokes

`StreamInvokes` *extends* [`StreamInvokeList`](StreamInvokeList.md) = [`StreamInvokeList`](StreamInvokeList.md)

### EmitList

`EmitList` *extends* `Record`\<`string`, [`Schema`](Schema.md)\> = `Record`\<`string`, [`Schema`](Schema.md)\>

### QueueInvokes

`QueueInvokes` *extends* [`QueueInvokeList`](QueueInvokeList.md) = [`QueueInvokeList`](QueueInvokeList.md)

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](AgentInvokeList.md) = [`AgentInvokeList`](AgentInvokeList.md)

## Properties

### AgentInvokes

> **AgentInvokes**: `AgentInvokes`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L29)

***

### ChunkSchema

> **ChunkSchema**: `ChunkSchema`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L22)

***

### EmitList

> **EmitList**: `EmitList`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L27)

***

### FinalSchema

> **FinalSchema**: `FinalSchema`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L23)

***

### Invokes

> **Invokes**: `Invokes`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L25)

***

### ParamsSchema

> **ParamsSchema**: `ParamsSchema`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L21)

***

### PayloadSchema

> **PayloadSchema**: `PayloadSchema`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L20)

***

### QueueInvokes

> **QueueInvokes**: `QueueInvokes`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L28)

***

### Resources

> **Resources**: `Resources`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L24)

***

### StreamInvokes

> **StreamInvokes**: `StreamInvokes`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L26)
