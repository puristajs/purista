import { initLogger } from '../DefaultLogger'
import { Logger } from '../types'

/**
 * Base class for config store adapters
 */
export class ConfigStoreBaseClass<ConfigType = Record<string, unknown>> {
  logger: Logger
  config: ConfigType

  name: string

  started = false
  healthy = false

  constructor(name: string, config?: ConfigType, options?: { logger?: Logger }) {
    const logger = options?.logger || initLogger()
    this.logger = logger.getChildLogger({ name })

    this.name = name

    this.config = config || ({} as ConfigType)
  }

  async isReady() {
    return this.started
  }

  async isHealthy() {
    return this.started && this.healthy
  }
}
