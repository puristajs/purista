[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/redis-queue-bridge](../README.md) / RedisQueueBridge

# Class: RedisQueueBridge\<M, F, S, RESP, TYPE_MAPPING\>

Defined in: [RedisQueueBridge.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L35)

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

Defined in: [RedisQueueBridge.impl.ts:68](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L68)

#### Parameters

##### options?

[`RedisQueueBridgeOptions`](../type-aliases/RedisQueueBridgeOptions.md)\<`M`, `F`, `S`, `RESP`, `TYPE_MAPPING`\> = `{}`

#### Returns

`RedisQueueBridge`\<`M`, `F`, `S`, `RESP`, `TYPE_MAPPING`\>

## Properties

### capabilities

> `readonly` **capabilities**: [`QueueBridgeCapabilities`](../../core/type-aliases/QueueBridgeCapabilities.md)

Defined in: [RedisQueueBridge.impl.ts:45](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L45)

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`capabilities`](../../core/interfaces/QueueBridge.md#capabilities)

***

### instanceId

> `readonly` **instanceId**: `string`

Defined in: [RedisQueueBridge.impl.ts:58](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L58)

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`instanceId`](../../core/interfaces/QueueBridge.md#instanceid)

***

### name

> `readonly` **name**: `"RedisQueueBridge"` = `'RedisQueueBridge'`

Defined in: [RedisQueueBridge.impl.ts:43](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L43)

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`name`](../../core/interfaces/QueueBridge.md#name)

## Methods

### ack()

> **ack**(`queueName`, `leaseId`): `Promise`\<`void`\>

Defined in: [RedisQueueBridge.impl.ts:220](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L220)

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

Defined in: [RedisQueueBridge.impl.ts:88](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L88)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`destroy`](../../core/interfaces/QueueBridge.md#destroy)

***

### enqueue()

> **enqueue**(`options`): `Promise`\<[`QueueEnqueueResult`](../../core/type-aliases/QueueEnqueueResult.md)\>

Defined in: [RedisQueueBridge.impl.ts:107](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L107)

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

Defined in: [RedisQueueBridge.impl.ts:200](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L200)

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

### isHealthy()

> **isHealthy**(): `Promise`\<`boolean`\>

Defined in: [RedisQueueBridge.impl.ts:98](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L98)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`isHealthy`](../../core/interfaces/QueueBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [RedisQueueBridge.impl.ts:94](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L94)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`isReady`](../../core/interfaces/QueueBridge.md#isready)

***

### leaseNext()

> **leaseNext**(`queueName`, `options?`): `Promise`\<[`QueueLease`](../../core/type-aliases/QueueLease.md) \| `undefined`\>

Defined in: [RedisQueueBridge.impl.ts:148](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L148)

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

Defined in: [RedisQueueBridge.impl.ts:265](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L265)

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

Defined in: [RedisQueueBridge.impl.ts:253](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L253)

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

Defined in: [RedisQueueBridge.impl.ts:236](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L236)

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

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [RedisQueueBridge.impl.ts:82](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L82)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`start`](../../core/interfaces/QueueBridge.md#start)
