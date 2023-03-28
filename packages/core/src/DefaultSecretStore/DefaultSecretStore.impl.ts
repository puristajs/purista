import { SecretStore, SecretStoreBaseClass, StatusCode, StoreBaseConfig, UnhandledError } from '../core'
import { DefaultSecretStoreConfig } from './types'

/**
 * The DefaultSecretStore is a placeholder which offers all needed methods.
 * Getters and setters will throw a UnhandledError with status `Unauthorized`, when a disabled operation is called.
 *
 * For development and testing purpose, you can initiate the store with values.
 *
 * @example ```typescript
 * const store = new DefaultSecretStore({
 *  config: {
 *    secretOne: 'my_secret_one_value',
 *    secretTwo: 'my_secret_two_value',
 *  }
 * })
 * console.log(await store.getSecret('secretOne', 'secretTwo) // outputs: { secretOne: my_secret_one_value, secretTwo: 'my_secret_two_value' }
 * ```
 * Per default, setting/changing and removal of values are disabled.
 * You can enable it on instance creation:
 *
 * @example ```typescript
 * const store = new DefaultSecretStore({
 *  enableGet: true,
 *  enableRemove: true,
 *  enableSet: true,
 * })
 * ```
 *
 * @group Store
 *
 */
export class DefaultSecretStore extends SecretStoreBaseClass<DefaultSecretStoreConfig> implements SecretStore {
  private map = new Map<string, string>()
  constructor(config?: StoreBaseConfig<DefaultSecretStoreConfig>) {
    super('DefaultSecretStore', config)
    if (config?.config) {
      this.map = new Map(Object.entries(config.config))
      if (config.logger) {
        this.logger.warn(
          'Using the DefaultSecretStore is not secure! It should only be used for test or development purpose.',
        )
      }
    }
  }

  async getSecret(...secretNames: string[]) {
    if (!this.config.enableGet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'get secret from store is disabled by config')
    }

    const result: Record<string, string | undefined> = {}
    secretNames.forEach((name) => {
      result[name] = this.map.get(name)
    })
    return result
  }

  async setSecret(secretName: string, secretValue: string) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set secret at store is disabled by config')
    }

    this.map.set(secretName, secretValue)
  }

  async removeSecret(secretName: string) {
    if (!this.config.enableRemove) {
      throw new UnhandledError(StatusCode.Unauthorized, 'remove secret from store is disabled by config')
    }

    this.map.delete(secretName)
  }
}
