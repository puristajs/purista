import type { ObjectWithKeysFromStringArray, StoreBaseConfig } from '@purista/core/adapter'
import { ConfigStoreBaseClass, StatusCode, UnhandledError } from '@purista/core/adapter'
import type { KV, NatsConnection } from 'nats'
import { connect, JSONCodec } from 'nats'

import type { NatsConfigStoreConfig } from './types/NatsConfigStoreConfig.js'

/**
 * Config store backed by a NATS JetStream key-value bucket.
 *
 * JetStream must be enabled on the NATS server. Values are encoded with the NATS
 * `JSONCodec`, so stored values must be JSON-compatible. This store keeps only
 * the NATS connection and KV bucket handle in memory; values are read from the
 * bucket for each operation.
 *
 * The default bucket is `purista-config-store`. Use tenant-aware keys such as
 * `tenant.acme.prod.payments.public-api-url`, and configure NATS credentials via
 * connection options or your runtime environment.
 *
 * @example
 * ```typescript
 * const store = new NatsConfigStore({
 *   servers: 'nats://localhost:4222',
 *   keyValueStoreName: 'purista-config-store',
 * })
 *
 * await store.setConfig('tenant.acme.prod.app.features', { checkout: true })
 * const config = await store.getConfig('tenant.acme.prod.app.features')
 * await store.destroy()
 * ```
 */
export class NatsConfigStore extends ConfigStoreBaseClass<NatsConfigStoreConfig> {
	/**
	 * Active NATS connection, created lazily by `getStore`.
	 */
	public connection: NatsConnection | undefined

	/**
	 * JSON codec used to encode and decode values in the key-value bucket.
	 */
	sc = JSONCodec()
	/**
	 * Cached JetStream key-value bucket handle.
	 */
	kv: KV | undefined

	/**
	 * Creates a NATS JetStream-backed config store.
	 *
	 * @param config Store options plus NATS connection and KV bucket options.
	 */
	constructor(config?: StoreBaseConfig<Partial<NatsConfigStoreConfig>>) {
		const conf = {
			keyValueStoreName: 'purista-config-store',
			...config,
		}
		super('NatsConfigStore', { ...conf })
	}

	/**
	 * Returns a healthy JetStream key-value bucket handle.
	 *
	 * Reconnects when the previous connection was closed or is draining.
	 */
	async getStore() {
		const hasHealthyConnection = this.connection && !this.connection.isClosed() && !this.connection.isDraining()
		if (this.kv && hasHealthyConnection) {
			return this.kv
		}
		this.kv = undefined

		try {
			this.connection = await connect({ ...this.config, name: this.name })
		} catch (error) {
			this.connection = undefined
			const err = UnhandledError.fromError(error)
			this.logger.error({ err }, err.message)
			throw err
		}

		if (!this.connection.info?.jetstream) {
			const err = new UnhandledError(StatusCode.BadGateway, 'JetStream is not enabled on NATS server')
			this.logger.error({ err }, err.message)
			await this.connection.close()
			this.connection = undefined
			throw err
		}

		const js = this.connection.jetstream()
		this.kv = await js.views.kv(this.config.keyValueStoreName, this.config)

		return this.kv
	}

	protected async getConfigImpl<ConfigNames extends string[]>(
		...stateNames: ConfigNames
	): Promise<ObjectWithKeysFromStringArray<ConfigNames>> {
		const store = await this.getStore()

		const result: Record<string, unknown> = {}
		for await (const name of stateNames) {
			try {
				const entry = await store.get(name)
				result[name] = entry?.value && entry?.value.length > 0 ? this.sc.decode(entry.value) : undefined
			} catch (err) {
				const msg = `error in state store getting value ${name}`
				this.logger.error({ err }, msg)
				throw new UnhandledError(StatusCode.InternalServerError, msg)
			}
		}
		return result as ObjectWithKeysFromStringArray<ConfigNames>
	}

	protected async removeConfigImpl(stateName: string) {
		const store = await this.getStore()

		try {
			await store.delete(stateName)
		} catch (err) {
			const msg = `error in state store removing value ${stateName}`
			this.logger.error({ err }, msg)
			throw new UnhandledError(StatusCode.InternalServerError, msg)
		}
	}

	protected async setConfigImpl(stateName: string, stateValue: unknown) {
		const store = await this.getStore()

		try {
			await store.put(stateName, this.sc.encode(stateValue))
		} catch (err) {
			const msg = `error in state store setting value ${stateName}`
			this.logger.error({ err }, msg)
			throw new UnhandledError(StatusCode.InternalServerError, msg)
		}
	}

	/**
	 * Drains and closes the NATS connection and clears cached handles.
	 *
	 * Call this during application shutdown.
	 */
	async destroy() {
		await this.connection?.drain()
		await this.connection?.close()
		this.kv = undefined
		this.connection = undefined
	}
}
