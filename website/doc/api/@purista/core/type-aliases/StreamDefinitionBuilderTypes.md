[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StreamDefinitionBuilderTypes

# Type Alias: StreamDefinitionBuilderTypes\<PayloadSchema, ParamsSchema, ChunkSchema, FinalSchema, Resources, Invokes, StreamInvokes, EmitList, QueueInvokes\>

> **StreamDefinitionBuilderTypes**\<`PayloadSchema`, `ParamsSchema`, `ChunkSchema`, `FinalSchema`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`\> = `object`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:7](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L7)

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

## Properties

### ChunkSchema

> **ChunkSchema**: `ChunkSchema`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L20)

***

### EmitList

> **EmitList**: `EmitList`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L25)

***

### FinalSchema

> **FinalSchema**: `FinalSchema`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L21)

***

### Invokes

> **Invokes**: `Invokes`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L23)

***

### ParamsSchema

> **ParamsSchema**: `ParamsSchema`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L19)

***

### PayloadSchema

> **PayloadSchema**: `PayloadSchema`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L18)

***

### QueueInvokes

> **QueueInvokes**: `QueueInvokes`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L26)

***

### Resources

> **Resources**: `Resources`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L22)

***

### StreamInvokes

> **StreamInvokes**: `StreamInvokes`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts#L24)
