import type { StateStore, StoreBaseConfig } from '../core/index.js'
import { StateStoreBaseClass } from '../core/index.js'
import type { ObjectWithKeysFromStringArray } from '../helper/index.js'
import type { DefaultStateStoreConfig } from './types/index.js'

/**
 * The DefaultStateStore is a placeholder which offers all needed methods.
 * Getters and setters will throw a UnhandledError with status `Not implemented`
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
