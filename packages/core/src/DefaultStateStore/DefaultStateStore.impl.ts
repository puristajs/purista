import { StateStoreBaseClass, StatusCode, StoreBaseConfig, UnhandledError } from '../core'
import { DefaultStateStoreConfig } from './types'

/**
 * The DefaultStateStore is a placeholder which offers all needed methods.
 * Getters and setters will throw a UnhandledError with status `Not implemented`
 *
 * @group Store
 *
 */
export class DefaultStateStore extends StateStoreBaseClass<DefaultStateStoreConfig> {
  private map = new Map<string, unknown>()
  constructor(config?: StoreBaseConfig<DefaultStateStoreConfig>) {
    super('DefaultStateStore', { ...config })
    if (config?.config) {
      this.map = new Map(Object.entries(config.config))
      if (config.logger) {
        this.logger.warn(
          'Using the DefaultStateStore is not secure! It should only be used for test or development purpose.',
        )
      }
    }
  }

  async getState(...stateNames: string[]) {
    if (!this.config.enableGet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'get state from store is disabled by config')
    }

    const result: Record<string, unknown | undefined> = {}
    stateNames.forEach((name) => {
      result[name] = this.map.get(name)
    })
    return result
  }

  async setState(stateName: string, stateValue: unknown) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set state at store is disabled by config')
    }

    this.map.set(stateName, stateValue)
  }

  async removeState(stateName: string) {
    if (!this.config.enableRemove) {
      throw new UnhandledError(StatusCode.Unauthorized, 'remove state from store is disabled by config')
    }

    this.map.delete(stateName)
  }
}
