import { initLogger } from '../DefaultLogger'
import { UnhandledError } from '../Error'
import { Logger, StateStore, StatusCode } from '../types'

/**
 * Base class for config store adapters
 */
export class StateStoreBaseClass<ConfigType = Record<string, unknown>> implements StateStore {
  logger: Logger
  config: ConfigType

  name: string

  constructor(name: string, config?: ConfigType, options?: { logger?: Logger }) {
    const logger = options?.logger || initLogger()
    this.logger = logger.getChildLogger({ name })

    this.name = name

    this.config = config || ({} as ConfigType)
  }

  async getState(..._stateNames: string[]): Promise<Record<string, unknown>> {
    const err = new UnhandledError(StatusCode.NotImplemented, 'getState is not implemented in state store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async removeState(_stateName: string) {
    const err = new UnhandledError(StatusCode.NotImplemented, 'removeState is not implemented in state store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async setState(_stateName: string, _stateValue: unknown) {
    const err = new UnhandledError(StatusCode.NotImplemented, 'setState is not implemented in state store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async destroy() {}
}
