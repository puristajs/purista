[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/redis-state-store](../README.md) / RedisStoreConfig

# Type Alias: RedisStoreConfig\<M, F, S, RESP, TYPE_MAPPING\>

> **RedisStoreConfig**\<`M`, `F`, `S`, `RESP`, `TYPE_MAPPING`\> = `object`

Defined in: [redis-state-store/src/types.ts:14](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/types.ts#L14)

The redis state store configuration.
It will extend the StoreBaseConfig.

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

## Properties

### config?

> `optional` **config?**: `RedisClientOptions`\<`M`, `F`, `S`, `RESP`, `TYPE_MAPPING`\>

Defined in: [redis-state-store/src/types.ts:21](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/types.ts#L21)
