import type { SecretStore, StoreBaseConfig } from '../core/index.js'
import { SecretStoreBaseClass } from '../core/index.js'
import type { ObjectWithKeysFromStringArray } from '../helper/index.js'
import type { DefaultSecretStoreConfig } from './types/index.js'

/**
 * The DefaultSecretStore is a placeholder which offers all needed methods.
 * Getters and setters will throw a UnhandledError with status `Unauthorized`, when a disabled operation is called.
 *
 * For development and testing purpose, you can initiate the store with values.
 *
 * @example
 * ```typescript
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
 * @example
 * ```typescript
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
    super('DefaultSecretStore', { ...config })
    if (config?.config) {
      this.map = new Map(Object.entries(config.config))
    }
    this.logger.warn(
      'Using the DefaultSecretStore is not secure! It should only be used for test or development purpose.',
    )
  }

  protected async getSecretImpl<SecretNames extends string[]>(
    ...secretNames: SecretNames
  ): Promise<ObjectWithKeysFromStringArray<SecretNames, string | undefined>> {
    const result: Record<string, string | undefined> = {}
    secretNames.forEach((name) => {
      result[name] = this.map.get(name)
    })
    return result as ObjectWithKeysFromStringArray<SecretNames, string | undefined>
  }

  protected async setSecretImpl(secretName: string, secretValue: string) {
    this.map.set(secretName, secretValue)
  }

  protected async removeSecretImpl(secretName: string) {
    this.map.delete(secretName)
  }
}
