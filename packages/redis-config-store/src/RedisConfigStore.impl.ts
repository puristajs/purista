import type { ObjectWithKeysFromStringArray, StoreBaseConfig } from '@purista/core'
import { ConfigStoreBaseClass, StatusCode, UnhandledError } from '@purista/core'
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
 * Config store backed by Redis string keys.
 *
 * Config values are serialized with `JSON.stringify` before writing and parsed
 * with `JSON.parse` on read. This store does not add a local in-memory cache;
 * Redis is the source of truth for each operation.
 *
 * Use tenant-aware key prefixes to avoid collisions, for example
 * `tenant:acme:prod:payments:public-api-url`. Keep secrets out of config values
 * and use TLS/authenticated Redis endpoints in shared environments.
 *
 * The Redis connection is opened lazily on the first operation and closed by
 * `destroy()`.
 *
 * @example
 * ```typescript
 * const store = new RedisConfigStore({
 *   config: { url: 'redis://localhost:6379' },
 * })
 *
 * await store.setConfig('tenant:acme:prod:app:features', { checkout: true })
 * const config = await store.getConfig('tenant:acme:prod:app:features')
 * await store.destroy()
 * ```
 *
 * @see [node-redis](https://redis.js.org)
 */
export class RedisConfigStore<
	M extends RedisModules = RedisModules,
	F extends RedisFunctions = RedisFunctions,
	S extends RedisScripts = RedisScripts,
> extends ConfigStoreBaseClass<RedisStoreConfig<M, F, S>> {
	/**
	 * Redis client used by this store.
	 *
	 * The client is created during construction, connected lazily, and disconnected
	 * by `destroy()`.
	 */
	public client: RedisClientType<M, F, S, RespVersions, TypeMapping>

	/**
	 * Creates a Redis-backed config store.
	 *
	 * @param config Store options and node-redis client configuration.
	 */
	constructor(config?: StoreBaseConfig<RedisStoreConfig<M, F, S>>) {
		super('RedisConfigStore', { ...config })
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

	protected async getConfigImpl<ConfigNames extends string[]>(
		...configNames: ConfigNames
	): Promise<ObjectWithKeysFromStringArray<ConfigNames>> {
		const client = await this.getClient()

		const result: Record<string, unknown> = {}
		for await (const name of configNames) {
			try {
				const value = await client.get(name)
				result[name] = value ? JSON.parse(value) : undefined
			} catch (err) {
				const msg = `error in config store getting value ${name}`
				this.logger.error({ err }, msg)
				throw new UnhandledError(StatusCode.InternalServerError, msg)
			}
		}
		return result as ObjectWithKeysFromStringArray<ConfigNames>
	}

	protected async removeConfigImpl(configName: string) {
		const client = await this.getClient()

		try {
			await client.del(configName)
		} catch (err) {
			const msg = `error in config store removing value ${configName}`
			this.logger.error({ err }, msg)
			throw new UnhandledError(StatusCode.InternalServerError, msg)
		}
	}

	protected async setConfigImpl(configName: string, configValue: unknown) {
		const client = await this.getClient()
		try {
			await client.set(configName, JSON.stringify(configValue))
		} catch (err) {
			const msg = `error in config store setting value ${configName}`
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
