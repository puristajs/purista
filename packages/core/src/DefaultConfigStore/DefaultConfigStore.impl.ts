import { ConfigStoreBaseClass, StatusCode, StoreBaseConfig, UnhandledError } from '../core'
import { DefaultConfigStoreConfig } from './types'

/**
 * The DefaultConfigStore is a placeholder which offers all needed methods.
 * Getters and setters will throw a UnhandledError with status `Unauthorized`, when a disabled operation is called.
 *
 * For development and testing purpose, you can initiate the store with values.
 *
 * @example ```typescript
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
export class DefaultConfigStore extends ConfigStoreBaseClass<DefaultConfigStoreConfig> {
  private map = new Map<string, unknown>()
  constructor(config?: StoreBaseConfig<DefaultConfigStoreConfig>) {
    super('DefaultConfigStore', config)
    if (config?.config) {
      this.map = new Map(Object.entries(config.config))
      if (config.logger) {
        this.logger.warn(
          'Using the DefaultConfigStore is not secure! It should only be used for test or development purpose.',
        )
      }
    }
  }

  async getConfig(...configNames: string[]) {
    if (!this.config.enableGet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'get config from store is disabled by config')
    }

    const result: Record<string, unknown | undefined> = {}
    configNames.forEach((name) => {
      result[name] = this.map.get(name)
    })
    return result
  }

  async setConfig(configName: string, configValue: unknown) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set config at store is disabled by config')
    }

    this.map.set(configName, configValue)
  }

  async removeConfig(configName: string) {
    if (!this.config.enableRemove) {
      throw new UnhandledError(StatusCode.Unauthorized, 'remove config from store is disabled by config')
    }

    this.map.delete(configName)
  }
}
