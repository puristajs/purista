import type { ObjectWithKeysFromStringArray, ResolvedStateWriteOptions, StoreBaseConfig } from '@purista/core'
import { StateStoreBaseClass, StatusCode, UnhandledError } from '@purista/core'
import type {
	RedisClientType,
	RedisFunctions,
	RedisModules,
	RedisScripts,
	RespVersions,
	TypeMapping,
} from '@redis/client'
import { createClient } from '@redis/client'

import type { RedisStoreConfig } from './types.js'

/**
 * State store backed by Redis string keys.
 *
 * State values are serialized with `JSON.stringify` before writing and parsed
 * with `JSON.parse` on read. This store does not add a local in-memory cache;
 * Redis is the source of truth for each operation.
 *
 * Use tenant-aware key prefixes to avoid collisions, for example
 * `tenant:acme:prod:cart:session-123`. State can contain sensitive data, so use
 * data minimization, short retention where possible, and TLS/authenticated Redis
 * endpoints in shared environments.
 *
 * The Redis connection is opened lazily on the first operation and closed by
 * `destroy()`.
 *
 * @example
 * ```typescript
 * const store = new RedisStateStore({
 *   config: { url: 'redis://localhost:6379' },
 * })
 *
 * await store.setState('tenant:acme:prod:cart:session-123', { step: 'shipping' })
 * const state = await store.getState('tenant:acme:prod:cart:session-123')
 * await store.destroy()
 * ```
 *
 * @see [node-redis](https://redis.js.org)
 */
export class RedisStateStore<
	M extends RedisModules = RedisModules,
	F extends RedisFunctions = RedisFunctions,
	S extends RedisScripts = RedisScripts,
> extends StateStoreBaseClass<RedisStoreConfig<M, F, S>> {
	/**
	 * Redis client used by this store.
	 *
	 * The client is created during construction, connected lazily, and disconnected
	 * by `destroy()`.
	 */
	public client: RedisClientType<M, F, S, RespVersions, TypeMapping>

	/**
	 * Creates a Redis-backed state store.
	 *
	 * @param config Store options and node-redis client configuration.
	 */
	constructor(config?: StoreBaseConfig<RedisStoreConfig<M, F, S>>) {
		super('RedisStateStore', { ...config }, { retention: { atomicExpiry: true } })
		this.client = createClient(this.config.config)
		this.client.on('error', err => this.logger.error({ err }, 'Redis Client Error'))
	}

	/**
	 * Returns an open Redis client, connecting it on demand.
	 */
	protected async getClient() {
		if (this.client.isOpen) {
			return this.client
		}
		return this.client.connect()
	}

	protected async getStateImpl<StateNames extends string[]>(
		...stateNames: StateNames
	): Promise<ObjectWithKeysFromStringArray<StateNames>> {
		const client = await this.getClient()

		const result: Record<string, unknown> = {}
		for await (const name of stateNames) {
			try {
				const value = await client.get(name)
				result[name] = value ? JSON.parse(value) : undefined
			} catch (err) {
				const msg = `error in state store getting value ${name}`
				this.logger.error({ err }, msg)
				throw new UnhandledError(StatusCode.InternalServerError, msg)
			}
		}
		return result as ObjectWithKeysFromStringArray<StateNames>
	}

	protected async removeStateImpl(stateName: string) {
		const client = await this.getClient()

		try {
			await client.del(stateName)
		} catch (err) {
			const msg = `error in state store removing value ${stateName}`
			this.logger.error({ err }, msg)
			throw new UnhandledError(StatusCode.InternalServerError, msg)
		}
	}

	protected async setStateImpl(stateName: string, stateValue: unknown, options: ResolvedStateWriteOptions) {
		if (!this.config.enableSet) {
			throw new UnhandledError(StatusCode.Unauthorized, 'set state at store is disabled by config')
		}

		const client = await this.getClient()
		try {
			const serialized = JSON.stringify(stateValue)
			if (options.retention.mode === 'expire') {
				await client.set(stateName, serialized, { PX: options.retention.ttlMs })
			} else {
				await client.set(stateName, serialized)
			}
		} catch (err) {
			const msg = `error in state store setting value ${stateName}`
			this.logger.error({ err }, msg)
			throw new UnhandledError(StatusCode.InternalServerError, msg)
		}
	}

	/**
	 * Disconnects the Redis client if it is open.
	 *
	 * Call this during application shutdown to release sockets cleanly.
	 */
	async destroy() {
		if (this.client.isOpen) {
			await this.client.disconnect()
		}
	}
}
