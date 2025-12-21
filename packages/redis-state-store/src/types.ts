import type {
	RedisClientOptions,
	RedisFunctions,
	RedisModules,
	RedisScripts,
	RespVersions,
	TypeMapping,
} from '@redis/client'

/**
 * The redis state store configuration.
 * It will extend the StoreBaseConfig.
 */
export type RedisStoreConfig<
	M extends RedisModules = RedisModules,
	F extends RedisFunctions = RedisFunctions,
	S extends RedisScripts = RedisScripts,
	RESP extends RespVersions = RespVersions,
	TYPE_MAPPING extends TypeMapping = TypeMapping,
> = {
	config?: RedisClientOptions<M, F, S, RESP, TYPE_MAPPING>
}
