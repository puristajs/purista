import { initLogger } from '../DefaultLogger'
import { UnhandledError } from '../Error'
import { Logger, StatusCode, StoreBaseConfig } from '../types'
import { SecretStore } from './types'

/**
 * Base class for secret store adapters
 *
 * @group Store
 */
export class SecretStoreBaseClass<ConfigType> implements SecretStore {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getSecret(...secretNames: string[]): Promise<Record<string, string | undefined>> {
    if (!this.config.enableGet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'get secret from store is disabled by config')
    }

    const err = new UnhandledError(StatusCode.NotImplemented, 'get secret is not implemented in secret store')
    this.logger.error({ err }, err.message)
    throw err
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async removeSecret(secretName: string): Promise<void> {
    if (!this.config.enableRemove) {
      throw new UnhandledError(StatusCode.Unauthorized, 'remove secret from store is disabled by config')
    }

    const err = new UnhandledError(StatusCode.NotImplemented, 'remove secret is not implemented in secret store')
    this.logger.error({ err }, err.message)
    throw err
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async setSecret(secretName: string, secretValue: string) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set secret at store is disabled by config')
    }

    const err = new UnhandledError(StatusCode.NotImplemented, 'set secret is not implemented in secret store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async destroy() {
    this.logger.info('stopped')
  }
}
