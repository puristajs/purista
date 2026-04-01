[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / InFlightExecutionTracker

# Class: InFlightExecutionTracker

Defined in: [core/EventBridge/InFlightExecutionTracker.impl.ts:1](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/InFlightExecutionTracker.impl.ts#L1)

## Constructors

### Constructor

> **new InFlightExecutionTracker**(): `InFlightExecutionTracker`

#### Returns

`InFlightExecutionTracker`

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [core/EventBridge/InFlightExecutionTracker.impl.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/InFlightExecutionTracker.impl.ts#L4)

##### Returns

`number`

## Methods

### run()

> **run**\<`T`\>(`fn`): `Promise`\<`T`\>

Defined in: [core/EventBridge/InFlightExecutionTracker.impl.ts:8](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/InFlightExecutionTracker.impl.ts#L8)

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

() => `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>

***

### waitForIdle()

> **waitForIdle**(`timeoutMs`): `Promise`\<`boolean`\>

Defined in: [core/EventBridge/InFlightExecutionTracker.impl.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/InFlightExecutionTracker.impl.ts#L19)

#### Parameters

##### timeoutMs

`number`

#### Returns

`Promise`\<`boolean`\>
