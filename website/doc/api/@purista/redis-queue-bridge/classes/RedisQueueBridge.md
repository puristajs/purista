[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/redis-queue-bridge](../README.md) / RedisQueueBridge

# Class: RedisQueueBridge\<M, F, S, RESP, TYPE_MAPPING\>

Defined in: [RedisQueueBridge.impl.ts:33](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L33)

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

Defined in: [RedisQueueBridge.impl.ts:66](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L66)

#### Parameters

##### options?

[`RedisQueueBridgeOptions`](../type-aliases/RedisQueueBridgeOptions.md)\<`M`, `F`, `S`, `RESP`, `TYPE_MAPPING`\> = `{}`

#### Returns

`RedisQueueBridge`\<`M`, `F`, `S`, `RESP`, `TYPE_MAPPING`\>

## Properties

### capabilities

> `readonly` **capabilities**: [`QueueBridgeCapabilities`](../../core/type-aliases/QueueBridgeCapabilities.md)

Defined in: [RedisQueueBridge.impl.ts:43](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L43)

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`capabilities`](../../core/interfaces/QueueBridge.md#capabilities)

***

### instanceId

> `readonly` **instanceId**: `string`

Defined in: [RedisQueueBridge.impl.ts:56](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L56)

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`instanceId`](../../core/interfaces/QueueBridge.md#instanceid)

***

### name

> `readonly` **name**: `"RedisQueueBridge"` = `'RedisQueueBridge'`

Defined in: [RedisQueueBridge.impl.ts:41](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L41)

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`name`](../../core/interfaces/QueueBridge.md#name)

## Methods

### ack()

> **ack**(`queueName`, `leaseId`): `Promise`\<`void`\>

Defined in: [RedisQueueBridge.impl.ts:212](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L212)

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

Defined in: [RedisQueueBridge.impl.ts:84](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L84)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`destroy`](../../core/interfaces/QueueBridge.md#destroy)

***

### enqueue()

> **enqueue**(`options`): `Promise`\<[`QueueEnqueueResult`](../../core/type-aliases/QueueEnqueueResult.md)\>

Defined in: [RedisQueueBridge.impl.ts:103](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L103)

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

Defined in: [RedisQueueBridge.impl.ts:192](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L192)

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

Defined in: [RedisQueueBridge.impl.ts:94](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L94)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`isHealthy`](../../core/interfaces/QueueBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [RedisQueueBridge.impl.ts:90](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L90)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`isReady`](../../core/interfaces/QueueBridge.md#isready)

***

### leaseNext()

> **leaseNext**(`queueName`, `options?`): `Promise`\<[`QueueLease`](../../core/type-aliases/QueueLease.md) \| `undefined`\>

Defined in: [RedisQueueBridge.impl.ts:144](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L144)

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

Defined in: [RedisQueueBridge.impl.ts:257](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L257)

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

Defined in: [RedisQueueBridge.impl.ts:245](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L245)

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

Defined in: [RedisQueueBridge.impl.ts:228](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L228)

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

Defined in: [RedisQueueBridge.impl.ts:78](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L78)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`start`](../../core/interfaces/QueueBridge.md#start)
