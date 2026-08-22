import { initLogger } from '../../DefaultLogger/initLogger.impl.js'
import type { ObjectWithKeysFromStringArray } from '../../helper/types/ObjectWithKeysFromStringArray.js'
import { UnhandledError } from '../Error/UnhandledError.impl.js'
import type { EmptyObject } from '../types/EmptyObject.js'
import type { Logger } from '../types/Logger.js'
import type { Prettify } from '../types/Prettify.js'
import type { ServiceObservabilityContext } from '../types/ServiceObservability.js'
import { StatusCode } from '../types/StatusCode.enum.js'
import type { StoreBaseConfig } from '../types/StoreBaseConfig.js'
import type { SecretStoreCacheMap } from './types/SecretStoreCacheMap.js'

/**
 * Base class for secret store adapters.
 *
 * The base class enforces operation toggles and optional cache behavior before
 * delegating to adapter implementations. Adapter logs, traces, metrics, and
 * errors must never include secret values.
 *
 * The actual store implementation must overwrite the protected methods:
 *
 * - `getSecretImpl`
 * - `setSecretImpl`
 * - `removeSecretImpl`
 *
 * __DO NOT OVERWRITE__: the regular methods getSecret, setSecret or removeSecret
 *
 * @group Store
 */
export abstract class SecretStoreBaseClass<SecretStoreConfigType extends Record<string, unknown> = EmptyObject> {
	/** Child logger scoped to the store name. */
	logger: Logger
	/** Store configuration including operation toggles and cache settings. */
	config: Prettify<StoreBaseConfig<SecretStoreConfigType>>

	/** Store name used in logs and diagnostics. */
	name: string
	private readonly hasExplicitLogger: boolean

	/** Optional in-memory cache of secret values. */
	cache: SecretStoreCacheMap = new Map()

	constructor(name: string, config: StoreBaseConfig<SecretStoreConfigType>) {
		const logger = config?.logger ?? initLogger(config?.logLevel)
		this.hasExplicitLogger = config?.logger !== undefined
		this.logger = logger.getChildLogger({ name })

		this.name = name

		this.config = {
			enableGet: true,
			enableSet: false,
			enableRemove: false,
			enableCache: false,
			...config,
		}
	}

	/** Inherit a service logger only when this store was not explicitly configured. */
	inheritServiceObservability(context: ServiceObservabilityContext): void {
		if (!this.hasExplicitLogger) {
			this.logger = context.logger.getChildLogger({ name: this.name })
		}
	}

	/**
	 * Adapter-specific secret lookup implementation.
	 *
	 * Implementations must not log returned secret values.
	 */
	protected abstract getSecretImpl<SecretNames extends string[]>(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		...secretNames: SecretNames
	): Promise<ObjectWithKeysFromStringArray<SecretNames, string | undefined>>

	/**
	 * Get one or more secrets by name.
	 *
	 * Returned values are sensitive. Keep them out of logs, metrics, traces,
	 * events, queue headers, and error payloads.
	 */
	async getSecret<SecretNames extends string[]>(
		...secretNames: SecretNames
	): Promise<ObjectWithKeysFromStringArray<SecretNames, string | undefined>> {
		if (!this.config.enableGet) {
			const err = new UnhandledError(StatusCode.Unauthorized, 'get secret from store is disabled by config')
			this.logger.error({ err }, err.message)
			throw err
		}

		if (!this.config.enableCache) {
			return this.getSecretImpl(...secretNames)
		}

		const result: Record<string, string | undefined> = {}
		const toFetch: string[] = []

		for (const secret of secretNames) {
			const cachedValue = this.cache.get(secret)
			result[secret] = undefined
			if (cachedValue) {
				if (this.config.cacheTtl !== undefined) {
					if (cachedValue.createdAt + this.config.cacheTtl >= Date.now()) {
						result[secret] = cachedValue.value
					} else {
						toFetch.push(secret)
					}
				} else {
					result[secret] = cachedValue.value
				}
			} else {
				toFetch.push(secret)
			}
		}

		if (!toFetch.length) {
			return result as ObjectWithKeysFromStringArray<SecretNames, string | undefined>
		}

		const freshSecrets = await this.getSecretImpl(...toFetch)

		for (const secret of toFetch) {
			const value = freshSecrets[secret]
			if (value !== undefined) {
				this.cache.set(secret, { value, createdAt: Date.now() })
			} else {
				this.cache.delete(secret)
			}
		}

		return { ...result, ...freshSecrets } as ObjectWithKeysFromStringArray<SecretNames, string | undefined>
	}

	/** Adapter-specific secret removal implementation. */
	protected abstract removeSecretImpl(_secretName: string): Promise<void>

	/** Remove one secret by name. */
	async removeSecret(secretName: string): Promise<void> {
		if (!this.config.enableRemove) {
			const err = new UnhandledError(StatusCode.Unauthorized, 'remove secret from store is disabled by config')
			this.logger.error({ err }, err.message)
			throw err
		}

		if (this.config.enableCache) {
			this.cache.delete(secretName)
		}

		return this.removeSecretImpl(secretName)
	}

	/**
	 * Adapter-specific secret write implementation.
	 *
	 * Implementations must not log `secretValue`.
	 */
	protected abstract setSecretImpl(_secretName: string, _secretValue: string): Promise<void>

	/** Store or replace one secret value. */
	async setSecret(secretName: string, secretValue: string) {
		if (!this.config.enableSet) {
			const err = new UnhandledError(StatusCode.Unauthorized, 'set secret at store is disabled by config')
			this.logger.error({ err }, err.message)
			throw err
		}

		const result = await this.setSecretImpl(secretName, secretValue)

		if (this.config.enableCache) {
			this.cache.set(secretName, { value: secretValue, createdAt: Date.now() })
		}

		return result
	}

	/** Shutdown hook for store adapters. */
	async destroy() {
		this.logger.info('stopped')
	}
}
