import { initLogger } from '../../DefaultLogger/initLogger.impl.js'
import type { ObjectWithKeysFromStringArray } from '../../helper/types/ObjectWithKeysFromStringArray.js'
import { UnhandledError } from '../Error/UnhandledError.impl.js'
import type { EmptyObject } from '../types/EmptyObject.js'
import type { Logger } from '../types/Logger.js'
import type { ServiceObservabilityContext } from '../types/ServiceObservability.js'
import { StatusCode } from '../types/StatusCode.enum.js'
import {
	type ResolvedStateWriteOptions,
	resolveStateWriteOptions,
	type StateStoreCapabilities,
	type StateStoreConfig,
	type StateWriteOptions,
	stateStoreCapabilitiesWithoutExpiry,
} from './types/index.js'

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
	/** Store configuration including operation toggles and default retention. */
	config: StateStoreConfig<StateStoreConfigType>

	/** Store name used in logs and diagnostics. */
	name: string
	private readonly hasExplicitLogger: boolean

	/**
	 * Guarantees provided by this adapter.
	 *
	 * The default intentionally supports permanent values only. Adapters must
	 * opt into `atomicExpiry` only when the value and deadline are committed in
	 * one backend operation.
	 */
	readonly capabilities: StateStoreCapabilities

	constructor(
		name: string,
		config: StateStoreConfig<StateStoreConfigType>,
		capabilities: StateStoreCapabilities = stateStoreCapabilitiesWithoutExpiry,
	) {
		const logger = config?.logger ?? initLogger(config?.logLevel)
		this.hasExplicitLogger = config?.logger !== undefined
		this.logger = logger.getChildLogger({ name })

		this.name = name
		this.capabilities = capabilities

		this.config = {
			enableGet: true,
			enableSet: true,
			enableRemove: true,
			...config,
		}
	}

	/** Inherit a service logger only when this store was not explicitly configured. */
	inheritServiceObservability(context: ServiceObservabilityContext): void {
		if (!this.hasExplicitLogger) {
			this.logger = context.logger.getChildLogger({ name: this.name })
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
	/**
	 * Adapter-specific state write implementation.
	 *
	 * `options.retention` has already been resolved by the base class. Existing
	 * adapters can omit this final parameter while they only support permanent
	 * values; an expiring write will be rejected before reaching them.
	 */
	protected abstract setStateImpl(
		stateName: string,
		stateValue: unknown,
		options: ResolvedStateWriteOptions,
	): Promise<void>

	/**
	 * Store or replace one state value.
	 *
	 * Omitting `options` uses the StateStore instance default, or retains a value
	 * forever when no default exists. Expiring values require an adapter that
	 * declares native atomic expiry; PURISTA never silently turns a requested TTL
	 * into a permanent value.
	 */
	async setState(stateName: string, stateValue: unknown, options?: StateWriteOptions) {
		if (!this.config.enableSet) {
			const err = new UnhandledError(StatusCode.Unauthorized, 'set state at store is disabled by config')
			this.logger.error({ err }, err.message)
			throw err
		}

		const resolvedOptions = resolveStateWriteOptions(options, this.config.retention?.default)
		if (resolvedOptions.retention.mode === 'expire' && !this.capabilities.retention.atomicExpiry) {
			const err = new UnhandledError(
				StatusCode.NotImplemented,
				`state store "${this.name}" does not support atomic expiry`,
			)
			this.logger.error({ err }, err.message)
			throw err
		}

		return this.setStateImpl(stateName, stateValue, resolvedOptions)
	}

	/** Shutdown hook for store adapters. */
	async destroy() {
		this.logger.info('stopped')
	}
}
