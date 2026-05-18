[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/redis-queue-bridge](../README.md) / RedisQueueBridge

# Class: RedisQueueBridge\<M, F, S, RESP, TYPE_MAPPING\>

Defined in: [RedisQueueBridge.impl.ts:37](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L37)

## Type Parameters

### M

`M` *extends* `RedisModules` = `RedisModules`

### F

`F` *extends* `RedisFunctions` = `RedisFunctions`

### S

`S` *extends* `RedisScripts` = `RedisScripts`

### RESP

`RESP` *extends* `RespVersions` = `RespVersions`

### TYPE_MAPPING

`TYPE_MAPPING` *extends* `TypeMapping` = `TypeMapping`

## Implements

- [`QueueBridge`](../../core/interfaces/QueueBridge.md)

## Constructors

### Constructor

> **new RedisQueueBridge**\<`M`, `F`, `S`, `RESP`, `TYPE_MAPPING`\>(`options?`): `RedisQueueBridge`\<`M`, `F`, `S`, `RESP`, `TYPE_MAPPING`\>

Defined in: [RedisQueueBridge.impl.ts:80](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L80)

#### Parameters

##### options?

[`RedisQueueBridgeOptions`](../type-aliases/RedisQueueBridgeOptions.md)\<`M`, `F`, `S`, `RESP`, `TYPE_MAPPING`\> = `{}`

#### Returns

`RedisQueueBridge`\<`M`, `F`, `S`, `RESP`, `TYPE_MAPPING`\>

## Properties

### capabilities

> `readonly` **capabilities**: [`QueueBridgeCapabilities`](../../core/type-aliases/QueueBridgeCapabilities.md)

Defined in: [RedisQueueBridge.impl.ts:47](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L47)

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`capabilities`](../../core/interfaces/QueueBridge.md#capabilities)

***

### instanceId

> `readonly` **instanceId**: `string`

Defined in: [RedisQueueBridge.impl.ts:68](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L68)

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`instanceId`](../../core/interfaces/QueueBridge.md#instanceid)

***

### name

> `readonly` **name**: `"RedisQueueBridge"` = `'RedisQueueBridge'`

Defined in: [RedisQueueBridge.impl.ts:45](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L45)

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`name`](../../core/interfaces/QueueBridge.md#name)

## Methods

### ack()

> **ack**(`queueName`, `leaseId`): `Promise`\<`void`\>

Defined in: [RedisQueueBridge.impl.ts:227](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L227)

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

Defined in: [RedisQueueBridge.impl.ts:99](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L99)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`destroy`](../../core/interfaces/QueueBridge.md#destroy)

***

### enqueue()

> **enqueue**(`options`): `Promise`\<[`QueueEnqueueResult`](../../core/type-aliases/QueueEnqueueResult.md)\>

Defined in: [RedisQueueBridge.impl.ts:118](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L118)

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

Defined in: [RedisQueueBridge.impl.ts:207](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L207)

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

Defined in: [RedisQueueBridge.impl.ts:271](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L271)

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

Defined in: [RedisQueueBridge.impl.ts:109](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L109)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`isHealthy`](../../core/interfaces/QueueBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [RedisQueueBridge.impl.ts:105](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L105)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`isReady`](../../core/interfaces/QueueBridge.md#isready)

***

### leaseNext()

> **leaseNext**(`queueName`, `options?`): `Promise`\<[`QueueLease`](../../core/type-aliases/QueueLease.md) \| `undefined`\>

Defined in: [RedisQueueBridge.impl.ts:165](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L165)

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

> **metrics**(`queueName`): `Promise`\<\{ `deadLetter`: `number`; `inflight`: `number`; `oldestAgeMs`: `number` \| `undefined`; `pending`: `number`; `retries`: `number`; \}\>

Defined in: [RedisQueueBridge.impl.ts:302](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L302)

#### Parameters

##### queueName

`string`

#### Returns

`Promise`\<\{ `deadLetter`: `number`; `inflight`: `number`; `oldestAgeMs`: `number` \| `undefined`; `pending`: `number`; `retries`: `number`; \}\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`metrics`](../../core/interfaces/QueueBridge.md#metrics)

***

### moveToDeadLetter()

> **moveToDeadLetter**(`queueName`, `message`, `reason?`): `Promise`\<`void`\>

Defined in: [RedisQueueBridge.impl.ts:235](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L235)

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

Defined in: [RedisQueueBridge.impl.ts:231](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L231)

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

Defined in: [RedisQueueBridge.impl.ts:247](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L247)

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

Defined in: [RedisQueueBridge.impl.ts:264](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L264)

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

Defined in: [RedisQueueBridge.impl.ts:259](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L259)

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

Defined in: [RedisQueueBridge.impl.ts:93](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L93)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`start`](../../core/interfaces/QueueBridge.md#start)
