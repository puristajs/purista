import type {
	RedisClientOptions,
	RedisFunctions,
	RedisModules,
	RedisScripts,
	RespVersions,
	TypeMapping,
} from '@redis/client'

/**
 * Configuration for {@link RedisQueueBridge}.
 *
 * Requires a Redis server reachable by the Node Redis client. Queue messages
 * are serialized as JSON values in Redis hashes, lists, and sorted sets, so
 * callers should keep payloads minimal and avoid secrets or unnecessary
 * personal data unless Redis persistence, backups, and transport are protected.
 *
 * @example
 * ```typescript
 * import { RedisQueueBridge } from '@purista/redis-queue-bridge'
 *
 * const queueBridge = new RedisQueueBridge({
 *   config: { url: 'redis://localhost:6379' },
 *   keyPrefix: 'acme:queue:',
 * })
 * await queueBridge.start()
 * ```
 */
export type RedisQueueBridgeOptions<
	M extends RedisModules = RedisModules,
	F extends RedisFunctions = RedisFunctions,
	S extends RedisScripts = RedisScripts,
	RESP extends RespVersions = RespVersions,
	TYPE_MAPPING extends TypeMapping = TypeMapping,
> = {
	/** Node Redis client options passed to `createClient`. */
	config?: RedisClientOptions<M, F, S, RESP, TYPE_MAPPING>
	/** Prefix for all Redis keys managed by this bridge. */
	keyPrefix?: string
	/** Maximum scheduled jobs released to the pending list in one pass. */
	scheduleBatchSize?: number
	/** Maximum expired leases recovered in one pass. */
	recoveryBatchSize?: number
}
