import { SecretGetterFunction } from './SecretGetterFunction'
import { SecretSetterFunction } from './SecretSetterFunction'

export interface SecretStore {
  isReady(): Promise<boolean>

  isHealthy(): Promise<boolean>
  start(): Promise<void>
  getSecret: SecretGetterFunction
  setSecret: SecretSetterFunction

  destroy(): Promise<void>
}
