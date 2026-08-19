import { StateStoreBaseClass } from '../core/StateStore/StateStoreBaseClass.impl.js'
import type { ResolvedStateWriteOptions, StateStoreCapabilities } from '../core/StateStore/types/index.js'
import type { StateStore } from '../core/StateStore/types/StateStore.js'
import type { StoreBaseConfig } from '../core/types/StoreBaseConfig.js'
import type { ObjectWithKeysFromStringArray } from '../helper/types/ObjectWithKeysFromStringArray.js'
import type { DefaultStateStoreConfig } from './types/DefaultStateStoreConfig.js'

/**
 * Process-local in-memory state store for development and tests.
 *
 * The DefaultStateStore is a placeholder which offers all needed methods.
 * Getters and setters will throw a UnhandledError with status `Not implemented`
 * Values are lost on shutdown and should not be used as a production source of
 * truth.
 *
 * @group Store
 *
 */
export class DefaultStateStore extends StateStoreBaseClass<DefaultStateStoreConfig> implements StateStore {
	private map = new Map<string, { value: unknown; expiresAt?: number }>()
	constructor(config?: StoreBaseConfig<DefaultStateStoreConfig>) {
		const capabilities: StateStoreCapabilities = {
			retention: {
				atomicExpiry: true,
			},
		}
		super('DefaultStateStore', { ...config }, capabilities)
		if (config?.config) {
			this.map = new Map(Object.entries(config.config).map(([stateName, value]) => [stateName, { value }] as const))
		}
		this.logger.warn(
			'Using the DefaultStateStore is not secure! It should only be used for test or development purpose.',
		)
	}

	protected async getStateImpl<StateNames extends string[]>(
		...stateNames: StateNames
	): Promise<ObjectWithKeysFromStringArray<StateNames>> {
		const result: Record<string, unknown> = {}
		for (const name of stateNames) {
			const entry = this.map.get(name)
			if (entry?.expiresAt !== undefined && entry.expiresAt <= Date.now()) {
				this.map.delete(name)
				result[name] = undefined
				continue
			}
			result[name] = entry?.value
		}
		return result as ObjectWithKeysFromStringArray<StateNames>
	}

	protected async setStateImpl(stateName: string, stateValue: unknown, options: ResolvedStateWriteOptions) {
		this.map.set(stateName, {
			value: stateValue,
			expiresAt: options.retention.mode === 'expire' ? Date.now() + options.retention.ttlMs : undefined,
		})
	}

	protected async removeStateImpl(stateName: string) {
		this.map.delete(stateName)
	}
}
