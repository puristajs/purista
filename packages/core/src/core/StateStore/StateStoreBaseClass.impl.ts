import { initLogger } from '../../DefaultLogger/initLogger.impl.js'
import type { ObjectWithKeysFromStringArray } from '../../helper/types/ObjectWithKeysFromStringArray.js'
import { UnhandledError } from '../Error/UnhandledError.impl.js'
import type { EmptyObject } from '../types/EmptyObject.js'
import type { Logger } from '../types/Logger.js'
import { StatusCode } from '../types/StatusCode.enum.js'
import type { StoreBaseConfig } from '../types/StoreBaseConfig.js'

/**
 * Base class for state store implementations.
 *
 * The base class enforces operation toggles before delegating to adapter
 * implementations. State values may contain user or business data; minimize
 * what is written and avoid logging raw values.
 *
 * The actual store implementation must overwrite the protected methods:
 *
 * - `getStateImpl`
 * - `setStateImpl`
 * - `removeStateImpl`
 *
 * __DO NOT OVERWRITE__: the regular methods getState, setState or removeState
 * @group Store
 */
export abstract class StateStoreBaseClass<StateStoreConfigType extends Record<string, unknown> = EmptyObject> {
	/** Child logger scoped to the store name. */
	logger: Logger
	/** Store configuration including operation toggles. */
	config: StoreBaseConfig<StateStoreConfigType>

	/** Store name used in logs and diagnostics. */
	name: string

	constructor(name: string, config: StoreBaseConfig<StateStoreConfigType>) {
		const logger = config?.logger ?? initLogger(config?.logLevel)
		this.logger = logger.getChildLogger({ name })

		this.name = name

		this.config = {
			enableGet: true,
			enableSet: true,
			enableRemove: true,
			...config,
		}
	}

	/** Adapter-specific state lookup implementation. */
	protected abstract getStateImpl<StateNames extends string[]>(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		...stateNames: StateNames
	): Promise<ObjectWithKeysFromStringArray<StateNames>>

	/**
	 * Get one or more state values by name.
	 *
	 * Returned values should not be logged or emitted unless explicitly safe.
	 */
	async getState<StateNames extends string[]>(
		...stateNames: StateNames
	): Promise<ObjectWithKeysFromStringArray<StateNames>> {
		if (!this.config.enableGet) {
			const err = new UnhandledError(StatusCode.Unauthorized, 'get state from store is disabled by config')
			this.logger.error({ err }, err.message)
			throw err
		}

		return this.getStateImpl(...stateNames)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	/** Adapter-specific state removal implementation. */
	protected abstract removeStateImpl(stateName: string): Promise<void>

	/** Remove one state value by name. */
	async removeState(stateName: string) {
		if (!this.config.enableRemove) {
			const err = new UnhandledError(StatusCode.Unauthorized, 'remove state from store is disabled by config')
			this.logger.error({ err }, err.message)
			throw err
		}

		return this.removeStateImpl(stateName)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	/** Adapter-specific state write implementation. */
	protected abstract setStateImpl(stateName: string, stateValue: unknown): Promise<void>

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	/** Store or replace one state value. */
	async setState(stateName: string, stateValue: unknown) {
		if (!this.config.enableSet) {
			const err = new UnhandledError(StatusCode.Unauthorized, 'set state at store is disabled by config')
			this.logger.error({ err }, err.message)
			throw err
		}

		return this.setStateImpl(stateName, stateValue)
	}

	/** Shutdown hook for store adapters. */
	async destroy() {
		this.logger.info('stopped')
	}
}
