[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionStorageEntry

# Type Alias: SubscriptionStorageEntry

> **SubscriptionStorageEntry**: `object`

Defined in: [packages/core/src/DefaultEventBridge/types/SubscriptionStorageEntry.ts:3](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L3)

## Type declaration

### cb()

> **cb**: (`message`) => `Promise`\<`Omit`\<[`CustomMessage`](CustomMessage.md), `"id"` \| `"timestamp"`\> \| `undefined`\>

#### Parameters

##### message

[`EBMessage`](EBMessage.md)

#### Returns

`Promise`\<`Omit`\<[`CustomMessage`](CustomMessage.md), `"id"` \| `"timestamp"`\> \| `undefined`\>

### emitEventName?

> `optional` **emitEventName**: `string`

### isMatchingEventName()

#### Parameters

##### input?

`string`

#### Returns

`boolean`

### isMatchingMessageType()

#### Parameters

##### input

[`EBMessageType`](../enumerations/EBMessageType.md)

#### Returns

`boolean`

### isMatchingPrincipalId()

#### Parameters

##### input?

`string`

#### Returns

`boolean`

### isMatchingReceiverInstanceId()

#### Parameters

##### input?

`string`

#### Returns

`boolean`

### isMatchingReceiverServiceName()

#### Parameters

##### input?

`string`

#### Returns

`boolean`

### isMatchingReceiverServiceTarget()

#### Parameters

##### input?

`string`

#### Returns

`boolean`

### isMatchingReceiverServiceVersion()

#### Parameters

##### input?

`string`

#### Returns

`boolean`

### isMatchingSenderInstanceId()

#### Parameters

##### input?

`string`

#### Returns

`boolean`

### isMatchingSenderServiceName()

#### Parameters

##### input?

`string`

#### Returns

`boolean`

### isMatchingSenderServiceTarget()

#### Parameters

##### input?

`string`

#### Returns

`boolean`

### isMatchingSenderServiceVersion()

#### Parameters

##### input?

`string`

#### Returns

`boolean`

### isMatchingTenantId()

#### Parameters

##### input?

`string`

#### Returns

`boolean`
