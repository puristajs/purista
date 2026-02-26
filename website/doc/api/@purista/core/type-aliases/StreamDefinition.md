[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StreamDefinition

# Type Alias: StreamDefinition\<S, MessagePayloadType, MessageParamsType, FunctionPayloadType, FunctionParamsType, ChunkType, FinalType, Resources, Invokes, StreamInvokes, EmitList, QueueInvokes, MetadataType\>

> **StreamDefinition**\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `ChunkType`, `FinalType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `MetadataType`\> = `object`

Defined in: [core/types/stream/StreamDefinition.ts:10](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L10)

## Type Parameters

### S

`S` *extends* [`ServiceClass`](../interfaces/ServiceClass.md)

### MessagePayloadType

`MessagePayloadType`

### MessageParamsType

`MessageParamsType`

### FunctionPayloadType

`FunctionPayloadType`

### FunctionParamsType

`FunctionParamsType`

### ChunkType

`ChunkType`

### FinalType

`FinalType`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\>

### Invokes

`Invokes` *extends* [`InvokeList`](InvokeList.md)

### StreamInvokes

`StreamInvokes` *extends* [`StreamInvokeList`](StreamInvokeList.md)

### EmitList

`EmitList` *extends* `Record`\<`string`, [`Schema`](Schema.md)\>

### QueueInvokes

`QueueInvokes` *extends* [`QueueInvokeList`](QueueInvokeList.md) = [`QueueInvokeList`](QueueInvokeList.md)

### MetadataType

`MetadataType` *extends* [`StreamDefinitionMetadataBase`](StreamDefinitionMetadataBase.md) = [`StreamDefinitionMetadataBase`](StreamDefinitionMetadataBase.md)

## Properties

### aggregateChunks

> **aggregateChunks**: `boolean`

Defined in: [core/types/stream/StreamDefinition.ts:48](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L48)

***

### call

> **call**: [`StreamFunction`](StreamFunction.md)\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `ChunkType`, `FinalType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`\>

Defined in: [core/types/stream/StreamDefinition.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L31)

***

### chunkSchema?

> `optional` **chunkSchema**: [`Schema`](Schema.md)

Defined in: [core/types/stream/StreamDefinition.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L29)

***

### chunkValidationEnabled

> **chunkValidationEnabled**: `boolean`

Defined in: [core/types/stream/StreamDefinition.ts:46](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L46)

***

### emitList

> **emitList**: `EmitList`

Defined in: [core/types/stream/StreamDefinition.ts:51](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L51)

***

### eventBridgeConfig

> **eventBridgeConfig**: [`DefinitionEventBridgeConfig`](DefinitionEventBridgeConfig.md)

Defined in: [core/types/stream/StreamDefinition.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L28)

***

### finalEventName?

> `optional` **finalEventName**: `string`

Defined in: [core/types/stream/StreamDefinition.ts:45](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L45)

***

### finalSchema?

> `optional` **finalSchema**: [`Schema`](Schema.md)

Defined in: [core/types/stream/StreamDefinition.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L30)

***

### finalValidationEnabled

> **finalValidationEnabled**: `boolean`

Defined in: [core/types/stream/StreamDefinition.ts:47](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L47)

***

### invokes

> **invokes**: `Invokes`

Defined in: [core/types/stream/StreamDefinition.ts:49](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L49)

***

### metadata

> **metadata**: `MetadataType`

Defined in: [core/types/stream/StreamDefinition.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L27)

***

### queueInvokes

> **queueInvokes**: `QueueInvokes`

Defined in: [core/types/stream/StreamDefinition.ts:52](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L52)

***

### streamDescription

> **streamDescription**: `string`

Defined in: [core/types/stream/StreamDefinition.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L26)

***

### streamInvokes

> **streamInvokes**: `StreamInvokes`

Defined in: [core/types/stream/StreamDefinition.ts:50](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L50)

***

### streamName

> **streamName**: `string`

Defined in: [core/types/stream/StreamDefinition.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L25)
