import { SpanProcessor } from '@opentelemetry/sdk-trace-node'

import { UnhandledError } from '../Error'
import { ConfigStore, Logger, StatusCode } from '../types'
import { ConfigStoreBaseClass } from './ConfigStoreBaseClass.impl'
import { DefaultConfigStoreConfig } from './types'

/**
 * The DefaultConfigStore is a placeholder which offers all needed methods.
 * There is no actual implementation of storing or fetching configs.
 * Getters and setters will throw a UnhandledError with status `Not implemented`
 */
export class DefaultConfigStore extends ConfigStoreBaseClass<DefaultConfigStoreConfig> implements ConfigStore {
  constructor(options?: { logger?: Logger; spanProcessor?: SpanProcessor }) {
    super('DefaultConfigStore', {}, options)
    this.healthy = true
    this.started = true
  }

  async start() {
    this.healthy = true
    this.started = true
    this.logger.info(`Configstore ${this.name} started`)
  }

  async destroy() {
    this.healthy = false
    this.started = false
    this.logger.info(`Configstore ${this.name} destroyed`)
  }

  async getConfig<T = unknown>(_configName: string): Promise<T> {
    const err = new UnhandledError(StatusCode.NotImplemented, 'getConfig is not implemented in DefaultConfigStore')
    this.logger.error({ err }, 'Default config store is only placeholder dummy')
    throw err
  }

  async setConfig(_configName: string, _configValue: unknown) {
    const err = new UnhandledError(StatusCode.NotImplemented, 'setConfig is not implemented in DefaultConfigStore')
    this.logger.error({ err }, 'Default config store is only placeholder dummy')
    throw err
  }
}
