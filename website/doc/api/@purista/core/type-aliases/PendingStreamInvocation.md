[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / PendingStreamInvocation

# Type Alias: PendingStreamInvocation\<Chunk, Final\>

> **PendingStreamInvocation**\<`Chunk`, `Final`\> = `object`

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:52](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L52)

## Type Parameters

### Chunk

`Chunk` = `unknown`

### Final

`Final` = `unknown`

## Properties

### push()

> **push**: (`frame`) => `void`

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:53](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L53)

#### Parameters

##### frame

[`StreamFrame`](StreamFrame.md)\<`Chunk`, `Final`\>

#### Returns

`void`

***

### reject()

> **reject**: (`error`) => `void`

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:54](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L54)

#### Parameters

##### error

`unknown`

#### Returns

`void`

***

### setOwnerInstanceId()

> **setOwnerInstanceId**: (`instanceId`) => `Promise`\<`void`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:55](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L55)

#### Parameters

##### instanceId

`string`

#### Returns

`Promise`\<`void`\>
