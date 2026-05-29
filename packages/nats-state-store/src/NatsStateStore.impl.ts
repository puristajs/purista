import type { ObjectWithKeysFromStringArray, StoreBaseConfig } from '@purista/core'
import { StateStoreBaseClass, StatusCode, UnhandledError } from '@purista/core'
import type { KV, NatsConnection } from 'nats'
import { connect, JSONCodec } from 'nats'

import type { NatsStateStoreConfig } from './types/NatsStateStoreConfig.js'

/**
 * State store backed by a NATS JetStream key-value bucket.
 *
 * JetStream must be enabled on the NATS server. Values are encoded with the NATS
 * `JSONCodec`, so stored values must be JSON-compatible. This store keeps only
 * the NATS connection and KV bucket handle in memory; values are read from the
 * bucket for each operation.
 *
 * The default bucket is `purista-state-store`. Use tenant-aware keys such as
 * `tenant.acme.prod.cart.session-123`. State can contain sensitive data, so keep
 * payloads minimal and configure NATS authentication/TLS in shared environments.
 *
 * @example
 * ```typescript
 * const store = new NatsStateStore({
 *   servers: 'nats://localhost:4222',
 *   keyValueStoreName: 'purista-state-store',
 * })
 *
 * await store.setState('tenant.acme.prod.cart.session-123', { step: 'shipping' })
 * const state = await store.getState('tenant.acme.prod.cart.session-123')
 * await store.destroy()
 * ```
 */
export class NatsStateStore extends StateStoreBaseClass<NatsStateStoreConfig> {
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
	 * Creates a NATS JetStream-backed state store.
	 *
	 * @param config Store options plus NATS connection and KV bucket options.
	 */
	constructor(config?: StoreBaseConfig<Partial<NatsStateStoreConfig>>) {
		const conf = {
			keyValueStoreName: 'purista-state-store',
			...config,
		}
		super('NatsStateStore', { ...conf })
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

	protected async getStateImpl<StateNames extends string[]>(
		...stateNames: StateNames
	): Promise<ObjectWithKeysFromStringArray<StateNames>> {
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
		return result as ObjectWithKeysFromStringArray<StateNames>
	}

	protected async removeStateImpl(stateName: string) {
		const store = await this.getStore()

		try {
			await store.delete(stateName)
		} catch (err) {
			const msg = `error in state store removing value ${stateName}`
			this.logger.error({ err }, msg)
			throw new UnhandledError(StatusCode.InternalServerError, msg)
		}
	}

	protected async setStateImpl(stateName: string, stateValue: unknown) {
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
