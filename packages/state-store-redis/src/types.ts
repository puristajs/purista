import { RedisClientOptions, RedisFunctions, RedisModules, RedisScripts } from '@redis/client'

export type RedisStoreConfig<
  M extends RedisModules = RedisModules,
  F extends RedisFunctions = RedisFunctions,
  S extends RedisScripts = RedisScripts,
> = {
  config?: RedisClientOptions<M, F, S>
}
