import type { RedisClientOptions, RedisFunctions, RedisModules, RedisScripts } from '@redis/client'

/**
 * The redis state store configuration.
 * It will extend the StoreBaseConfig.
 */
export type RedisStoreConfig<
	M extends RedisModules = RedisModules,
	F extends RedisFunctions = RedisFunctions,
	S extends RedisScripts = RedisScripts,
> = {
	config?: RedisClientOptions<M, F, S>
}
