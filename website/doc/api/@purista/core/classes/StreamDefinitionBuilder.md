[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StreamDefinitionBuilder

# Class: StreamDefinitionBuilder\<S, C\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:51](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L51)

## Type Parameters

### S

`S` *extends* [`Service`](Service.md)

### C

`C` *extends* [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md) = [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)

## Constructors

### Constructor

> **new StreamDefinitionBuilder**\<`S`, `C`\>(`streamName`, `streamDescription`, `finalEventName?`, `deprecated?`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:129](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L129)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:585](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L585)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:604](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L604)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:697](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L697)

#### Parameters

##### codes

...[`StatusCode`](../enumerations/StatusCode.md)[]

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### addOpenApiTags()

> **addOpenApiTags**(...`tags`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:687](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L687)

#### Parameters

##### tags

...`string`[]

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### addParameterSchema()

> **addParameterSchema**\<`ParamsSchema`\>(`parameterSchema`): `StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `ParamsSchema`, `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:567](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L567)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:542](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L542)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:702](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L702)

#### Parameters

##### queryParams

...[`QueryParameter`](../type-aliases/QueryParameter.md)\<[`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>\>[]

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### canConsumeStream()

> **canConsumeStream**\<`Chunk`, `Final`, `Payload`, `Parameter`, `SName`, `Version`, `Fname`\>(`serviceName`, `serviceVersion`, `serviceTarget`, `chunkSchema?`, `payloadSchema?`, `parameterSchema?`, `finalSchema?`, `validateChunk?`, `validateFinal?`): `StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\] & `Record`\<`SName`, `Record`\<`Version`, `Record`\<`Fname`, (`payload`, `parameter`) => `Promise`\<\{ `sessionId`: `string`; `[asyncIterator]`: `AsyncIterator`\<\{ `payload`: ...; \}\>; `cancel`: `Promise`\<`void`\>; \}\>\>\>\>, `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:229](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L229)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:393](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L393)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:139](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L139)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:180](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L180)

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

### canInvokeAgent()

> **canInvokeAgent**\<`Payload`, `Parameter`, `SName`, `Version`\>(`agentName`, `serviceVersion`, `invokeConfigOrParameterSchema?`): `StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\] & `Record`\<`SName`, `Record`\<`Version`, \{ `call`: (`payload`, `parameter?`) => [`AgentInvocation`](../interfaces/AgentInvocation.md)\<\{ `history`: `any`[]; `message`: `any`; \}\>; \}\>\>\>\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:321](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L321)

Define an agent which can be invoked by the current stream.
The agent must follow the PURISTA agent protocol.

#### Type Parameters

##### Payload

`Payload` *extends* [`Schema`](../type-aliases/Schema.md) = `ZodObject`\<\{ `attachments`: `ZodDefault`\<`ZodOptional`\<`ZodArray`\<`ZodAny`\>\>\>; `conversationId`: `ZodOptional`\<`ZodString`\>; `history`: `ZodDefault`\<`ZodOptional`\<`ZodArray`\<`ZodAny`\>\>\>; `message`: `ZodString`; \}, `$loose`\>

##### Parameter

`Parameter` *extends* [`Schema`](../type-aliases/Schema.md) = [`Schema`](../type-aliases/Schema.md)

##### SName

`SName` *extends* `string` = `string`

##### Version

`Version` *extends* `string` = `string`

#### Parameters

##### agentName

`SName`

The name of the agent service

##### serviceVersion

`Version`

The version of the agent service

##### invokeConfigOrParameterSchema?

Optional invoke configuration:
- `parameterSchema` (legacy shorthand) validates `.call(_, parameter)`
- `{ payloadSchema, parameterSchema, outputSchema }` validates `.call(payload, parameter)` arguments
  and declares expected final response envelopes for higher-level helpers.

`Parameter` | [`StreamAgentInvokeConfig`](../type-aliases/StreamAgentInvokeConfig.md)\<`Payload`, `Parameter`\>

#### Returns

`StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\] & `Record`\<`SName`, `Record`\<`Version`, \{ `call`: (`payload`, `parameter?`) => [`AgentInvocation`](../interfaces/AgentInvocation.md)\<\{ `history`: `any`[]; `message`: `any`; \}\>; \}\>\>\>\>

***

### enableChunkAggregation()

> **enableChunkAggregation**(`enabled?`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:628](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L628)

#### Parameters

##### enabled?

`boolean` = `true`

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### enableHttpSecurity()

> **enableHttpSecurity**(`enabled?`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:677](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L677)

#### Parameters

##### enabled?

`boolean` = `true`

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### exposeAsHttpStreamEndpoint()

> **exposeAsHttpStreamEndpoint**(`method`, `path`, `contentTypeRequest?`, `contentEncodingRequest?`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:638](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L638)

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

> **getAfterGuardHook**(`name`): [`StreamAfterGuardHook`](../type-aliases/StreamAfterGuardHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:525](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L525)

Return a previously registered after-guard hook by name.

#### Parameters

##### name

`string`

#### Returns

[`StreamAfterGuardHook`](../type-aliases/StreamAfterGuardHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>

***

### getBeforeGuardHook()

> **getBeforeGuardHook**(`name`): [`StreamBeforeGuardHook`](../type-aliases/StreamBeforeGuardHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:459](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L459)

Return a previously registered before-guard hook by name.

#### Parameters

##### name

`string`

#### Returns

[`StreamBeforeGuardHook`](../type-aliases/StreamBeforeGuardHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>

***

### getDefinition()

> **getDefinition**(): `Promise`\<[`StreamDefinition`](../type-aliases/StreamDefinition.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ChunkSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], [`StreamDefinitionMetadataBase`](../type-aliases/StreamDefinitionMetadataBase.md), `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:753](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L753)

#### Returns

`Promise`\<[`StreamDefinition`](../type-aliases/StreamDefinition.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ChunkSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], [`StreamDefinitionMetadataBase`](../type-aliases/StreamDefinitionMetadataBase.md), `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>\>

***

### getStreamFunction()

> **getStreamFunction**(): [`StreamFunction`](../type-aliases/StreamFunction.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ChunkSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:729](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L729)

#### Returns

[`StreamFunction`](../type-aliases/StreamFunction.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ChunkSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>

***

### makeEndpointPublic()

> **makeEndpointPublic**(): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:672](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L672)

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### markAsDeprecated()

> **markAsDeprecated**(): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:623](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L623)

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### setAfterGuardHooks()

> **setAfterGuardHooks**(`afterGuards`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:479](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L479)

Set one or more after guard hook(s).
If there are multiple after guard hooks, they are executed in parallel.

#### Parameters

##### afterGuards

`Record`\<`string`, [`StreamAfterGuardHook`](../type-aliases/StreamAfterGuardHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>\>

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### setBeforeGuardHooks()

> **setBeforeGuardHooks**(`beforeGuards`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:415](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L415)

Set one or more before guard hook(s).
If there are multiple before guard hooks, they are executed in parallel.

#### Parameters

##### beforeGuards

`Record`\<`string`, [`StreamBeforeGuardHook`](../type-aliases/StreamBeforeGuardHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>\>

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### setFinalEventName()

> **setFinalEventName**\<`N`\>(`eventName`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:633](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L633)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:667](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L667)

#### Parameters

##### mode

`"stream"` | `"aggregate"`

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### setHttpStreamProtocol()

> **setHttpStreamProtocol**(`protocol`, `documentationUrl?`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:659](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L659)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:692](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L692)

#### Parameters

##### operationId

`string`

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### setOpenApiSummary()

> **setOpenApiSummary**(`summary`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:682](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L682)

#### Parameters

##### summary

`string`

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### setStreamFunction()

> **setStreamFunction**(`fn`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:707](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L707)

#### Parameters

##### fn

[`StreamFunction`](../type-aliases/StreamFunction.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ChunkSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>
