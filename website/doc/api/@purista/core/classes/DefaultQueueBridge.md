[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefaultQueueBridge

# Class: DefaultQueueBridge

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L25)

## Implements

- [`QueueBridge`](../interfaces/QueueBridge.md)

## Constructors

### Constructor

> **new DefaultQueueBridge**(`options?`): `DefaultQueueBridge`

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:49](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L49)

#### Parameters

##### options?

[`DefaultQueueBridgeOptions`](../type-aliases/DefaultQueueBridgeOptions.md)

#### Returns

`DefaultQueueBridge`

## Properties

### capabilities

> `readonly` **capabilities**: [`QueueBridgeCapabilities`](../type-aliases/QueueBridgeCapabilities.md)

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L28)

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`capabilities`](../interfaces/QueueBridge.md#capabilities)

***

### instanceId

> `readonly` **instanceId**: `string`

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L41)

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`instanceId`](../interfaces/QueueBridge.md#instanceid)

***

### name

> `readonly` **name**: `"DefaultQueueBridge"` = `'DefaultQueueBridge'`

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L26)

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`name`](../interfaces/QueueBridge.md#name)

## Methods

### ack()

> **ack**(`queueName`, `leaseId`): `Promise`\<`void`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:148](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L148)

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

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:65](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L65)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`destroy`](../interfaces/QueueBridge.md#destroy)

***

### enqueue()

> **enqueue**(`options`): `Promise`\<[`QueueEnqueueResult`](../type-aliases/QueueEnqueueResult.md)\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:71](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L71)

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

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:138](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L138)

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

### isHealthy()

> **isHealthy**(): `Promise`\<`boolean`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:61](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L61)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`isHealthy`](../interfaces/QueueBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:57](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L57)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`isReady`](../interfaces/QueueBridge.md#isready)

***

### leaseNext()

> **leaseNext**(`queueName`, `_opts?`): `Promise`\<[`QueueLease`](../type-aliases/QueueLease.md) \| `undefined`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:100](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L100)

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

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:193](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L193)

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

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:181](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L181)

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

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:153](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L153)

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

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:55](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L55)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`start`](../interfaces/QueueBridge.md#start)
