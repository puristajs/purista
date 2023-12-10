import { initLogger } from '../../DefaultLogger/index.js'
import { UnhandledError } from '../Error/index.js'
import type { Logger, Prettify, StoreBaseConfig } from '../types/index.js'
import { StatusCode } from '../types/index.js'
import type { SecretStore, SecretStoreCacheMap } from './types/index.js'

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

  protected async getSecretImpl(..._secretNames: string[]): Promise<Record<string, string | undefined>> {
    const err = new UnhandledError(StatusCode.NotImplemented, 'get secret is not implemented in secret store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async getSecret(...secretNames: string[]): Promise<Record<string, string | undefined>> {
    if (!this.config.enableGet) {
      const err = new UnhandledError(StatusCode.Unauthorized, 'get secret from store is disabled by config')
      this.logger.error({ err }, err.message)
      throw err
    }

    if (!this.config.enableGet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'get secret from store is disabled by config')
    }

    if (!this.config.enableCache) {
      return this.getSecretImpl(...secretNames)
    }

    const result: Record<string, string | undefined> = {}
    const toFetch: string[] = []

    secretNames.forEach((secret) => {
      const cachedValue = this.cache.get(secret)
      result[secret] = undefined
      if (cachedValue) {
        if (this.config.cacheTtl !== undefined) {
          if (cachedValue.createdAt + this.config.cacheTtl >= Date.now()) {
            result[secret] = cachedValue.value
          } else {
            toFetch.push(secret)
          }
        } else {
          result[secret] = cachedValue.value
        }
      }
    })

    if (!toFetch.length) {
      return result
    }

    const freshSecrets = await this.getSecretImpl(...toFetch)

    toFetch.forEach((secret) => {
      const value = freshSecrets[secret]
      if (value !== undefined) {
        this.cache.set(secret, { value, createdAt: Date.now() })
      } else {
        this.cache.delete(secret)
      }
    })

    return { ...result, ...freshSecrets }
  }

  protected async removeSecretImpl(_secretName: string): Promise<void> {
    const err = new UnhandledError(StatusCode.NotImplemented, 'remove secret is not implemented in secret store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async removeSecret(secretName: string): Promise<void> {
    if (!this.config.enableRemove) {
      const err = new UnhandledError(StatusCode.Unauthorized, 'remove secret from store is disabled by config')
      this.logger.error({ err }, err.message)
      throw err
    }

    if (this.config.enableCache) {
      this.cache.delete(secretName)
    }

    return this.removeSecretImpl(secretName)
  }

  protected async setSecretImpl(_secretName: string, _secretValue: string) {
    const err = new UnhandledError(StatusCode.NotImplemented, 'set secret is not implemented in secret store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async setSecret(secretName: string, secretValue: string) {
    if (!this.config.enableSet) {
      const err = new UnhandledError(StatusCode.Unauthorized, 'set secret at store is disabled by config')
      this.logger.error({ err }, err.message)
      throw err
    }

    const result = await this.setSecretImpl(secretName, secretValue)

    if (this.config.enableCache) {
      this.cache.set(secretName, { value: secretValue, createdAt: Date.now() })
    }

    return result
  }

  async destroy() {
    this.logger.info('stopped')
  }
}
