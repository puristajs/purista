[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / IEmitter

# Interface: IEmitter\<T\>

Defined in: [core/types/GenericEventEmitter.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L11)

## Type Parameters

### T

`T` *extends* [`EventMap`](../type-aliases/EventMap.md)

## Methods

### emit()

> **emit**\<`K`\>(`eventName`, `parameter?`): `void`

Defined in: [core/types/GenericEventEmitter.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L14)

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

***

### off()

> **off**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [core/types/GenericEventEmitter.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L13)

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

***

### on()

> **on**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [core/types/GenericEventEmitter.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L12)

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
