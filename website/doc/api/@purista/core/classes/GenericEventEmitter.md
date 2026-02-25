[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / GenericEventEmitter

# Class: GenericEventEmitter\<T\>

Defined in: [core/types/GenericEventEmitter.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L17)

## Extended by

- [`ClientBuilder`](ClientBuilder.md)
- [`EventBridgeBaseClass`](EventBridgeBaseClass.md)

## Type Parameters

### T

`T` *extends* [`EventMap`](../type-aliases/EventMap.md)

## Implements

- [`IEmitter`](../interfaces/IEmitter.md)\<`T`\>

## Constructors

### Constructor

> **new GenericEventEmitter**\<`T`\>(): `GenericEventEmitter`\<`T`\>

#### Returns

`GenericEventEmitter`\<`T`\>

## Methods

### emit()

> **emit**\<`K`\>(`eventName`, `parameter?`): `void`

Defined in: [core/types/GenericEventEmitter.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L27)

#### Type Parameters

##### K

`K` *extends* `string`

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

Defined in: [core/types/GenericEventEmitter.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L23)

#### Type Parameters

##### K

`K` *extends* `string`

#### Parameters

##### eventName

`K`

##### fn

[`EventReceiver`](../type-aliases/EventReceiver.md)\<`T`\[`K`\]\>

#### Returns

`void`

#### Implementation of

[`IEmitter`](../interfaces/IEmitter.md).[`off`](../interfaces/IEmitter.md#off)

***

### on()

> **on**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [core/types/GenericEventEmitter.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L19)

#### Type Parameters

##### K

`K` *extends* `string`

#### Parameters

##### eventName

`K`

##### fn

[`EventReceiver`](../type-aliases/EventReceiver.md)\<`T`\[`K`\]\>

#### Returns

`void`

#### Implementation of

[`IEmitter`](../interfaces/IEmitter.md).[`on`](../interfaces/IEmitter.md#on)

***

### removeAllListeners()

> **removeAllListeners**(): `void`

Defined in: [core/types/GenericEventEmitter.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L31)

#### Returns

`void`
