[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/nats-queue-bridge](../README.md) / NatsQueueBridge

# Class: NatsQueueBridge

Defined in: [NatsQueueBridge.impl.ts:45](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L45)

## Implements

- [`QueueBridge`](../../core/interfaces/QueueBridge.md)

## Constructors

### Constructor

> **new NatsQueueBridge**(`options?`): `NatsQueueBridge`

Defined in: [NatsQueueBridge.impl.ts:89](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L89)

#### Parameters

##### options?

[`NatsQueueBridgeOptions`](../type-aliases/NatsQueueBridgeOptions.md) = `{}`

#### Returns

`NatsQueueBridge`

## Properties

### capabilities

> `readonly` **capabilities**: [`QueueBridgeCapabilities`](../../core/type-aliases/QueueBridgeCapabilities.md)

Defined in: [NatsQueueBridge.impl.ts:48](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L48)

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`capabilities`](../../core/interfaces/QueueBridge.md#capabilities)

***

### instanceId

> `readonly` **instanceId**: `` `${string}-${string}-${string}-${string}-${string}` ``

Defined in: [NatsQueueBridge.impl.ts:69](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L69)

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`instanceId`](../../core/interfaces/QueueBridge.md#instanceid)

***

### name

> `readonly` **name**: `"NatsQueueBridge"` = `'NatsQueueBridge'`

Defined in: [NatsQueueBridge.impl.ts:46](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L46)

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`name`](../../core/interfaces/QueueBridge.md#name)

## Methods

### ack()

> **ack**(`queueName`, `leaseId`): `Promise`\<`void`\>

Defined in: [NatsQueueBridge.impl.ts:214](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L214)

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

Defined in: [NatsQueueBridge.impl.ts:106](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L106)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`destroy`](../../core/interfaces/QueueBridge.md#destroy)

***

### enqueue()

> **enqueue**(`options`): `Promise`\<[`QueueEnqueueResult`](../../core/type-aliases/QueueEnqueueResult.md)\>

Defined in: [NatsQueueBridge.impl.ts:136](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L136)

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

Defined in: [NatsQueueBridge.impl.ts:203](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L203)

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

Defined in: [NatsQueueBridge.impl.ts:300](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L300)

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

Defined in: [NatsQueueBridge.impl.ts:124](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L124)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`isHealthy`](../../core/interfaces/QueueBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [NatsQueueBridge.impl.ts:120](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L120)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`isReady`](../../core/interfaces/QueueBridge.md#isready)

***

### leaseNext()

> **leaseNext**(`queueName`, `options?`): `Promise`\<[`QueueLease`](../../core/type-aliases/QueueLease.md) \| `undefined`\>

Defined in: [NatsQueueBridge.impl.ts:169](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L169)

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

Defined in: [NatsQueueBridge.impl.ts:314](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L314)

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

Defined in: [NatsQueueBridge.impl.ts:251](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L251)

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

Defined in: [NatsQueueBridge.impl.ts:223](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L223)

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

Defined in: [NatsQueueBridge.impl.ts:265](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L265)

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

Defined in: [NatsQueueBridge.impl.ts:291](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L291)

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

Defined in: [NatsQueueBridge.impl.ts:272](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L272)

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

Defined in: [NatsQueueBridge.impl.ts:98](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/nats-queue-bridge/src/NatsQueueBridge.impl.ts#L98)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`start`](../../core/interfaces/QueueBridge.md#start)
