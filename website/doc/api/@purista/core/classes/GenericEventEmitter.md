[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / GenericEventEmitter

# Class: GenericEventEmitter\<T\>

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L14)

## Extended by

- [`EventBridgeBaseClass`](EventBridgeBaseClass.md)
- [`ClientBuilder`](ClientBuilder.md)

## Type Parameters

• **T** *extends* [`EventMap`](../type-aliases/EventMap.md)

## Implements

- [`IEmitter`](../interfaces/IEmitter.md)\<`T`\>

## Constructors

### new GenericEventEmitter()

> **new GenericEventEmitter**\<`T`\>(): [`GenericEventEmitter`](GenericEventEmitter.md)\<`T`\>

#### Returns

[`GenericEventEmitter`](GenericEventEmitter.md)\<`T`\>

## Methods

### emit()

> **emit**\<`K`\>(`eventName`, `parameter`?): `void`

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L24)

#### Type Parameters

• **K** *extends* `string`

#### Parameters

##### eventName

`K`

##### parameter?

`T`\[`K`\]

#### Returns

`void`

#### Implementation of

[`IEmitter`](../interfaces/IEmitter.md).[`emit`](../interfaces/IEmitter.md#emit)

***

### off()

> **off**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L20)

#### Type Parameters

• **K** *extends* `string`

#### Parameters

##### eventName

`K`

##### fn

`EventReceiver`\<`T`\[`K`\]\>

#### Returns

`void`

#### Implementation of

[`IEmitter`](../interfaces/IEmitter.md).[`off`](../interfaces/IEmitter.md#off)

***

### on()

> **on**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L16)

#### Type Parameters

• **K** *extends* `string`

#### Parameters

##### eventName

`K`

##### fn

`EventReceiver`\<`T`\[`K`\]\>

#### Returns

`void`

#### Implementation of

[`IEmitter`](../interfaces/IEmitter.md).[`on`](../interfaces/IEmitter.md#on)

***

### removeAllListeners()

> **removeAllListeners**(): `void`

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L28)

#### Returns

`void`
