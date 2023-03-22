import { initLogger } from '../DefaultLogger'
import { UnhandledError } from '../Error'
import { Logger, StatusCode } from '../types'

/**
 * Base class for secret store adapters
 */
export class SecretStoreBaseClass<ConfigType = Record<string, unknown>> {
  logger: Logger
  config: ConfigType

  name: string

  constructor(name: string, config?: ConfigType, options?: { logger?: Logger }) {
    const logger = options?.logger || initLogger()
    this.logger = logger.getChildLogger({ name })

    this.name = name

    this.config = config || ({} as ConfigType)
  }

  async getSecret(..._secretNames: string[]): Promise<Record<string, unknown>> {
    const err = new UnhandledError(StatusCode.NotImplemented, 'getSecret is not implemented in secret store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async removeSecret(_secretName: string): Promise<void> {
    const err = new UnhandledError(StatusCode.NotImplemented, 'removeSecret is not implemented in secret store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async setSecret(_secretName: string, _secretValue: unknown) {
    const err = new UnhandledError(StatusCode.NotImplemented, 'setSecret is not implemented in secret store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async destroy() {
    this.logger.info('stopped')
  }
}
