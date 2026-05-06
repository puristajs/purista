[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionContextMockResult

# Type Alias: SubscriptionContextMockResult\<TBuilder\>

> **SubscriptionContextMockResult**\<`TBuilder`\> = `object`

Defined in: [testing/createSubscriptionContextMock.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createSubscriptionContextMock.ts#L27)

## Type Parameters

### TBuilder

`TBuilder` *extends* [`SubscriptionDefinitionBuilder`](../classes/SubscriptionDefinitionBuilder.md)\<`any`, `any`\>

## Properties

### context

> **context**: [`SubscriptionFunctionContext`](SubscriptionFunctionContext.md)\<[`SubscriptionContextMockBuilderTypes`](SubscriptionContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Resources"`\], [`SubscriptionContextMockBuilderTypes`](SubscriptionContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Invokes"`\], [`SubscriptionContextMockBuilderTypes`](SubscriptionContextMockBuilderTypes.md)\<`TBuilder`\>\[`"StreamInvokes"`\], [`SubscriptionContextMockBuilderTypes`](SubscriptionContextMockBuilderTypes.md)\<`TBuilder`\>\[`"EmitList"`\], [`SubscriptionContextMockBuilderTypes`](SubscriptionContextMockBuilderTypes.md)\<`TBuilder`\>\[`"QueueInvokes"`\]\>

Defined in: [testing/createSubscriptionContextMock.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createSubscriptionContextMock.ts#L28)

***

### mock

> **mock**: [`SubscriptionFunctionContext`](SubscriptionFunctionContext.md)\<[`SubscriptionContextMockBuilderTypes`](SubscriptionContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Resources"`\], [`SubscriptionContextMockBuilderTypes`](SubscriptionContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Invokes"`\], [`SubscriptionContextMockBuilderTypes`](SubscriptionContextMockBuilderTypes.md)\<`TBuilder`\>\[`"StreamInvokes"`\], [`SubscriptionContextMockBuilderTypes`](SubscriptionContextMockBuilderTypes.md)\<`TBuilder`\>\[`"EmitList"`\], [`SubscriptionContextMockBuilderTypes`](SubscriptionContextMockBuilderTypes.md)\<`TBuilder`\>\[`"QueueInvokes"`\]\>

Defined in: [testing/createSubscriptionContextMock.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createSubscriptionContextMock.ts#L35)

***

### stubs

> **stubs**: `object`

Defined in: [testing/createSubscriptionContextMock.ts:42](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createSubscriptionContextMock.ts#L42)

#### emit

> **emit**: [`FromEmitToOtherType`](FromEmitToOtherType.md)\<[`SubscriptionContextMockBuilderTypes`](SubscriptionContextMockBuilderTypes.md)\<`TBuilder`\>\[`"EmitList"`\], `SinonStub`\>

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

> **resources**: `Partial`\<[`SubscriptionContextMockBuilderTypes`](SubscriptionContextMockBuilderTypes.md)\<`TBuilder`\>\[`"Resources"`\]\>

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
