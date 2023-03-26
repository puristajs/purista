import { Logger } from '../core'
import { DefaultConfigStore } from './DefaultConfigStore.impl'

export const initDefaultConfigStore = (options: { logger: Logger }): DefaultConfigStore => {
  const store = new DefaultConfigStore(options)
  return store
}
