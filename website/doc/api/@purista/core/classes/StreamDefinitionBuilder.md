[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StreamDefinitionBuilder

# Class: StreamDefinitionBuilder\<S, C\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L31)

## Type Parameters

### S

`S` *extends* [`Service`](Service.md)

### C

`C` *extends* [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md) = [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)

## Constructors

### Constructor

> **new StreamDefinitionBuilder**\<`S`, `C`\>(`streamName`, `streamDescription`, `finalEventName?`, `deprecated?`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:107](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L107)

#### Parameters

##### streamName

`string`

##### streamDescription

`string`

##### finalEventName?

`string`

##### deprecated?

`boolean` = `false`

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

## Methods

### addChunkSchema()

> **addChunkSchema**\<`ChunkSchema`\>(`chunkSchema`, `validateChunks?`): `StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `ChunkSchema`, `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:474](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L474)

#### Type Parameters

##### ChunkSchema

`ChunkSchema` *extends* [`Schema`](../type-aliases/Schema.md)

#### Parameters

##### chunkSchema

`ChunkSchema`

##### validateChunks?

`boolean` = `true`

#### Returns

`StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `ChunkSchema`, `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>\>

***

### addFinalSchema()

> **addFinalSchema**\<`FinalSchema`\>(`finalSchema`, `validateFinal?`): `StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"ChunkSchema"`\], `FinalSchema`, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:493](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L493)

#### Type Parameters

##### FinalSchema

`FinalSchema` *extends* [`Schema`](../type-aliases/Schema.md)

#### Parameters

##### finalSchema

`FinalSchema`

##### validateFinal?

`boolean` = `true`

#### Returns

`StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"ChunkSchema"`\], `FinalSchema`, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>\>

***

### addOpenApiErrorStatusCodes()

> **addOpenApiErrorStatusCodes**(...`codes`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:586](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L586)

#### Parameters

##### codes

...[`StatusCode`](../enumerations/StatusCode.md)[]

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### addOpenApiTags()

> **addOpenApiTags**(...`tags`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:576](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L576)

#### Parameters

##### tags

...`string`[]

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### addParameterSchema()

> **addParameterSchema**\<`ParamsSchema`\>(`parameterSchema`): `StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `ParamsSchema`, `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:456](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L456)

#### Type Parameters

##### ParamsSchema

`ParamsSchema` *extends* [`Schema`](../type-aliases/Schema.md)

#### Parameters

##### parameterSchema

`ParamsSchema`

#### Returns

`StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `ParamsSchema`, `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>\>

***

### addPayloadSchema()

> **addPayloadSchema**\<`PayloadSchema`\>(`inputSchema`, `inputContentType?`, `inputContentEncoding?`): `StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`PayloadSchema`, `C`\[`"ParamsSchema"`\], `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:431](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L431)

#### Type Parameters

##### PayloadSchema

`PayloadSchema` *extends* [`Schema`](../type-aliases/Schema.md)

#### Parameters

##### inputSchema

`PayloadSchema`

##### inputContentType?

`string`

##### inputContentEncoding?

`string`

#### Returns

`StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`PayloadSchema`, `C`\[`"ParamsSchema"`\], `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>\>

***

### addQueryParameters()

> **addQueryParameters**(...`queryParams`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:591](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L591)

#### Parameters

##### queryParams

...[`QueryParameter`](../type-aliases/QueryParameter.md)\<[`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>\>[]

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### canConsumeStream()

> **canConsumeStream**\<`Chunk`, `Final`, `Payload`, `Parameter`, `SName`, `Version`, `Fname`\>(`serviceName`, `serviceVersion`, `serviceTarget`, `chunkSchema?`, `payloadSchema?`, `parameterSchema?`, `finalSchema?`, `validateChunk?`, `validateFinal?`): `StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\] & `Record`\<`SName`, `Record`\<`Version`, `Record`\<`Fname`, (`payload`, `parameter`) => `Promise`\<\{ `sessionId`: `string`; `[asyncIterator]`: `AsyncIterator`\<\{ `payload`: ...; \}\>; `cancel`: `Promise`\<`void`\>; \}\>\>\>\>, `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:207](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L207)

#### Type Parameters

##### Chunk

`Chunk` *extends* [`Schema`](../type-aliases/Schema.md)

##### Final

`Final` *extends* [`Schema`](../type-aliases/Schema.md)

##### Payload

`Payload` *extends* [`Schema`](../type-aliases/Schema.md)

##### Parameter

`Parameter` *extends* [`Schema`](../type-aliases/Schema.md)

##### SName

`SName` *extends* `string` = `string`

##### Version

`Version` *extends* `string` = `string`

##### Fname

`Fname` *extends* `string` = `string`

#### Parameters

##### serviceName

`SName`

##### serviceVersion

`Version`

##### serviceTarget

`Fname`

##### chunkSchema?

`Chunk`

##### payloadSchema?

`Payload`

##### parameterSchema?

`Parameter`

##### finalSchema?

`Final`

##### validateChunk?

`boolean` = `true`

##### validateFinal?

`boolean` = `true`

#### Returns

`StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\] & `Record`\<`SName`, `Record`\<`Version`, `Record`\<`Fname`, (`payload`, `parameter`) => `Promise`\<\{ `sessionId`: `string`; `[asyncIterator]`: `AsyncIterator`\<\{ `payload`: ...; \}\>; `cancel`: `Promise`\<`void`\>; \}\>\>\>\>, `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>\>

***

### canEmit()

> **canEmit**\<`EventName`, `T`\>(`eventName`, `schema`): `StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\] & `Record`\<`EventName`, [`InferIn`](../type-aliases/InferIn.md)\<`T`\>\>, `C`\[`"QueueInvokes"`\]\>\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:288](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L288)

#### Type Parameters

##### EventName

`EventName` *extends* `string`

##### T

`T` *extends* [`Schema`](../type-aliases/Schema.md)

#### Parameters

##### eventName

`EventName`

##### schema

`T`

#### Returns

`StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\] & `Record`\<`EventName`, [`InferIn`](../type-aliases/InferIn.md)\<`T`\>\>, `C`\[`"QueueInvokes"`\]\>\>

***

### canEnqueue()

> **canEnqueue**\<`Payload`, `Parameter`, `QueueName`\>(`queueName`, `payloadSchema?`, `parameterSchema?`): `StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\] & `Record`\<`QueueName`, (`payload`, `parameter`, `options?`) => `Promise`\<[`QueueEnqueueResult`](../type-aliases/QueueEnqueueResult.md)\>\>\>\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:117](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L117)

#### Type Parameters

##### Payload

`Payload` *extends* [`Schema`](../type-aliases/Schema.md)

##### Parameter

`Parameter` *extends* [`Schema`](../type-aliases/Schema.md)

##### QueueName

`QueueName` *extends* `string` = `string`

#### Parameters

##### queueName

`QueueName`

##### payloadSchema?

`Payload`

##### parameterSchema?

`Parameter`

#### Returns

`StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\] & `Record`\<`QueueName`, (`payload`, `parameter`, `options?`) => `Promise`\<[`QueueEnqueueResult`](../type-aliases/QueueEnqueueResult.md)\>\>\>\>

***

### canInvoke()

> **canInvoke**\<`Output`, `Payload`, `Parameter`, `SName`, `Version`, `Fname`\>(`serviceName`, `serviceVersion`, `serviceTarget`, `outputSchema?`, `payloadSchema?`, `parameterSchema?`): `StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\] & `Record`\<`SName`, `Record`\<`Version`, `Record`\<`Fname`, (`payload`, `parameter`) => `Promise`\<[`Infer`](../type-aliases/Infer.md)\<`Output`\>\>\>\>\>, `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:158](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L158)

#### Type Parameters

##### Output

`Output` *extends* [`Schema`](../type-aliases/Schema.md)

##### Payload

`Payload` *extends* [`Schema`](../type-aliases/Schema.md)

##### Parameter

`Parameter` *extends* [`Schema`](../type-aliases/Schema.md)

##### SName

`SName` *extends* `string` = `string`

##### Version

`Version` *extends* `string` = `string`

##### Fname

`Fname` *extends* `string` = `string`

#### Parameters

##### serviceName

`SName`

##### serviceVersion

`Version`

##### serviceTarget

`Fname`

##### outputSchema?

`Output`

##### payloadSchema?

`Payload`

##### parameterSchema?

`Parameter`

#### Returns

`StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\] & `Record`\<`SName`, `Record`\<`Version`, `Record`\<`Fname`, (`payload`, `parameter`) => `Promise`\<[`Infer`](../type-aliases/Infer.md)\<`Output`\>\>\>\>\>, `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>\>

***

### enableChunkAggregation()

> **enableChunkAggregation**(`enabled?`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:517](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L517)

#### Parameters

##### enabled?

`boolean` = `true`

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### enableHttpSecurity()

> **enableHttpSecurity**(`enabled?`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:566](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L566)

#### Parameters

##### enabled?

`boolean` = `true`

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### exposeAsHttpStreamEndpoint()

> **exposeAsHttpStreamEndpoint**(`method`, `path`, `contentTypeRequest?`, `contentEncodingRequest?`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:527](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L527)

#### Parameters

##### method

[`SupportedHttpMethod`](../type-aliases/SupportedHttpMethod.md)

##### path

`string`

##### contentTypeRequest?

`string`

##### contentEncodingRequest?

`string`

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### getAfterGuardHook()

> **getAfterGuardHook**(`name`): [`StreamAfterGuardHook`](../type-aliases/StreamAfterGuardHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:415](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L415)

Return a previously registered after-guard hook by name.

#### Parameters

##### name

`string`

#### Returns

[`StreamAfterGuardHook`](../type-aliases/StreamAfterGuardHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>

***

### getBeforeGuardHook()

> **getBeforeGuardHook**(`name`): [`StreamBeforeGuardHook`](../type-aliases/StreamBeforeGuardHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:352](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L352)

Return a previously registered before-guard hook by name.

#### Parameters

##### name

`string`

#### Returns

[`StreamBeforeGuardHook`](../type-aliases/StreamBeforeGuardHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>

***

### getDefinition()

> **getDefinition**(): `Promise`\<[`StreamDefinition`](../type-aliases/StreamDefinition.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ChunkSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], [`StreamDefinitionMetadataBase`](../type-aliases/StreamDefinitionMetadataBase.md), `C`\[`"QueueInvokes"`\]\>\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:640](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L640)

#### Returns

`Promise`\<[`StreamDefinition`](../type-aliases/StreamDefinition.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ChunkSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], [`StreamDefinitionMetadataBase`](../type-aliases/StreamDefinitionMetadataBase.md), `C`\[`"QueueInvokes"`\]\>\>

***

### getStreamFunction()

> **getStreamFunction**(): [`StreamFunction`](../type-aliases/StreamFunction.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ChunkSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:617](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L617)

#### Returns

[`StreamFunction`](../type-aliases/StreamFunction.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ChunkSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>

***

### makeEndpointPublic()

> **makeEndpointPublic**(): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:561](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L561)

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### markAsDeprecated()

> **markAsDeprecated**(): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:512](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L512)

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### setAfterGuardHooks()

> **setAfterGuardHooks**(`afterGuards`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:371](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L371)

Set one or more after guard hook(s).
If there are multiple after guard hooks, they are executed in parallel.

#### Parameters

##### afterGuards

`Record`\<`string`, [`StreamAfterGuardHook`](../type-aliases/StreamAfterGuardHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>\>

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### setBeforeGuardHooks()

> **setBeforeGuardHooks**(`beforeGuards`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:310](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L310)

Set one or more before guard hook(s).
If there are multiple before guard hooks, they are executed in parallel.

#### Parameters

##### beforeGuards

`Record`\<`string`, [`StreamBeforeGuardHook`](../type-aliases/StreamBeforeGuardHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>\>

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### setFinalEventName()

> **setFinalEventName**\<`N`\>(`eventName`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:522](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L522)

#### Type Parameters

##### N

`N` *extends* `string`

#### Parameters

##### eventName

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`N`\>

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### setHttpStreamingMode()

> **setHttpStreamingMode**(`mode`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:556](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L556)

#### Parameters

##### mode

`"stream"` | `"aggregate"`

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### setHttpStreamProtocol()

> **setHttpStreamProtocol**(`protocol`, `documentationUrl?`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:548](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L548)

#### Parameters

##### protocol

`string`

##### documentationUrl?

`string`

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### setOpenApiOperationId()

> **setOpenApiOperationId**(`operationId`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:581](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L581)

#### Parameters

##### operationId

`string`

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### setOpenApiSummary()

> **setOpenApiSummary**(`summary`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:571](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L571)

#### Parameters

##### summary

`string`

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### setStreamFunction()

> **setStreamFunction**(`fn`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:596](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L596)

#### Parameters

##### fn

[`StreamFunction`](../type-aliases/StreamFunction.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ChunkSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>
