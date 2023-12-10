import type { SecretDeleteFunction } from './SecretDeleteFunction.js'
import type { SecretGetterFunction } from './SecretGetterFunction.js'
import type { SecretSetterFunction } from './SecretSetterFunction.js'

/**
 * Interface definition for a secret store implementation
 * @group Store
 */
export interface SecretStore {
  /** name of store */
  name: string
  /**
   * get a secret
   * @param string name of secret
   * @returns the secret
   * @throws UnhandledError
   */
  getSecret: SecretGetterFunction

  /**
   * delete a secret
   * @param string name of secret
   * @throws UnhandledError
   */
  removeSecret: SecretDeleteFunction

  /**
   * set a secret
   * @param string name of secret
   * @param value value of secret
   * @throws UnhandledError
   */
  setSecret: SecretSetterFunction

  /**
   * disconnects and shuts down the secret store
   */
  destroy(): Promise<void>
}
