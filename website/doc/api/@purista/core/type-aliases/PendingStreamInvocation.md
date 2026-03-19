[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / PendingStreamInvocation

# Type Alias: PendingStreamInvocation\<Chunk, Final\>

> **PendingStreamInvocation**\<`Chunk`, `Final`\> = `object`

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:56](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L56)

## Type Parameters

### Chunk

`Chunk` = `unknown`

### Final

`Final` = `unknown`

## Properties

### push()

> **push**: (`frame`) => `void`

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:57](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L57)

#### Parameters

##### frame

[`StreamFrame`](StreamFrame.md)\<`Chunk`, `Final`\>

#### Returns

`void`

***

### reject()

> **reject**: (`error`) => `void`

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:58](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L58)

#### Parameters

##### error

`unknown`

#### Returns

`void`

***

### setOwnerInstanceId()

> **setOwnerInstanceId**: (`instanceId`) => `Promise`\<`void`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:59](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L59)

#### Parameters

##### instanceId

`string`

#### Returns

`Promise`\<`void`\>
