import { initLogger } from '../../DefaultLogger'
import { UnhandledError } from '../Error'
import { Logger, Prettify, StatusCode, StoreBaseConfig } from '../types'
import type { SecretStore, SecretStoreCacheMap } from './types'

/**
 * Base class for secret store adapters
 *
 * @group Store
 */
export class SecretStoreBaseClass<ConfigType extends Record<string, unknown> = {}> implements SecretStore {
  logger: Logger
  config: Prettify<StoreBaseConfig<ConfigType>>

  name: string

  cache: SecretStoreCacheMap = new Map()

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

  async getSecret(..._secretNames: string[]): Promise<Record<string, string | undefined>> {
    if (!this.config.enableGet) {
      const err = new UnhandledError(StatusCode.Unauthorized, 'get secret from store is disabled by config')
      this.logger.error({ err }, err.message)
      throw err
    }

    const err = new UnhandledError(StatusCode.NotImplemented, 'get secret is not implemented in secret store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async removeSecret(_secretName: string): Promise<void> {
    if (!this.config.enableRemove) {
      const err = new UnhandledError(StatusCode.Unauthorized, 'remove secret from store is disabled by config')
      this.logger.error({ err }, err.message)
      throw err
    }

    const err = new UnhandledError(StatusCode.NotImplemented, 'remove secret is not implemented in secret store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async setSecret(_secretName: string, _secretValue: string) {
    if (!this.config.enableSet) {
      const err = new UnhandledError(StatusCode.Unauthorized, 'set secret at store is disabled by config')
      this.logger.error({ err }, err.message)
      throw err
    }

    const err = new UnhandledError(StatusCode.NotImplemented, 'set secret is not implemented in secret store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async destroy() {
    this.logger.info('stopped')
  }
}
