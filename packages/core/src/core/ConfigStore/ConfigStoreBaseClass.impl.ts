import type { Logger, StoreBaseConfig } from '../../core'
import { StatusCode } from '../../core'
import { initLogger } from '../../DefaultLogger'
import { UnhandledError } from '../Error'
import type { ConfigStore, ConfigStoreCacheMap } from './types'

/**
 * Base class for config store adapters
 *
 * @group Store
 */
export class ConfigStoreBaseClass<ConfigType extends Record<string, unknown> = {}> implements ConfigStore {
  logger: Logger
  config: StoreBaseConfig<ConfigType>

  name: string

  cache: ConfigStoreCacheMap = new Map()

  constructor(name: string, config: StoreBaseConfig<ConfigType>) {
    const logger = config?.logger || initLogger(config?.logLevel)
    this.logger = logger.getChildLogger({ name })

    this.name = name

    this.config = {
      enableGet: true,
      enableSet: false,
      enableRemove: false,
      enableCache: false,
      ...config,
    }
  }

  protected async getConfigImpl(..._configNames: string[]): Promise<Record<string, unknown>> {
    const err = new UnhandledError(StatusCode.NotImplemented, 'get config is not implemented in config store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async getConfig(...configNames: string[]): Promise<Record<string, unknown>> {
    if (!this.config.enableGet) {
      const err = new UnhandledError(StatusCode.Unauthorized, 'get config from store is disabled by config')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.getConfigImpl(...configNames)
  }

  protected async removeConfigImpl(_configName: string): Promise<void> {
    const err = new UnhandledError(StatusCode.NotImplemented, 'remove config is not implemented in config store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async removeConfig(configName: string): Promise<void> {
    if (!this.config.enableRemove) {
      const err = new UnhandledError(StatusCode.Unauthorized, 'remove config from store is disabled by config')
      this.logger.error({ err }, err.message)
      throw err
    }

    return this.removeConfigImpl(configName)
  }

  protected async setConfigImpl(_configName: string, _configValue: unknown) {
    const err = new UnhandledError(StatusCode.NotImplemented, 'set config is not implemented in config store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async setConfig(configName: string, configValue: unknown) {
    if (!this.config.enableSet) {
      const err = new UnhandledError(StatusCode.Unauthorized, 'set config at store is disabled by config')
      this.logger.error({ err }, err.message)
      throw err
    }

    return this.setConfigImpl(configName, configValue)
  }

  async destroy() {
    this.logger.info('stopped')
  }
}
