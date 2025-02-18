[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / IEmitter

# Interface: IEmitter\<T\>

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:8](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L8)

## Type Parameters

• **T** *extends* [`EventMap`](../type-aliases/EventMap.md)

## Methods

### emit()

> **emit**\<`K`\>(`eventName`, `parameter`?): `void`

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L11)

#### Type Parameters

• **K** *extends* `string`

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

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:10](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L10)

#### Type Parameters

• **K** *extends* `string`

#### Parameters

##### eventName

`K`

##### fn

`EventReceiver`\<`T`\[`K`\]\>

#### Returns

`void`

***

### on()

> **on**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:9](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L9)

#### Type Parameters

• **K** *extends* `string`

#### Parameters

##### eventName

`K`

##### fn

`EventReceiver`\<`T`\[`K`\]\>

#### Returns

`void`
