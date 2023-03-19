import { Logger, SecretStore } from '../types'
import { SecretStoreBaseClass } from './SecretStoreBaseClass.impl'
import { DefaultSecretStoreConfig } from './types'

/**
 * The DefaultSecretStore is a placeholder which offers all needed methods.
 * There is no actual implementation of storing or fetching secrets.
 * Getters and setters will throw a UnhandledError with status `Not implemented`
 */
export class DefaultSecretStore extends SecretStoreBaseClass<DefaultSecretStoreConfig> implements SecretStore {
  constructor(options?: { logger?: Logger }) {
    super('DefaultSecretStore', {}, options)
  }
}
