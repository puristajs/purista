[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / PoolManager

# Class: PoolManager

Defined in: pools/PoolManager.ts:18

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

Defined in: pools/PoolManager.ts:21

#### Parameters

##### initial?

`Record`\<`string`, `number`\>

#### Returns

`PoolManager`

## Methods

### acquire()

> **acquire**(`id`): `Promise`\<`void`\>

Defined in: pools/PoolManager.ts:38

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

***

### registerPool()

> **registerPool**(`id`, `maxParallel`): `void`

Defined in: pools/PoolManager.ts:29

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

Defined in: pools/PoolManager.ts:52

#### Parameters

##### id

`string`

#### Returns

`void`

***

### snapshot()

> **snapshot**(): `object`[]

Defined in: pools/PoolManager.ts:61

#### Returns

`object`[]
