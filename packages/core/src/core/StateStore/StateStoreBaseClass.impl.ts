import { initLogger } from '../../DefaultLogger'
import { UnhandledError } from '../Error'
import { Logger, StatusCode, StoreBaseConfig } from '../types'
import { StateStore } from './types'

/**
 * Base class for config store implementations
 *
 * @group Store
 */
export class StateStoreBaseClass<ConfigType> implements StateStore {
  logger: Logger
  config: StoreBaseConfig<ConfigType>

  name: string

  constructor(name: string, config?: StoreBaseConfig<ConfigType>) {
    const logger = config?.logger || initLogger(config?.logLevel)
    this.logger = logger.getChildLogger({ name })

    this.name = name

    this.config = {
      enableGet: true,
      enableSet: true,
      enableRemove: true,
      ...config,
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getState(...stateNames: string[]): Promise<Record<string, unknown | undefined>> {
    if (!this.config.enableGet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'get state from store is disabled by config')
    }

    const err = new UnhandledError(StatusCode.NotImplemented, 'getState is not implemented in state store')
    this.logger.error({ err }, err.message)
    throw err
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async removeState(stateName: string) {
    if (!this.config.enableRemove) {
      throw new UnhandledError(StatusCode.Unauthorized, 'remove state from store is disabled by config')
    }

    const err = new UnhandledError(StatusCode.NotImplemented, 'removeState is not implemented in state store')
    this.logger.error({ err }, err.message)
    throw err
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async setState(stateName: string, stateValue: unknown) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set state at store is disabled by config')
    }

    const err = new UnhandledError(StatusCode.NotImplemented, 'setState is not implemented in state store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async destroy() {
    this.logger.info('stopped')
  }
}
