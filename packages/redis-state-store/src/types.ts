import type {
	RedisClientOptions,
	RedisFunctions,
	RedisModules,
	RedisScripts,
	RespVersions,
	TypeMapping,
} from '@redis/client'

/**
 * Redis state store backend configuration.
 *
 * The object is nested under PURISTA `StoreBaseConfig`, so pass Redis client
 * options through the `config` property.
 *
 * @example
 * ```typescript
 * const store = new RedisStateStore({
 *   config: { url: 'redis://localhost:6379' },
 * })
 * ```
 */
export type RedisStoreConfig<
	M extends RedisModules = RedisModules,
	F extends RedisFunctions = RedisFunctions,
	S extends RedisScripts = RedisScripts,
	RESP extends RespVersions = RespVersions,
	TYPE_MAPPING extends TypeMapping = TypeMapping,
> = {
	/**
	 * node-redis client options passed to `createClient`.
	 *
	 * Use authenticated and encrypted connection settings for non-local
	 * deployments. Avoid embedding credentials in source code.
	 */
	config?: RedisClientOptions<M, F, S, RESP, TYPE_MAPPING>
}
