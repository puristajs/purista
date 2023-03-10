import { SpanProcessor } from '@opentelemetry/sdk-trace-node'

import { UnhandledError } from '../Error'
import { Logger, SecretStore, StatusCode } from '../types'
import { SecretStoreBaseClass } from './SecretStoreBaseClass.impl'
import { DefaultSecretStoreConfig } from './types'

export class DefaultSecretStore extends SecretStoreBaseClass<DefaultSecretStoreConfig> implements SecretStore {
  constructor(config?: DefaultSecretStoreConfig, options?: { logger?: Logger; spanProcessor?: SpanProcessor }) {
    super('DefaultSecretStore', config, options)
    this.healthy = true
    this.started = true
  }

  async start() {
    this.healthy = true
    this.started = true
    this.logger.info(`Secretstore ${this.name} started`)
  }

  async destroy() {
    this.healthy = false
    this.started = false
    this.logger.info(`Secretstore ${this.name} destroyed`)
  }

  async getSecret<T>(_secretName: string): Promise<T> {
    const err = new UnhandledError(StatusCode.NotImplemented, 'getSecret is not implemented in DefaultSecretStore')
    this.logger.error({ err }, 'Default secret store is only placeholder dummy')
    throw err
  }

  async setSecret(_secretName: string, _secretValue: unknown) {
    const err = new UnhandledError(StatusCode.NotImplemented, 'setSecret is not implemented in DefaultSecretStore')
    this.logger.error({ err }, 'Default secret store is only placeholder dummy')
    throw err
  }
}
