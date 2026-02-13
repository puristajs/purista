[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionStorageEntry

# Type Alias: SubscriptionStorageEntry

> **SubscriptionStorageEntry** = `object`

Defined in: [DefaultEventBridge/types/SubscriptionStorageEntry.ts:9](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L9)

## Properties

### cb()

> **cb**: (`message`) => `Promise`\<`Omit`\<[`CustomMessage`](CustomMessage.md), `"id"` \| `"timestamp"`\> \| `undefined`\>

Defined in: [DefaultEventBridge/types/SubscriptionStorageEntry.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L23)

#### Parameters

##### message

[`EBMessage`](EBMessage.md)

#### Returns

`Promise`\<`Omit`\<[`CustomMessage`](CustomMessage.md), `"id"` \| `"timestamp"`\> \| `undefined`\>

***

### emitEventName?

> `optional` **emitEventName**: `string`

Defined in: [DefaultEventBridge/types/SubscriptionStorageEntry.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L22)

## Methods

### isMatchingEventName()

> **isMatchingEventName**(`input?`): `boolean`

Defined in: [DefaultEventBridge/types/SubscriptionStorageEntry.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L19)

#### Parameters

##### input?

`string`

#### Returns

`boolean`

***

### isMatchingMessageType()

> **isMatchingMessageType**(`input`): `boolean`

Defined in: [DefaultEventBridge/types/SubscriptionStorageEntry.ts:10](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L10)

#### Parameters

##### input

[`EBMessageType`](../enumerations/EBMessageType.md)

#### Returns

`boolean`

***

### isMatchingPrincipalId()

> **isMatchingPrincipalId**(`input?`): `boolean`

Defined in: [DefaultEventBridge/types/SubscriptionStorageEntry.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L20)

#### Parameters

##### input?

`string`

#### Returns

`boolean`

***

### isMatchingReceiverInstanceId()

> **isMatchingReceiverInstanceId**(`input?`): `boolean`

Defined in: [DefaultEventBridge/types/SubscriptionStorageEntry.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L18)

#### Parameters

##### input?

`string`

#### Returns

`boolean`

***

### isMatchingReceiverServiceName()

> **isMatchingReceiverServiceName**(`input?`): `boolean`

Defined in: [DefaultEventBridge/types/SubscriptionStorageEntry.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L15)

#### Parameters

##### input?

`string`

#### Returns

`boolean`

***

### isMatchingReceiverServiceTarget()

> **isMatchingReceiverServiceTarget**(`input?`): `boolean`

Defined in: [DefaultEventBridge/types/SubscriptionStorageEntry.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L17)

#### Parameters

##### input?

`string`

#### Returns

`boolean`

***

### isMatchingReceiverServiceVersion()

> **isMatchingReceiverServiceVersion**(`input?`): `boolean`

Defined in: [DefaultEventBridge/types/SubscriptionStorageEntry.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L16)

#### Parameters

##### input?

`string`

#### Returns

`boolean`

***

### isMatchingSenderInstanceId()

> **isMatchingSenderInstanceId**(`input?`): `boolean`

Defined in: [DefaultEventBridge/types/SubscriptionStorageEntry.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L14)

#### Parameters

##### input?

`string`

#### Returns

`boolean`

***

### isMatchingSenderServiceName()

> **isMatchingSenderServiceName**(`input?`): `boolean`

Defined in: [DefaultEventBridge/types/SubscriptionStorageEntry.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L11)

#### Parameters

##### input?

`string`

#### Returns

`boolean`

***

### isMatchingSenderServiceTarget()

> **isMatchingSenderServiceTarget**(`input?`): `boolean`

Defined in: [DefaultEventBridge/types/SubscriptionStorageEntry.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L13)

#### Parameters

##### input?

`string`

#### Returns

`boolean`

***

### isMatchingSenderServiceVersion()

> **isMatchingSenderServiceVersion**(`input?`): `boolean`

Defined in: [DefaultEventBridge/types/SubscriptionStorageEntry.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L12)

#### Parameters

##### input?

`string`

#### Returns

`boolean`

***

### isMatchingTenantId()

> **isMatchingTenantId**(`input?`): `boolean`

Defined in: [DefaultEventBridge/types/SubscriptionStorageEntry.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L21)

#### Parameters

##### input?

`string`

#### Returns

`boolean`
