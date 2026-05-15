[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StreamDefinition

# Type Alias: StreamDefinition\<S, MessagePayloadType, MessageParamsType, FunctionPayloadType, FunctionParamsType, ChunkType, FinalType, Resources, Invokes, StreamInvokes, EmitList, MetadataType, QueueInvokes\>

> **StreamDefinition**\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `ChunkType`, `FinalType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `MetadataType`, `QueueInvokes`\> = `object`

Defined in: [core/types/stream/StreamDefinition.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L12)

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

### MetadataType

`MetadataType` *extends* [`StreamDefinitionMetadataBase`](StreamDefinitionMetadataBase.md) = [`StreamDefinitionMetadataBase`](StreamDefinitionMetadataBase.md)

### QueueInvokes

`QueueInvokes` *extends* [`QueueInvokeList`](QueueInvokeList.md) = [`QueueInvokeList`](QueueInvokeList.md)

## Properties

### aggregateChunks

> **aggregateChunks**: `boolean`

Defined in: [core/types/stream/StreamDefinition.ts:83](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L83)

***

### call

> **call**: [`StreamFunction`](StreamFunction.md)\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `ChunkType`, `FinalType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`\>

Defined in: [core/types/stream/StreamDefinition.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L33)

***

### chunkSchema?

> `optional` **chunkSchema?**: [`Schema`](Schema.md)

Defined in: [core/types/stream/StreamDefinition.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L31)

***

### chunkValidationEnabled

> **chunkValidationEnabled**: `boolean`

Defined in: [core/types/stream/StreamDefinition.ts:81](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L81)

***

### emitList

> **emitList**: `EmitList`

Defined in: [core/types/stream/StreamDefinition.ts:86](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L86)

***

### eventBridgeConfig

> **eventBridgeConfig**: [`DefinitionEventBridgeConfig`](DefinitionEventBridgeConfig.md)

Defined in: [core/types/stream/StreamDefinition.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L30)

***

### finalEventName?

> `optional` **finalEventName?**: `string`

Defined in: [core/types/stream/StreamDefinition.ts:47](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L47)

***

### finalSchema?

> `optional` **finalSchema?**: [`Schema`](Schema.md)

Defined in: [core/types/stream/StreamDefinition.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L32)

***

### finalValidationEnabled

> **finalValidationEnabled**: `boolean`

Defined in: [core/types/stream/StreamDefinition.ts:82](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L82)

***

### hooks

> **hooks**: `object`

Defined in: [core/types/stream/StreamDefinition.ts:48](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L48)

#### afterGuard?

> `optional` **afterGuard?**: `Record`\<`string`, [`StreamAfterGuardHook`](StreamAfterGuardHook.md)\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FinalType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`\>\>

#### beforeGuard?

> `optional` **beforeGuard?**: `Record`\<`string`, [`StreamBeforeGuardHook`](StreamBeforeGuardHook.md)\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`\>\>

***

### invokes

> **invokes**: `Invokes`

Defined in: [core/types/stream/StreamDefinition.ts:84](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L84)

***

### metadata

> **metadata**: `MetadataType`

Defined in: [core/types/stream/StreamDefinition.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L29)

***

### queueInvokes

> **queueInvokes**: `QueueInvokes`

Defined in: [core/types/stream/StreamDefinition.ts:87](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L87)

***

### streamDescription

> **streamDescription**: `string`

Defined in: [core/types/stream/StreamDefinition.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L28)

***

### streamInvokes

> **streamInvokes**: `StreamInvokes`

Defined in: [core/types/stream/StreamDefinition.ts:85](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L85)

***

### streamName

> **streamName**: `string`

Defined in: [core/types/stream/StreamDefinition.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L27)
