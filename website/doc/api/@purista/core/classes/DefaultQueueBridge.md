[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefaultQueueBridge

# Class: DefaultQueueBridge

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L31)

## Implements

- [`QueueBridge`](../interfaces/QueueBridge.md)

## Constructors

### Constructor

> **new DefaultQueueBridge**(`options?`): `DefaultQueueBridge`

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:64](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L64)

#### Parameters

##### options?

[`DefaultQueueBridgeOptions`](../type-aliases/DefaultQueueBridgeOptions.md)

#### Returns

`DefaultQueueBridge`

## Properties

### capabilities

> `readonly` **capabilities**: [`QueueBridgeCapabilities`](../type-aliases/QueueBridgeCapabilities.md)

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:34](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L34)

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`capabilities`](../interfaces/QueueBridge.md#capabilities)

***

### instanceId

> `readonly` **instanceId**: `string`

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:55](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L55)

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`instanceId`](../interfaces/QueueBridge.md#instanceid)

***

### name

> `readonly` **name**: `"DefaultQueueBridge"` = `'DefaultQueueBridge'`

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L32)

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`name`](../interfaces/QueueBridge.md#name)

## Methods

### ack()

> **ack**(`queueName`, `leaseId`): `Promise`\<`void`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:175](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L175)

#### Parameters

##### queueName

`string`

##### leaseId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`ack`](../interfaces/QueueBridge.md#ack)

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:81](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L81)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`destroy`](../interfaces/QueueBridge.md#destroy)

***

### enqueue()

> **enqueue**(`options`): `Promise`\<[`QueueEnqueueResult`](../type-aliases/QueueEnqueueResult.md)\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:87](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L87)

#### Parameters

##### options

[`QueueEnqueueOptions`](../type-aliases/QueueEnqueueOptions.md)\<`unknown`, `unknown`\>

#### Returns

`Promise`\<[`QueueEnqueueResult`](../type-aliases/QueueEnqueueResult.md)\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`enqueue`](../interfaces/QueueBridge.md#enqueue)

***

### extendLease()

> **extendLease**(`queueName`, `leaseId`, `extensionMs`): `Promise`\<`void`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:165](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L165)

#### Parameters

##### queueName

`string`

##### leaseId

`string`

##### extensionMs

`number`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`extendLease`](../interfaces/QueueBridge.md#extendlease)

***

### inspectLeases()

> **inspectLeases**(`_queueName`, `_options?`): `Promise`\<[`QueueLeaseInspectionRecord`](../type-aliases/QueueLeaseInspectionRecord.md)[]\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:264](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L264)

#### Parameters

##### \_queueName

`string`

##### \_options?

[`QueueDeadLetterListOptions`](../type-aliases/QueueDeadLetterListOptions.md)

#### Returns

`Promise`\<[`QueueLeaseInspectionRecord`](../type-aliases/QueueLeaseInspectionRecord.md)[]\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`inspectLeases`](../interfaces/QueueBridge.md#inspectleases)

***

### isHealthy()

> **isHealthy**(): `Promise`\<`boolean`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:77](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L77)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`isHealthy`](../interfaces/QueueBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:73](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L73)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`isReady`](../interfaces/QueueBridge.md#isready)

***

### leaseNext()

> **leaseNext**(`queueName`, `_opts?`): `Promise`\<[`QueueLease`](../type-aliases/QueueLease.md) \| `undefined`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:119](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L119)

#### Parameters

##### queueName

`string`

##### \_opts?

[`QueueLeaseOptions`](../type-aliases/QueueLeaseOptions.md)

#### Returns

`Promise`\<[`QueueLease`](../type-aliases/QueueLease.md) \| `undefined`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`leaseNext`](../interfaces/QueueBridge.md#leasenext)

***

### metrics()

> **metrics**(`queueName`): `Promise`\<[`QueueMetrics`](../type-aliases/QueueMetrics.md)\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:271](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L271)

#### Parameters

##### queueName

`string`

#### Returns

`Promise`\<[`QueueMetrics`](../type-aliases/QueueMetrics.md)\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`metrics`](../interfaces/QueueBridge.md#metrics)

***

### moveToDeadLetter()

> **moveToDeadLetter**(`queueName`, `message`, `reason?`): `Promise`\<`void`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:213](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L213)

#### Parameters

##### queueName

`string`

##### message

[`QueueMessage`](../type-aliases/QueueMessage.md)

##### reason?

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`moveToDeadLetter`](../interfaces/QueueBridge.md#movetodeadletter)

***

### nack()

> **nack**(`queueName`, `leaseId`, `request`): `Promise`\<`void`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:183](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L183)

#### Parameters

##### queueName

`string`

##### leaseId

`string`

##### request

[`QueueRetryRequest`](../type-aliases/QueueRetryRequest.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`nack`](../interfaces/QueueBridge.md#nack)

***

### peekDeadLetter()

> **peekDeadLetter**(`queueName`, `options?`): `Promise`\<[`QueueMessage`](../type-aliases/QueueMessage.md)[]\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:229](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L229)

#### Parameters

##### queueName

`string`

##### options?

[`QueueDeadLetterListOptions`](../type-aliases/QueueDeadLetterListOptions.md)

#### Returns

`Promise`\<[`QueueMessage`](../type-aliases/QueueMessage.md)[]\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`peekDeadLetter`](../interfaces/QueueBridge.md#peekdeadletter)

***

### purgeDeadLetter()

> **purgeDeadLetter**(`queueName`): `Promise`\<`number`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:258](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L258)

#### Parameters

##### queueName

`string`

#### Returns

`Promise`\<`number`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`purgeDeadLetter`](../interfaces/QueueBridge.md#purgedeadletter)

***

### redriveDeadLetter()

> **redriveDeadLetter**(`queueName`, `options?`): `Promise`\<`number`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:236](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L236)

#### Parameters

##### queueName

`string`

##### options?

[`QueueDeadLetterRedriveOptions`](../type-aliases/QueueDeadLetterRedriveOptions.md)

#### Returns

`Promise`\<`number`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`redriveDeadLetter`](../interfaces/QueueBridge.md#redrivedeadletter)

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:71](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L71)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`start`](../interfaces/QueueBridge.md#start)
