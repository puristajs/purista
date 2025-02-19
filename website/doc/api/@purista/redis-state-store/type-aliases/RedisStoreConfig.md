[**@purista/redis-state-store v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/redis-state-store](../README.md) / RedisStoreConfig

# Type Alias: RedisStoreConfig\<M, F, S\>

> **RedisStoreConfig**\<`M`, `F`, `S`\>: `object`

Defined in: [redis-state-store/src/types.ts:7](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/types.ts#L7)

The redis state store configuration.
It will extend the StoreBaseConfig.

## Type Parameters

• **M** *extends* `RedisModules` = `RedisModules`

• **F** *extends* `RedisFunctions` = `RedisFunctions`

• **S** *extends* `RedisScripts` = `RedisScripts`

## Type declaration

### config?

> `optional` **config**: `RedisClientOptions`\<`M`, `F`, `S`\>
