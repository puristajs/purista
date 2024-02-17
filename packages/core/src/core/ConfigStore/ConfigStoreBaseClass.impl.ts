import { initLogger } from '../../DefaultLogger/index.js'
import type { ObjectWithKeysFromStringArray } from '../../helper/index.js'
import { UnhandledError } from '../Error/index.js'
import type { Logger, StoreBaseConfig } from '../types/index.js'
import { StatusCode } from '../types/index.js'
import type { ConfigStore, ConfigStoreCacheMap } from './types/index.js'

/**
 * Base class for config store adapters.
 * The actual store implementation must overwrite the protected methods:
 *
 * - `getConfigImpl`
 * - `setConfigImpl`
 * - `removeConfigImpl`
 *
 * __DO NOT OVERWRITE__: the regular methods getConfig, setConfig or removeConfig
 *
 * @group Store
 */
export class ConfigStoreBaseClass<ConfigStoreConfigType extends Record<string, unknown> = {}> implements ConfigStore {
  logger: Logger
  config: StoreBaseConfig<ConfigStoreConfigType>

  name: string

  cache: ConfigStoreCacheMap = new Map()

  constructor(name: string, config: StoreBaseConfig<ConfigStoreConfigType>) {
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

  /**
   * This method must be overwritten by actual store implementation.
   *
   * @param configNames list of config items
   * @returns an object of { [configName]: value | undefined }
   */
  protected async getConfigImpl<ConfigNames extends string[]>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ...configNames: ConfigNames
  ): Promise<ObjectWithKeysFromStringArray<ConfigNames>> {
    const err = new UnhandledError(StatusCode.NotImplemented, 'get config is not implemented in config store')
    this.logger.error({ err }, err.message)
    throw err
  }

  /**
   * Returns the values for given config properties.
   * This function **SHOULD NOT** be overwritten by store implementation.
   * For implementation overwrite protected `getConfigImpl`
   *
   * @param configNames
   * @returns an object of { [configName]: value | undefined }
   */
  async getConfig<ConfigNames extends string[]>(
    ...configNames: ConfigNames
  ): Promise<ObjectWithKeysFromStringArray<ConfigNames>> {
    if (!this.config.enableGet) {
      const err = new UnhandledError(StatusCode.Unauthorized, 'get config from store is disabled by config')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.getConfigImpl(...configNames)
  }

  /**
   * This method must be overwritten by actual store implementation.
   *
   * @param configName
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async removeConfigImpl(configName: string): Promise<void> {
    const err = new UnhandledError(StatusCode.NotImplemented, 'remove config is not implemented in config store')
    this.logger.error({ err }, err.message)
    throw err
  }

  /**
   * Removes the config item given by config name.
   * This function **SHOULD NOT** be overwritten by store implementation.
   * For implementation overwrite protected `removeConfigImpl`
   *
   * @param configName
   * @returns
   */
  async removeConfig(configName: string): Promise<void> {
    if (!this.config.enableRemove) {
      const err = new UnhandledError(StatusCode.Unauthorized, 'remove config from store is disabled by config')
      this.logger.error({ err }, err.message)
      throw err
    }

    return this.removeConfigImpl(configName)
  }

  /**
   * This method must be overwritten by actual store implementation.
   *
   * @param _configName
   * @param _configValue
   */
  protected async setConfigImpl(_configName: string, _configValue: unknown) {
    const err = new UnhandledError(StatusCode.NotImplemented, 'set config is not implemented in config store')
    this.logger.error({ err }, err.message)
    throw err
  }

  /**
   * Sets a config value
   * This function **SHOULD NOT** be overwritten by store implementation.
   * For implementation overwrite protected `setConfigImpl`
   *
   * @param configName
   * @param configValue
   * @returns
   */
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
