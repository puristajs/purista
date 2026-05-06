[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StreamContextMockResult

# Type Alias: StreamContextMockResult\<TBuilder\>

> **StreamContextMockResult**\<`TBuilder`\> = `object`

Defined in: [testing/createStreamContextMock.ts:42](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L42)

## Type Parameters

### TBuilder

`TBuilder` *extends* [`StreamDefinitionBuilder`](../classes/StreamDefinitionBuilder.md)\<`any`, `any`\>

## Properties

### chunks

> **chunks**: [`InferIn`](InferIn.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"ChunkSchema"`\]\>[]

Defined in: [testing/createStreamContextMock.ts:88](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L88)

***

### context

> **context**: [`StreamFunctionContext`](StreamFunctionContext.md)\<[`Infer`](Infer.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"PayloadSchema"`\]\>, [`Infer`](Infer.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"ParamsSchema"`\]\>, [`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Resources"`\], [`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Invokes"`\], [`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"StreamInvokes"`\], [`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"EmitList"`\], [`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"QueueInvokes"`\]\>

Defined in: [testing/createStreamContextMock.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L43)

***

### failedWith

> **failedWith**: `unknown`[]

Defined in: [testing/createStreamContextMock.ts:90](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L90)

***

### finalValue

> **finalValue**: [`InferIn`](InferIn.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"FinalSchema"`\]\> \| `undefined`

Defined in: [testing/createStreamContextMock.ts:89](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L89)

***

### stubs

> **stubs**: `object`

Defined in: [testing/createStreamContextMock.ts:56](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L56)

#### emit

> **emit**: [`FromEmitToOtherType`](FromEmitToOtherType.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"EmitList"`\], `SinonStub`\>

#### enqueue

> **enqueue**: `SinonStub`

#### getConfig

> **getConfig**: `SinonStub`

#### getSecret

> **getSecret**: `SinonStub`

#### getState

> **getState**: `SinonStub`

#### logger

> **logger**: `Record`\<`string`, `SinonStub`\>

#### removeConfig

> **removeConfig**: `SinonStub`

#### removeSecret

> **removeSecret**: `SinonStub`

#### removeState

> **removeState**: `SinonStub`

#### resources

> **resources**: `Partial`\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Resources"`\]\>

#### scheduleAt

> **scheduleAt**: `SinonStub`

#### service

> **service**: [`StreamFunctionContext`](StreamFunctionContext.md)\<[`Infer`](Infer.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"PayloadSchema"`\]\>, [`Infer`](Infer.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"ParamsSchema"`\]\>, [`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Resources"`\], [`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Invokes"`\], [`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"StreamInvokes"`\], [`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"EmitList"`\], [`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"QueueInvokes"`\]\>\[`"service"`\]

#### setConfig

> **setConfig**: `SinonStub`

#### setSecret

> **setSecret**: `SinonStub`

#### setState

> **setState**: `SinonStub`

#### startActiveSpan

> **startActiveSpan**: `SinonStub`

#### wrapInSpan

> **wrapInSpan**: `SinonStub`

#### writer

> **writer**: `object`

##### writer.close

> **close**: `SinonStub`

##### writer.fail

> **fail**: `SinonStub`

##### writer.write

> **write**: `SinonStub`

***

### writer

> **writer**: [`StreamWriter`](../interfaces/StreamWriter.md)\<[`InferIn`](InferIn.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"ChunkSchema"`\]\>, [`InferIn`](InferIn.md)\<[`StreamContextMockBuilderTypes`](StreamContextMockBuilderTypes.md)\<`TBuilder`\>\[`"FinalSchema"`\]\>\>

Defined in: [testing/createStreamContextMock.ts:52](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L52)

## Methods

### cancel()

> **cancel**(`reason?`): `void`

Defined in: [testing/createStreamContextMock.ts:91](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L91)

#### Parameters

##### reason?

`string`

#### Returns

`void`
