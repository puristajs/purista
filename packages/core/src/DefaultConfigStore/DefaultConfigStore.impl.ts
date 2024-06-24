import type { ConfigStore, StoreBaseConfig } from '../core/index.js'
import { ConfigStoreBaseClass, StatusCode, UnhandledError } from '../core/index.js'
import type { ObjectWithKeysFromStringArray } from '../helper/index.js'
import type { DefaultConfigStoreConfig } from './types/index.js'

/**
 * The DefaultConfigStore is a placeholder which offers all needed methods.
 * Getters and setters will throw a UnhandledError with status `Unauthorized`, when a disabled operation is called.
 *
 * For development and testing purpose, you can initiate the store with values.
 *
 * @example
 * ```typescript
 * const store = new DefaultConfigStore({
 *    enableGet: true,
 *    enableRemove: true,
 *    enableSet: true,
 *    config: {
 *      initialValue: 'initial',
 *    },
 * })
 *
 * console.log(await store.getConfig('initialValue') // outputs: { initialValue: 'initial' }
 * ```
 *
 * @group Store
 */
export class DefaultConfigStore extends ConfigStoreBaseClass<DefaultConfigStoreConfig> implements ConfigStore {
	private map = new Map<string, unknown>()
	constructor(config?: StoreBaseConfig<DefaultConfigStoreConfig>) {
		super('DefaultConfigStore', { ...config })
		if (config?.config) {
			this.map = new Map(Object.entries(config.config))
		}
		this.logger.warn(
			'Using the DefaultConfigStore is not secure! It should only be used for test or development purpose.',
		)
	}

	protected async getConfigImpl<ConfigNames extends string[]>(
		...configNames: ConfigNames
	): Promise<ObjectWithKeysFromStringArray<ConfigNames>> {
		if (!this.config.enableGet) {
			throw new UnhandledError(StatusCode.Unauthorized, 'get config from store is disabled by config')
		}

		const result = configNames.reduce((prev, current) => {
			return {
				// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
				...prev,
				[current]: this.map.get(current),
			}
		}, {}) as ObjectWithKeysFromStringArray<ConfigNames>

		return result
	}

	protected async setConfigImpl(configName: string, configValue: unknown) {
		this.map.set(configName, configValue)
	}

	protected async removeConfigImpl(configName: string) {
		this.map.delete(configName)
	}
}
