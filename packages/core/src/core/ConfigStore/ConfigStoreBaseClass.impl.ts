import { Logger, StatusCode, StoreBaseConfig } from '../../core'
import { initLogger } from '../../DefaultLogger'
import { UnhandledError } from '../Error'
import { ConfigStore } from './types'

/**
 * Base class for config store adapters
 *
 * @group Store
 */
export class ConfigStoreBaseClass<ConfigType> implements ConfigStore {
  logger: Logger
  config: StoreBaseConfig<ConfigType>

  name: string

  constructor(name: string, config?: StoreBaseConfig<ConfigType>) {
    const logger = config?.logger || initLogger()
    this.logger = logger.getChildLogger({ name })

    this.name = name

    this.config = {
      enableGet: true,
      enableSet: false,
      enableRemove: false,
      ...config,
    }
  }

  async getConfig(..._configNames: string[]): Promise<Record<string, unknown | undefined>> {
    if (!this.config.enableGet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'get config from store is disabled by config')
    }

    const err = new UnhandledError(StatusCode.NotImplemented, 'get config is not implemented in config store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async removeConfig(_configName: string): Promise<void> {
    if (!this.config.enableRemove) {
      throw new UnhandledError(StatusCode.Unauthorized, 'remove config from store is disabled by config')
    }

    const err = new UnhandledError(StatusCode.NotImplemented, 'remove config is not implemented in config store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async setConfig(_configName: string, _configValue: unknown) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set config at store is disabled by config')
    }

    const err = new UnhandledError(StatusCode.NotImplemented, 'set config is not implemented in config store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async destroy() {
    this.logger.info('stopped')
  }
}
