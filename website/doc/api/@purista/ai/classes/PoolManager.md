[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / PoolManager

# Class: PoolManager

Defined in: [packages/ai/src/pools/PoolManager.ts:29](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/pools/PoolManager.ts#L29)

Tracks concurrency pools for background agents so hosts can guard rate limits and costs.

## Example

```ts
const pools = new PoolManager({ default: 2 })
await pools.acquire('default')
// ... perform work ...
pools.release('default')
```

## Constructors

### Constructor

> **new PoolManager**(`initial?`): `PoolManager`

Defined in: [packages/ai/src/pools/PoolManager.ts:32](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/pools/PoolManager.ts#L32)

#### Parameters

##### initial?

`Record`\<`string`, `number`\>

#### Returns

`PoolManager`

## Methods

### acquire()

> **acquire**(`id`): `Promise`\<[`PoolAcquireResult`](../type-aliases/PoolAcquireResult.md)\>

Defined in: [packages/ai/src/pools/PoolManager.ts:50](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/pools/PoolManager.ts#L50)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`PoolAcquireResult`](../type-aliases/PoolAcquireResult.md)\>

***

### getPoolStats()

> **getPoolStats**(`id`): [`PoolStats`](../type-aliases/PoolStats.md)

Defined in: [packages/ai/src/pools/PoolManager.ts:81](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/pools/PoolManager.ts#L81)

#### Parameters

##### id

`string`

#### Returns

[`PoolStats`](../type-aliases/PoolStats.md)

***

### registerPool()

> **registerPool**(`id`, `maxParallel`): `void`

Defined in: [packages/ai/src/pools/PoolManager.ts:40](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/pools/PoolManager.ts#L40)

#### Parameters

##### id

`string`

##### maxParallel

`number`

#### Returns

`void`

***

### release()

> **release**(`id`): `void`

Defined in: [packages/ai/src/pools/PoolManager.ts:72](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/pools/PoolManager.ts#L72)

#### Parameters

##### id

`string`

#### Returns

`void`

***

### snapshot()

> **snapshot**(): [`PoolStats`](../type-aliases/PoolStats.md)[]

Defined in: [packages/ai/src/pools/PoolManager.ts:91](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/pools/PoolManager.ts#L91)

#### Returns

[`PoolStats`](../type-aliases/PoolStats.md)[]
