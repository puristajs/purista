[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/redis-queue-bridge](../README.md) / RedisQueueBridgeOptions

# Type Alias: RedisQueueBridgeOptions\<M, F, S, RESP, TYPE_MAPPING\>

> **RedisQueueBridgeOptions**\<`M`, `F`, `S`, `RESP`, `TYPE_MAPPING`\> = `object`

Defined in: [types.ts:10](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/types.ts#L10)

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

> `optional` **config**: `RedisClientOptions`\<`M`, `F`, `S`, `RESP`, `TYPE_MAPPING`\>

Defined in: [types.ts:17](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/types.ts#L17)

***

### keyPrefix?

> `optional` **keyPrefix**: `string`

Defined in: [types.ts:18](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/types.ts#L18)

***

### recoveryBatchSize?

> `optional` **recoveryBatchSize**: `number`

Defined in: [types.ts:20](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/types.ts#L20)

***

### scheduleBatchSize?

> `optional` **scheduleBatchSize**: `number`

Defined in: [types.ts:19](https://github.com/puristajs/purista/blob/master/packages/redis-queue-bridge/src/types.ts#L19)
