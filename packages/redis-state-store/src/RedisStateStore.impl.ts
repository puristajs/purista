import type { ObjectWithKeysFromStringArray, StoreBaseConfig } from '@purista/core'
import { StateStoreBaseClass, StatusCode, UnhandledError } from '@purista/core'
import type { RedisClientType, RedisFunctions, RedisModules, RedisScripts } from '@redis/client'
import { createClient } from '@redis/client'

import type { RedisStoreConfig } from './types.js'

/**
 * A state store for using redis as storage.
 * State values are stored as stringified JSON.
 *
 * Per default, setting/changing and removal of values are enabled.
 *
 * @example
 * ```typescript
 * const config = {
 *  enableGet: true, // optional, default is true
 *  enableRemove: true, // optional, default is true
 *  enableSet: true, // optional, default is true
 *  url: 'redis://alice:foobared@awesome.redis.server:6379'
 * }
 *
 * const store = new RedisStateStore({ config })
 *
 * await store.setState('stateKey',{ myState: 'value' })
 *
 * let value = await store.getState('stateKey')
 * console.log(value) // outputs: { stateKey: { myState: 'value' } }
 *
 * await store.removeState('stateKey')
 *
 * value = await store.getState('stateKey')
 * console.log(value) // outputs: undefined
 * ```
 *
 * See documentation of underlaying redis lib package for detailed configuration options.
 *
 * @see [NODE-REDIS](https://redis.js.org)
 *
 */
export class RedisStateStore<
	M extends RedisModules = RedisModules,
	F extends RedisFunctions = RedisFunctions,
	S extends RedisScripts = RedisScripts,
> extends StateStoreBaseClass<RedisStoreConfig<M, F, S>> {
	public client: RedisClientType<M, F, S>

	constructor(config?: StoreBaseConfig<RedisStoreConfig<M, F, S>>) {
		super('RedisStateStore', { ...config })
		this.client = createClient(this.config.config)
		this.client.on('error', err => this.logger.error({ err }, 'Redis Client Error'))
	}

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

	protected async setStateImpl(stateName: string, stateValue: unknown) {
		if (!this.config.enableSet) {
			throw new UnhandledError(StatusCode.Unauthorized, 'set state at store is disabled by config')
		}

		const client = await this.getClient()
		try {
			await client.set(stateName, JSON.stringify(stateValue))
		} catch (err) {
			const msg = `error in state store setting value ${stateName}`
			this.logger.error({ err }, msg)
			throw new UnhandledError(StatusCode.InternalServerError, msg)
		}
	}

	async destroy() {
		if (this.client.isOpen) {
			await this.client.disconnect()
		}
	}
}
