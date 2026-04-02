[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/nats-queue-bridge](../README.md) / NatsQueueBridge

# Class: NatsQueueBridge

Defined in: NatsQueueBridge.impl.ts:37

## Implements

- [`QueueBridge`](../../core/interfaces/QueueBridge.md)

## Constructors

### Constructor

> **new NatsQueueBridge**(`options?`): `NatsQueueBridge`

Defined in: NatsQueueBridge.impl.ts:78

#### Parameters

##### options?

[`NatsQueueBridgeOptions`](../type-aliases/NatsQueueBridgeOptions.md) = `{}`

#### Returns

`NatsQueueBridge`

## Properties

### capabilities

> `readonly` **capabilities**: [`QueueBridgeCapabilities`](../../core/type-aliases/QueueBridgeCapabilities.md)

Defined in: NatsQueueBridge.impl.ts:40

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`capabilities`](../../core/interfaces/QueueBridge.md#capabilities)

***

### instanceId

> `readonly` **instanceId**: `` `${string}-${string}-${string}-${string}-${string}` ``

Defined in: NatsQueueBridge.impl.ts:61

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`instanceId`](../../core/interfaces/QueueBridge.md#instanceid)

***

### name

> `readonly` **name**: `"NatsQueueBridge"` = `'NatsQueueBridge'`

Defined in: NatsQueueBridge.impl.ts:38

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`name`](../../core/interfaces/QueueBridge.md#name)

## Methods

### ack()

> **ack**(`queueName`, `leaseId`): `Promise`\<`void`\>

Defined in: NatsQueueBridge.impl.ts:192

#### Parameters

##### queueName

`string`

##### leaseId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`ack`](../../core/interfaces/QueueBridge.md#ack)

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: NatsQueueBridge.impl.ts:94

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`destroy`](../../core/interfaces/QueueBridge.md#destroy)

***

### enqueue()

> **enqueue**(`options`): `Promise`\<[`QueueEnqueueResult`](../../core/type-aliases/QueueEnqueueResult.md)\>

Defined in: NatsQueueBridge.impl.ts:123

#### Parameters

##### options

[`QueueEnqueueOptions`](../../core/type-aliases/QueueEnqueueOptions.md)\<`unknown`, `unknown`\>

#### Returns

`Promise`\<[`QueueEnqueueResult`](../../core/type-aliases/QueueEnqueueResult.md)\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`enqueue`](../../core/interfaces/QueueBridge.md#enqueue)

***

### extendLease()

> **extendLease**(`queueName`, `leaseId`, `extensionMs`): `Promise`\<`void`\>

Defined in: NatsQueueBridge.impl.ts:181

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

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`extendLease`](../../core/interfaces/QueueBridge.md#extendlease)

***

### inspectLeases()

> **inspectLeases**(`queueName`, `options?`): `Promise`\<[`QueueLeaseInspectionRecord`](../../core/type-aliases/QueueLeaseInspectionRecord.md)[]\>

Defined in: NatsQueueBridge.impl.ts:278

#### Parameters

##### queueName

`string`

##### options?

[`QueueDeadLetterListOptions`](../../core/type-aliases/QueueDeadLetterListOptions.md)

#### Returns

`Promise`\<[`QueueLeaseInspectionRecord`](../../core/type-aliases/QueueLeaseInspectionRecord.md)[]\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`inspectLeases`](../../core/interfaces/QueueBridge.md#inspectleases)

***

### isHealthy()

> **isHealthy**(): `Promise`\<`boolean`\>

Defined in: NatsQueueBridge.impl.ts:111

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`isHealthy`](../../core/interfaces/QueueBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: NatsQueueBridge.impl.ts:107

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`isReady`](../../core/interfaces/QueueBridge.md#isready)

***

### leaseNext()

> **leaseNext**(`queueName`, `options?`): `Promise`\<[`QueueLease`](../../core/type-aliases/QueueLease.md) \| `undefined`\>

Defined in: NatsQueueBridge.impl.ts:147

#### Parameters

##### queueName

`string`

##### options?

[`QueueLeaseOptions`](../../core/type-aliases/QueueLeaseOptions.md)

#### Returns

`Promise`\<[`QueueLease`](../../core/type-aliases/QueueLease.md) \| `undefined`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`leaseNext`](../../core/interfaces/QueueBridge.md#leasenext)

***

### metrics()

> **metrics**(`queueName`): `Promise`\<[`QueueMetrics`](../../core/type-aliases/QueueMetrics.md)\>

Defined in: NatsQueueBridge.impl.ts:292

#### Parameters

##### queueName

`string`

#### Returns

`Promise`\<[`QueueMetrics`](../../core/type-aliases/QueueMetrics.md)\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`metrics`](../../core/interfaces/QueueBridge.md#metrics)

***

### moveToDeadLetter()

> **moveToDeadLetter**(`queueName`, `message`, `reason?`): `Promise`\<`void`\>

Defined in: NatsQueueBridge.impl.ts:229

#### Parameters

##### queueName

`string`

##### message

[`QueueMessage`](../../core/type-aliases/QueueMessage.md)

##### reason?

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`moveToDeadLetter`](../../core/interfaces/QueueBridge.md#movetodeadletter)

***

### nack()

> **nack**(`queueName`, `leaseId`, `request`): `Promise`\<`void`\>

Defined in: NatsQueueBridge.impl.ts:201

#### Parameters

##### queueName

`string`

##### leaseId

`string`

##### request

[`QueueRetryRequest`](../../core/type-aliases/QueueRetryRequest.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`nack`](../../core/interfaces/QueueBridge.md#nack)

***

### peekDeadLetter()

> **peekDeadLetter**(`queueName`, `options?`): `Promise`\<[`QueueMessage`](../../core/type-aliases/QueueMessage.md)[]\>

Defined in: NatsQueueBridge.impl.ts:243

#### Parameters

##### queueName

`string`

##### options?

[`QueueDeadLetterListOptions`](../../core/type-aliases/QueueDeadLetterListOptions.md)

#### Returns

`Promise`\<[`QueueMessage`](../../core/type-aliases/QueueMessage.md)[]\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`peekDeadLetter`](../../core/interfaces/QueueBridge.md#peekdeadletter)

***

### purgeDeadLetter()

> **purgeDeadLetter**(`queueName`): `Promise`\<`number`\>

Defined in: NatsQueueBridge.impl.ts:269

#### Parameters

##### queueName

`string`

#### Returns

`Promise`\<`number`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`purgeDeadLetter`](../../core/interfaces/QueueBridge.md#purgedeadletter)

***

### redriveDeadLetter()

> **redriveDeadLetter**(`queueName`, `options?`): `Promise`\<`number`\>

Defined in: NatsQueueBridge.impl.ts:250

#### Parameters

##### queueName

`string`

##### options?

[`QueueDeadLetterRedriveOptions`](../../core/type-aliases/QueueDeadLetterRedriveOptions.md)

#### Returns

`Promise`\<`number`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`redriveDeadLetter`](../../core/interfaces/QueueBridge.md#redrivedeadletter)

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: NatsQueueBridge.impl.ts:86

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`start`](../../core/interfaces/QueueBridge.md#start)
