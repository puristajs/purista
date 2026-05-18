[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CommandContextMockResult

# Type Alias: CommandContextMockResult\<TBuilder\>

> **CommandContextMockResult**\<`TBuilder`\> = `object`

Defined in: [testing/createCommandContextMock.ts:46](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createCommandContextMock.ts#L46)

## Type Parameters

### TBuilder

`TBuilder` *extends* [`CommandDefinitionBuilder`](../classes/CommandDefinitionBuilder.md)\<`any`, `any`\>

## Properties

### context

> **context**: [`CommandFunctionContext`](CommandFunctionContext.md)\<[`GetMessagePayloadType`](GetMessagePayloadType.md)\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"PayloadSchema"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"TransformInputPayloadSchema"`\]\>, [`GetMessageParamsType`](GetMessageParamsType.md)\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"ParamsSchema"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"TransformInputParamsSchema"`\]\>, [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Resources"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Invokes"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"StreamInvokes"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"EmitList"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"QueueInvokes"`\]\>

Defined in: [testing/createCommandContextMock.ts:47](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createCommandContextMock.ts#L47)

***

### mock

> **mock**: [`CommandFunctionContext`](CommandFunctionContext.md)\<[`GetMessagePayloadType`](GetMessagePayloadType.md)\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"PayloadSchema"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"TransformInputPayloadSchema"`\]\>, [`GetMessageParamsType`](GetMessageParamsType.md)\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"ParamsSchema"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"TransformInputParamsSchema"`\]\>, [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Resources"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Invokes"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"StreamInvokes"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"EmitList"`\], [`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"QueueInvokes"`\]\>

Defined in: [testing/createCommandContextMock.ts:62](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createCommandContextMock.ts#L62)

***

### stubs

> **stubs**: `object`

Defined in: [testing/createCommandContextMock.ts:77](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createCommandContextMock.ts#L77)

#### emit

> **emit**: [`FromEmitToOtherType`](FromEmitToOtherType.md)\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"EmitList"`\], `SinonStub`\>

#### enqueue

> **enqueue**: `SinonStub`

#### getConfig

> **getConfig**: `SinonStub`

#### getSecret

> **getSecret**: `SinonStub`

#### getState

> **getState**: `SinonStub`

#### invoke

> **invoke**: `SinonStub`

#### logger

> **logger**: `Record`\<`string`, `SinonStub`\>

#### removeConfig

> **removeConfig**: `SinonStub`

#### removeSecret

> **removeSecret**: `SinonStub`

#### removeState

> **removeState**: `SinonStub`

#### resources

> **resources**: `Partial`\<[`CommandContextMockBuilderTypes`](CommandContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Resources"`\]\>

#### scheduleAt

> **scheduleAt**: `SinonStub`

#### service

> **service**: `Record`\<`string`, `any`\>

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
