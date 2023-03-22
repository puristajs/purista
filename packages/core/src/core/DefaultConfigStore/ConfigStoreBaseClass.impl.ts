import { initLogger } from '../DefaultLogger'
import { UnhandledError } from '../Error'
import { ConfigStore, Logger, StatusCode } from '../types'

/**
 * Base class for config store adapters
 */
export class ConfigStoreBaseClass<ConfigType = Record<string, unknown>> implements ConfigStore {
  logger: Logger
  config: ConfigType

  name: string

  constructor(name: string, config?: ConfigType, options?: { logger?: Logger }) {
    const logger = options?.logger || initLogger()
    this.logger = logger.getChildLogger({ name })

    this.name = name

    this.config = config || ({} as ConfigType)
  }

  async getConfig(..._configNames: string[]): Promise<Record<string, unknown>> {
    const err = new UnhandledError(StatusCode.NotImplemented, 'getConfig is not implemented in config store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async removeConfig(_configName: string): Promise<void> {
    const err = new UnhandledError(StatusCode.NotImplemented, 'getConfig is not implemented in config store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async setConfig(_configName: string, _configValue: unknown) {
    const err = new UnhandledError(StatusCode.NotImplemented, 'setConfig is not implemented in config store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async destroy() {
    this.logger.info('stopped')
  }
}
