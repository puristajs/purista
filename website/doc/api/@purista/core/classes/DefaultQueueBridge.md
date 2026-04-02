[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefaultQueueBridge

# Class: DefaultQueueBridge

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L29)

## Implements

- [`QueueBridge`](../interfaces/QueueBridge.md)

## Constructors

### Constructor

> **new DefaultQueueBridge**(`options?`): `DefaultQueueBridge`

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:61](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L61)

#### Parameters

##### options?

[`DefaultQueueBridgeOptions`](../type-aliases/DefaultQueueBridgeOptions.md)

#### Returns

`DefaultQueueBridge`

## Properties

### capabilities

> `readonly` **capabilities**: [`QueueBridgeCapabilities`](../type-aliases/QueueBridgeCapabilities.md)

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L32)

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`capabilities`](../interfaces/QueueBridge.md#capabilities)

***

### instanceId

> `readonly` **instanceId**: `string`

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:53](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L53)

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`instanceId`](../interfaces/QueueBridge.md#instanceid)

***

### name

> `readonly` **name**: `"DefaultQueueBridge"` = `'DefaultQueueBridge'`

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L30)

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`name`](../interfaces/QueueBridge.md#name)

## Methods

### ack()

> **ack**(`queueName`, `leaseId`): `Promise`\<`void`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:162](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L162)

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

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:77](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L77)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`destroy`](../interfaces/QueueBridge.md#destroy)

***

### enqueue()

> **enqueue**(`options`): `Promise`\<[`QueueEnqueueResult`](../type-aliases/QueueEnqueueResult.md)\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:83](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L83)

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

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:152](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L152)

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

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:239](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L239)

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

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:73](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L73)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`isHealthy`](../interfaces/QueueBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:69](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L69)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`isReady`](../interfaces/QueueBridge.md#isready)

***

### leaseNext()

> **leaseNext**(`queueName`, `_opts?`): `Promise`\<[`QueueLease`](../type-aliases/QueueLease.md) \| `undefined`\>

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:112](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L112)

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

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:246](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L246)

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

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:191](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L191)

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

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:167](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L167)

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

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:204](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L204)

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

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:233](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L233)

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

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:211](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L211)

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

Defined in: [DefaultQueueBridge/DefaultQueueBridge.impl.ts:67](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts#L67)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../interfaces/QueueBridge.md).[`start`](../interfaces/QueueBridge.md#start)
