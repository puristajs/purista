[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / PoolManager

# Class: PoolManager

Defined in: [ai/src/pools/PoolManager.ts:18](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/pools/PoolManager.ts#L18)

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

Defined in: [ai/src/pools/PoolManager.ts:21](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/pools/PoolManager.ts#L21)

#### Parameters

##### initial?

`Record`\<`string`, `number`\>

#### Returns

`PoolManager`

## Methods

### acquire()

> **acquire**(`id`): `Promise`\<`void`\>

Defined in: [ai/src/pools/PoolManager.ts:38](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/pools/PoolManager.ts#L38)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

***

### registerPool()

> **registerPool**(`id`, `maxParallel`): `void`

Defined in: [ai/src/pools/PoolManager.ts:29](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/pools/PoolManager.ts#L29)

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

Defined in: [ai/src/pools/PoolManager.ts:52](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/pools/PoolManager.ts#L52)

#### Parameters

##### id

`string`

#### Returns

`void`

***

### snapshot()

> **snapshot**(): `object`[]

Defined in: [ai/src/pools/PoolManager.ts:61](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/pools/PoolManager.ts#L61)

#### Returns

`object`[]
