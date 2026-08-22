import { initLogger } from '../../DefaultLogger/initLogger.impl.js'
import type { ObjectWithKeysFromStringArray } from '../../helper/types/ObjectWithKeysFromStringArray.js'
import { UnhandledError } from '../Error/UnhandledError.impl.js'
import type { EmptyObject } from '../types/EmptyObject.js'
import type { Logger } from '../types/Logger.js'
import type { ServiceObservabilityContext } from '../types/ServiceObservability.js'
import { StatusCode } from '../types/StatusCode.enum.js'
import type { StoreBaseConfig } from '../types/StoreBaseConfig.js'
import type { ConfigStoreCacheMap } from './types/ConfigStoreCacheMap.js'

/**
 * Base class for config store adapters.
 *
 * The base class enforces operation toggles before delegating to adapter
 * implementations. Adapter authors should implement only the protected `*Impl`
 * methods so capability checks, safe logging, and common error behavior stay
 * consistent.
 *
 * The actual store implementation must overwrite the protected methods:
 *
 * - `getConfigImpl`
 * - `setConfigImpl`
 * - `removeConfigImpl`
 *
 * __DO NOT OVERWRITE__: the regular methods getConfig, setConfig or removeConfig
 *
 * @group Store
 */
export abstract class ConfigStoreBaseClass<ConfigStoreConfigType extends Record<string, unknown> = EmptyObject> {
	/** Child logger scoped to the store name. */
	logger: Logger
	/** Store configuration including operation toggles and cache settings. */
	config: StoreBaseConfig<ConfigStoreConfigType>

	/** Store name used in logs and diagnostics. */
	name: string
	private readonly hasExplicitLogger: boolean

	/** Optional local cache used by store implementations that opt in. */
	cache: ConfigStoreCacheMap = new Map()

	constructor(name: string, config: StoreBaseConfig<ConfigStoreConfigType>) {
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
	 * This method must be overwritten by actual store implementation.
	 *
	 * @param configNames list of config items
	 * @returns an object of { [configName]: value | undefined }
	 */
	protected abstract getConfigImpl<ConfigNames extends string[]>(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		...configNames: ConfigNames
	): Promise<ObjectWithKeysFromStringArray<ConfigNames>>

	/**
	 * Returns the values for given config properties.
	 *
	 * Values may contain sensitive configuration. Avoid logging returned values
	 * unless an application policy explicitly allows the exact fields.
	 *
	 * This function **SHOULD NOT** be overwritten by store implementation.
	 * For implementation overwrite protected `getConfigImpl`
	 *
	 * @param configNames
	 * @returns an object of { [configName]: value | undefined }
	 */
	async getConfig<ConfigNames extends string[]>(
		...configNames: ConfigNames
	): Promise<ObjectWithKeysFromStringArray<ConfigNames>> {
		if (!this.config.enableGet) {
			const err = new UnhandledError(StatusCode.Unauthorized, 'get config from store is disabled by config')
			this.logger.error({ err }, err.message)
			throw err
		}
		return this.getConfigImpl(...configNames)
	}

	/**
	 * This method must be overwritten by actual store implementation.
	 *
	 * @param configName
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected abstract removeConfigImpl(configName: string): Promise<void>

	/**
	 * Removes the config item given by config name.
	 *
	 * This function **SHOULD NOT** be overwritten by store implementation.
	 * For implementation overwrite protected `removeConfigImpl`
	 *
	 * @param configName
	 * @returns
	 */
	async removeConfig(configName: string): Promise<void> {
		if (!this.config.enableRemove) {
			const err = new UnhandledError(StatusCode.Unauthorized, 'remove config from store is disabled by config')
			this.logger.error({ err }, err.message)
			throw err
		}

		return this.removeConfigImpl(configName)
	}

	/**
	 * This method must be overwritten by actual store implementation.
	 *
	 * @param _configName
	 * @param _configValue
	 */
	protected abstract setConfigImpl(_configName: string, _configValue: unknown): Promise<void>

	/**
	 * Sets a config value.
	 *
	 * Values are passed directly to the adapter. Do not emit raw values in
	 * adapter logs, metrics, or traces.
	 *
	 * This function **SHOULD NOT** be overwritten by store implementation.
	 * For implementation overwrite protected `setConfigImpl`
	 *
	 * @param configName
	 * @param configValue
	 * @returns
	 */
	async setConfig(configName: string, configValue: unknown) {
		if (!this.config.enableSet) {
			const err = new UnhandledError(StatusCode.Unauthorized, 'set config at store is disabled by config')
			this.logger.error({ err }, err.message)
			throw err
		}

		return this.setConfigImpl(configName, configValue)
	}

	/** Shutdown hook for store adapters. */
	async destroy() {
		this.logger.info('stopped')
	}
}
