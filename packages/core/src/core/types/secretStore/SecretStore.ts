import { SecretGetterFunction } from './SecretGetterFunction'
import { SecretSetterFunction } from './SecretSetterFunction'

export interface SecretStore {
  /**
   * indicates if the secret store has been started and is connected to persistance
   */
  isReady(): Promise<boolean>

  /**
   * indicates if the secret store persistance is reachable
   */
  isHealthy(): Promise<boolean>

  /**
   * connects the secret store to persistance
   */
  start(): Promise<void>

  /**
   * get a secret
   * @param string name of secret
   * @returns the secret
   * @throws UnhandledError
   */
  getSecret: SecretGetterFunction

  /**
   * get a secret
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
