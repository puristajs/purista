[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueBridge

# Interface: QueueBridge

Defined in: [core/QueueBridge/types/QueueBridge.ts:10](https://github.com/puristajs/purista/blob/master/packages/core/src/core/QueueBridge/types/QueueBridge.ts#L10)

## Properties

### capabilities

> `readonly` **capabilities**: [`QueueBridgeCapabilities`](../type-aliases/QueueBridgeCapabilities.md)

Defined in: [core/QueueBridge/types/QueueBridge.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/QueueBridge/types/QueueBridge.ts#L13)

***

### instanceId

> `readonly` **instanceId**: `string`

Defined in: [core/QueueBridge/types/QueueBridge.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/QueueBridge/types/QueueBridge.ts#L12)

***

### name

> `readonly` **name**: `string`

Defined in: [core/QueueBridge/types/QueueBridge.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/QueueBridge/types/QueueBridge.ts#L11)

## Methods

### ack()

> **ack**(`queueName`, `leaseId`): `Promise`\<`void`\>

Defined in: [core/QueueBridge/types/QueueBridge.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/QueueBridge/types/QueueBridge.ts#L23)

#### Parameters

##### queueName

`string`

##### leaseId

`string`

#### Returns

`Promise`\<`void`\>

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/QueueBridge/types/QueueBridge.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/core/QueueBridge/types/QueueBridge.ts#L18)

#### Returns

`Promise`\<`void`\>

***

### enqueue()

> **enqueue**(`options`): `Promise`\<[`QueueEnqueueResult`](../type-aliases/QueueEnqueueResult.md)\>

Defined in: [core/QueueBridge/types/QueueBridge.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/QueueBridge/types/QueueBridge.ts#L20)

#### Parameters

##### options

[`QueueEnqueueOptions`](../type-aliases/QueueEnqueueOptions.md)\<`unknown`, `unknown`\>

#### Returns

`Promise`\<[`QueueEnqueueResult`](../type-aliases/QueueEnqueueResult.md)\>

***

### extendLease()

> **extendLease**(`queueName`, `leaseId`, `extensionMs`): `Promise`\<`void`\>

Defined in: [core/QueueBridge/types/QueueBridge.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/QueueBridge/types/QueueBridge.ts#L22)

#### Parameters

##### queueName

`string`

##### leaseId

`string`

##### extensionMs

`number`

#### Returns

`Promise`\<`void`\>

***

### isHealthy()

> **isHealthy**(): `Promise`\<`boolean`\>

Defined in: [core/QueueBridge/types/QueueBridge.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/core/QueueBridge/types/QueueBridge.ts#L17)

#### Returns

`Promise`\<`boolean`\>

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [core/QueueBridge/types/QueueBridge.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/QueueBridge/types/QueueBridge.ts#L16)

#### Returns

`Promise`\<`boolean`\>

***

### leaseNext()

> **leaseNext**(`queueName`, `options?`): `Promise`\<[`QueueLease`](../type-aliases/QueueLease.md) \| `undefined`\>

Defined in: [core/QueueBridge/types/QueueBridge.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/QueueBridge/types/QueueBridge.ts#L21)

#### Parameters

##### queueName

`string`

##### options?

[`QueueLeaseOptions`](../type-aliases/QueueLeaseOptions.md)

#### Returns

`Promise`\<[`QueueLease`](../type-aliases/QueueLease.md) \| `undefined`\>

***

### metrics()

> **metrics**(`queueName`): `Promise`\<[`QueueMetrics`](../type-aliases/QueueMetrics.md)\>

Defined in: [core/QueueBridge/types/QueueBridge.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/QueueBridge/types/QueueBridge.ts#L26)

#### Parameters

##### queueName

`string`

#### Returns

`Promise`\<[`QueueMetrics`](../type-aliases/QueueMetrics.md)\>

***

### moveToDeadLetter()

> **moveToDeadLetter**(`queueName`, `message`, `reason?`): `Promise`\<`void`\>

Defined in: [core/QueueBridge/types/QueueBridge.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/QueueBridge/types/QueueBridge.ts#L25)

#### Parameters

##### queueName

`string`

##### message

[`QueueMessage`](../type-aliases/QueueMessage.md)

##### reason?

`string`

#### Returns

`Promise`\<`void`\>

***

### nack()

> **nack**(`queueName`, `leaseId`, `request`): `Promise`\<`void`\>

Defined in: [core/QueueBridge/types/QueueBridge.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/QueueBridge/types/QueueBridge.ts#L24)

#### Parameters

##### queueName

`string`

##### leaseId

`string`

##### request

[`QueueRetryRequest`](../type-aliases/QueueRetryRequest.md)

#### Returns

`Promise`\<`void`\>

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [core/QueueBridge/types/QueueBridge.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/QueueBridge/types/QueueBridge.ts#L15)

#### Returns

`Promise`\<`void`\>
