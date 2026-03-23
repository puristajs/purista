[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StreamDefinition

# Type Alias: StreamDefinition\<S, MessagePayloadType, MessageParamsType, FunctionPayloadType, FunctionParamsType, ChunkType, FinalType, Resources, Invokes, StreamInvokes, EmitList, MetadataType, QueueInvokes, AgentInvokes\>

> **StreamDefinition**\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `ChunkType`, `FinalType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `MetadataType`, `QueueInvokes`, `AgentInvokes`\> = `object`

Defined in: [core/types/stream/StreamDefinition.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L13)

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

Defined in: [core/types/stream/StreamDefinition.ts:91](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L91)

***

### aggregateChunks

> **aggregateChunks**: `boolean`

Defined in: [core/types/stream/StreamDefinition.ts:88](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L88)

***

### call

> **call**: [`StreamFunction`](StreamFunction.md)\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `ChunkType`, `FinalType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `AgentInvokes`\>

Defined in: [core/types/stream/StreamDefinition.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L35)

***

### chunkSchema?

> `optional` **chunkSchema**: [`Schema`](Schema.md)

Defined in: [core/types/stream/StreamDefinition.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L33)

***

### chunkValidationEnabled

> **chunkValidationEnabled**: `boolean`

Defined in: [core/types/stream/StreamDefinition.ts:86](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L86)

***

### emitList

> **emitList**: `EmitList`

Defined in: [core/types/stream/StreamDefinition.ts:92](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L92)

***

### eventBridgeConfig

> **eventBridgeConfig**: [`DefinitionEventBridgeConfig`](DefinitionEventBridgeConfig.md)

Defined in: [core/types/stream/StreamDefinition.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L32)

***

### finalEventName?

> `optional` **finalEventName**: `string`

Defined in: [core/types/stream/StreamDefinition.ts:50](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L50)

***

### finalSchema?

> `optional` **finalSchema**: [`Schema`](Schema.md)

Defined in: [core/types/stream/StreamDefinition.ts:34](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L34)

***

### finalValidationEnabled

> **finalValidationEnabled**: `boolean`

Defined in: [core/types/stream/StreamDefinition.ts:87](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L87)

***

### hooks

> **hooks**: `object`

Defined in: [core/types/stream/StreamDefinition.ts:51](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L51)

#### afterGuard?

> `optional` **afterGuard**: `Record`\<`string`, [`StreamAfterGuardHook`](StreamAfterGuardHook.md)\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FinalType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `AgentInvokes`\>\>

#### beforeGuard?

> `optional` **beforeGuard**: `Record`\<`string`, [`StreamBeforeGuardHook`](StreamBeforeGuardHook.md)\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `AgentInvokes`\>\>

***

### invokes

> **invokes**: `Invokes`

Defined in: [core/types/stream/StreamDefinition.ts:89](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L89)

***

### metadata

> **metadata**: `MetadataType`

Defined in: [core/types/stream/StreamDefinition.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L31)

***

### queueInvokes

> **queueInvokes**: `QueueInvokes`

Defined in: [core/types/stream/StreamDefinition.ts:93](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L93)

***

### streamDescription

> **streamDescription**: `string`

Defined in: [core/types/stream/StreamDefinition.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L30)

***

### streamInvokes

> **streamInvokes**: `StreamInvokes`

Defined in: [core/types/stream/StreamDefinition.ts:90](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L90)

***

### streamName

> **streamName**: `string`

Defined in: [core/types/stream/StreamDefinition.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinition.ts#L29)
