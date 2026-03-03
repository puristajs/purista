[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StreamDefinition

# Type Alias: StreamDefinition\<S, MessagePayloadType, MessageParamsType, FunctionPayloadType, FunctionParamsType, ChunkType, FinalType, Resources, Invokes, StreamInvokes, EmitList, MetadataType, QueueInvokes, AgentInvokes\>

> **StreamDefinition**\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `ChunkType`, `FinalType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `MetadataType`, `QueueInvokes`, `AgentInvokes`\> = `object`

Defined in: [core/types/stream/StreamDefinition.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L11)

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

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](AgentInvokeList.md) = [`AgentInvokeList`](AgentInvokeList.md)

## Properties

### agentInvokes

> **agentInvokes**: `AgentInvokes`

Defined in: [core/types/stream/StreamDefinition.ts:54](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L54)

***

### aggregateChunks

> **aggregateChunks**: `boolean`

Defined in: [core/types/stream/StreamDefinition.ts:51](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L51)

***

### call

> **call**: [`StreamFunction`](StreamFunction.md)\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `ChunkType`, `FinalType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `AgentInvokes`\>

Defined in: [core/types/stream/StreamDefinition.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L33)

***

### chunkSchema?

> `optional` **chunkSchema**: [`Schema`](Schema.md)

Defined in: [core/types/stream/StreamDefinition.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L31)

***

### chunkValidationEnabled

> **chunkValidationEnabled**: `boolean`

Defined in: [core/types/stream/StreamDefinition.ts:49](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L49)

***

### emitList

> **emitList**: `EmitList`

Defined in: [core/types/stream/StreamDefinition.ts:55](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L55)

***

### eventBridgeConfig

> **eventBridgeConfig**: [`DefinitionEventBridgeConfig`](DefinitionEventBridgeConfig.md)

Defined in: [core/types/stream/StreamDefinition.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L30)

***

### finalEventName?

> `optional` **finalEventName**: `string`

Defined in: [core/types/stream/StreamDefinition.ts:48](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L48)

***

### finalSchema?

> `optional` **finalSchema**: [`Schema`](Schema.md)

Defined in: [core/types/stream/StreamDefinition.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L32)

***

### finalValidationEnabled

> **finalValidationEnabled**: `boolean`

Defined in: [core/types/stream/StreamDefinition.ts:50](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L50)

***

### invokes

> **invokes**: `Invokes`

Defined in: [core/types/stream/StreamDefinition.ts:52](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L52)

***

### metadata

> **metadata**: `MetadataType`

Defined in: [core/types/stream/StreamDefinition.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L29)

***

### queueInvokes

> **queueInvokes**: `QueueInvokes`

Defined in: [core/types/stream/StreamDefinition.ts:56](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L56)

***

### streamDescription

> **streamDescription**: `string`

Defined in: [core/types/stream/StreamDefinition.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L28)

***

### streamInvokes

> **streamInvokes**: `StreamInvokes`

Defined in: [core/types/stream/StreamDefinition.ts:53](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L53)

***

### streamName

> **streamName**: `string`

Defined in: [core/types/stream/StreamDefinition.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L27)
