[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/redis-queue-bridge](../README.md) / RedisQueueBridge

# Class: RedisQueueBridge\<M, F, S, RESP, TYPE_MAPPING\>

Defined in: [RedisQueueBridge.impl.ts:36](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L36)

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

Defined in: [RedisQueueBridge.impl.ts:69](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L69)

#### Parameters

##### options?

[`RedisQueueBridgeOptions`](../type-aliases/RedisQueueBridgeOptions.md)\<`M`, `F`, `S`, `RESP`, `TYPE_MAPPING`\> = `{}`

#### Returns

`RedisQueueBridge`\<`M`, `F`, `S`, `RESP`, `TYPE_MAPPING`\>

## Properties

### capabilities

> `readonly` **capabilities**: [`QueueBridgeCapabilities`](../../core/type-aliases/QueueBridgeCapabilities.md)

Defined in: [RedisQueueBridge.impl.ts:46](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L46)

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`capabilities`](../../core/interfaces/QueueBridge.md#capabilities)

***

### instanceId

> `readonly` **instanceId**: `string`

Defined in: [RedisQueueBridge.impl.ts:59](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L59)

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`instanceId`](../../core/interfaces/QueueBridge.md#instanceid)

***

### name

> `readonly` **name**: `"RedisQueueBridge"` = `'RedisQueueBridge'`

Defined in: [RedisQueueBridge.impl.ts:44](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L44)

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`name`](../../core/interfaces/QueueBridge.md#name)

## Methods

### ack()

> **ack**(`queueName`, `leaseId`): `Promise`\<`void`\>

Defined in: [RedisQueueBridge.impl.ts:215](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L215)

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

Defined in: [RedisQueueBridge.impl.ts:87](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L87)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`destroy`](../../core/interfaces/QueueBridge.md#destroy)

***

### enqueue()

> **enqueue**(`options`): `Promise`\<[`QueueEnqueueResult`](../../core/type-aliases/QueueEnqueueResult.md)\>

Defined in: [RedisQueueBridge.impl.ts:106](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L106)

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

Defined in: [RedisQueueBridge.impl.ts:195](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L195)

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

Defined in: [RedisQueueBridge.impl.ts:97](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L97)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`isHealthy`](../../core/interfaces/QueueBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [RedisQueueBridge.impl.ts:93](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L93)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`isReady`](../../core/interfaces/QueueBridge.md#isready)

***

### leaseNext()

> **leaseNext**(`queueName`, `options?`): `Promise`\<[`QueueLease`](../../core/type-aliases/QueueLease.md) \| `undefined`\>

Defined in: [RedisQueueBridge.impl.ts:147](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L147)

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

Defined in: [RedisQueueBridge.impl.ts:260](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L260)

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

Defined in: [RedisQueueBridge.impl.ts:248](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L248)

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

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [RedisQueueBridge.impl.ts:81](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/RedisQueueBridge.impl.ts#L81)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QueueBridge`](../../core/interfaces/QueueBridge.md).[`start`](../../core/interfaces/QueueBridge.md#start)
