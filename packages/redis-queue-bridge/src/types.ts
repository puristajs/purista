import type {
	RedisClientOptions,
	RedisFunctions,
	RedisModules,
	RedisScripts,
	RespVersions,
	TypeMapping,
} from '@redis/client'

export type RedisQueueBridgeOptions<
	M extends RedisModules = RedisModules,
	F extends RedisFunctions = RedisFunctions,
	S extends RedisScripts = RedisScripts,
	RESP extends RespVersions = RespVersions,
	TYPE_MAPPING extends TypeMapping = TypeMapping,
> = {
	config?: RedisClientOptions<M, F, S, RESP, TYPE_MAPPING>
	keyPrefix?: string
	scheduleBatchSize?: number
	recoveryBatchSize?: number
}
