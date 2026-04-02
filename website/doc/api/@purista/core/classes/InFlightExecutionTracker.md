[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / InFlightExecutionTracker

# Class: InFlightExecutionTracker

Defined in: [core/EventBridge/InFlightExecutionTracker.impl.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/InFlightExecutionTracker.impl.ts#L4)

## Constructors

### Constructor

> **new InFlightExecutionTracker**(): `InFlightExecutionTracker`

#### Returns

`InFlightExecutionTracker`

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [core/EventBridge/InFlightExecutionTracker.impl.ts:8](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/InFlightExecutionTracker.impl.ts#L8)

##### Returns

`number`

## Methods

### getCounts()

> **getCounts**(): `InFlightExecutionCounts`

Defined in: [core/EventBridge/InFlightExecutionTracker.impl.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/InFlightExecutionTracker.impl.ts#L30)

#### Returns

`InFlightExecutionCounts`

***

### run()

> **run**\<`T`\>(`fn`, `kind?`): `Promise`\<`T`\>

Defined in: [core/EventBridge/InFlightExecutionTracker.impl.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/InFlightExecutionTracker.impl.ts#L12)

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

() => `Promise`\<`T`\>

##### kind?

[`InFlightExecutionKind`](../type-aliases/InFlightExecutionKind.md) = `'generic'`

#### Returns

`Promise`\<`T`\>

***

### waitForIdle()

> **waitForIdle**(`timeoutMs`): `Promise`\<`boolean`\>

Defined in: [core/EventBridge/InFlightExecutionTracker.impl.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/InFlightExecutionTracker.impl.ts#L43)

#### Parameters

##### timeoutMs

`number`

#### Returns

`Promise`\<`boolean`\>
