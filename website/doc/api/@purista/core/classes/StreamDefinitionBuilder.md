[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StreamDefinitionBuilder

# Class: StreamDefinitionBuilder\<S, C\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:38](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L38)

## Type Parameters

### S

`S` *extends* [`Service`](Service.md)

### C

`C` *extends* [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md) = [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)

## Constructors

### Constructor

> **new StreamDefinitionBuilder**\<`S`, `C`\>(`streamName`, `streamDescription`, `finalEventName?`, `deprecated?`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:90](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L90)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:422](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L422)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:441](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L441)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:529](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L529)

#### Parameters

##### codes

...[`StatusCode`](../enumerations/StatusCode.md)[]

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### addOpenApiTags()

> **addOpenApiTags**(...`tags`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:519](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L519)

#### Parameters

##### tags

...`string`[]

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### addParameterSchema()

> **addParameterSchema**\<`ParamsSchema`\>(`parameterSchema`): `StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `ParamsSchema`, `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:404](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L404)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:379](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L379)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:534](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L534)

#### Parameters

##### queryParams

...[`QueryParameter`](../type-aliases/QueryParameter.md)\<[`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>\>[]

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### canConsumeStream()

> **canConsumeStream**\<`Chunk`, `Final`, `Payload`, `Parameter`, `SName`, `Version`, `Fname`\>(`serviceName`, `serviceVersion`, `serviceTarget`, `chunkSchema?`, `payloadSchema?`, `parameterSchema?`, `finalSchema?`, `validateChunk?`, `validateFinal?`): `StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\] & `Record`\<`SName`, `Record`\<`Version`, `Record`\<`Fname`, (`payload`, `parameter`) => `Promise`\<\{ `sessionId`: `string`; `[asyncIterator]`: `AsyncIterator`\<\{ `payload`: ...; \}\>; `cancel`: `Promise`\<`void`\>; \}\>\>\>\>, `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:195](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L195)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:361](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L361)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:100](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L100)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:141](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L141)

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

> **canInvokeAgent**\<`Payload`, `Parameter`, `SName`, `Version`\>(`agentName`, `agentVersion`, `invokeConfigOrParameterSchema?`): `StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\] & `Record`\<`SName`, `Record`\<`Version`, \{ `call`: (`payload`, `parameter?`) => [`AgentInvocation`](../interfaces/AgentInvocation.md)\<\{ `history`: `any`[]; `message`: `any`; \}\>; \}\>\>\>\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:291](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L291)

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

##### agentVersion

`Version`

The version of the agent service

##### invokeConfigOrParameterSchema?

Optional invoke configuration:
- `parameterSchema` (legacy shorthand) validates `.call(_, parameter)`
- `{ payloadSchema, parameterSchema }` validates both `.call(payload, parameter)` arguments

`Parameter` | `AgentInvokeConfig`\<`Payload`, `Parameter`\>

#### Returns

`StreamDefinitionBuilder`\<`S`, [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"ChunkSchema"`\], `C`\[`"FinalSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\] & `Record`\<`SName`, `Record`\<`Version`, \{ `call`: (`payload`, `parameter?`) => [`AgentInvocation`](../interfaces/AgentInvocation.md)\<\{ `history`: `any`[]; `message`: `any`; \}\>; \}\>\>\>\>

***

### enableChunkAggregation()

> **enableChunkAggregation**(`enabled?`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:460](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L460)

#### Parameters

##### enabled?

`boolean` = `true`

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### enableHttpSecurity()

> **enableHttpSecurity**(`enabled?`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:509](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L509)

#### Parameters

##### enabled?

`boolean` = `true`

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### exposeAsHttpStreamEndpoint()

> **exposeAsHttpStreamEndpoint**(`method`, `path`, `contentTypeRequest?`, `contentEncodingRequest?`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:470](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L470)

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

### getDefinition()

> **getDefinition**(): `Promise`\<[`StreamDefinition`](../type-aliases/StreamDefinition.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ChunkSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], [`StreamDefinitionMetadataBase`](../type-aliases/StreamDefinitionMetadataBase.md), `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:595](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L595)

#### Returns

`Promise`\<[`StreamDefinition`](../type-aliases/StreamDefinition.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ChunkSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], [`StreamDefinitionMetadataBase`](../type-aliases/StreamDefinitionMetadataBase.md), `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>\>

***

### getStreamContextMock()

> **getStreamContextMock**(`_input`): `object`

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:585](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L585)

#### Parameters

##### \_input

###### resources?

`Partial`\<`C`\[`"Resources"`\]\>

###### sandbox?

`SinonSandbox`

###### writer?

`Partial`\<[`StreamWriter`](../interfaces/StreamWriter.md)\<`unknown`, `unknown`\>\>

#### Returns

`object`

***

### getStreamFunction()

> **getStreamFunction**(): [`StreamFunction`](../type-aliases/StreamFunction.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ChunkSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:561](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L561)

#### Returns

[`StreamFunction`](../type-aliases/StreamFunction.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ChunkSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>

***

### makeEndpointPublic()

> **makeEndpointPublic**(): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:504](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L504)

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### setFinalEventName()

> **setFinalEventName**\<`N`\>(`eventName`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:465](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L465)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:499](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L499)

#### Parameters

##### mode

`"stream"` | `"aggregate"`

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### setHttpStreamProtocol()

> **setHttpStreamProtocol**(`protocol`, `documentationUrl?`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:491](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L491)

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

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:524](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L524)

#### Parameters

##### operationId

`string`

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### setOpenApiSummary()

> **setOpenApiSummary**(`summary`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:514](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L514)

#### Parameters

##### summary

`string`

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>

***

### setStreamFunction()

> **setStreamFunction**(`fn`): `StreamDefinitionBuilder`\<`S`, `C`\>

Defined in: [StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:539](https://github.com/puristajs/purista/blob/master/packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts#L539)

#### Parameters

##### fn

[`StreamFunction`](../type-aliases/StreamFunction.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ChunkSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"FinalSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>

#### Returns

`StreamDefinitionBuilder`\<`S`, `C`\>
