import { StateStoreBaseClass } from '../core/StateStore/StateStoreBaseClass.impl.js'
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
	private map = new Map<string, unknown>()
	constructor(config?: StoreBaseConfig<DefaultStateStoreConfig>) {
		super('DefaultStateStore', { ...config })
		if (config?.config) {
			this.map = new Map(Object.entries(config.config))
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
			result[name] = this.map.get(name)
		}
		return result as ObjectWithKeysFromStringArray<StateNames>
	}

	protected async setStateImpl(stateName: string, stateValue: unknown) {
		this.map.set(stateName, stateValue)
	}

	protected async removeStateImpl(stateName: string) {
		this.map.delete(stateName)
	}
}
