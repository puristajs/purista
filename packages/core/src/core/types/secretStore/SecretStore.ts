import { SecretDeleteFunction } from './SecretDeleteFunction'
import { SecretGetterFunction } from './SecretGetterFunction'
import { SecretSetterFunction } from './SecretSetterFunction'

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
