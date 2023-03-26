import { Logger } from '../core'
import { DefaultSecretStore } from './DefaultSecretStore.impl'

export const initDefaultSecretStore = (options: { logger: Logger }): DefaultSecretStore => {
  const store = new DefaultSecretStore(options)
  return store
}
