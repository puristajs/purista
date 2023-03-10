import { Logger } from '../types'
import { DefaultStateStore } from './DefaultStateStore.impl'

export const initDefaultStateStore = (options: { logger: Logger }): DefaultStateStore => {
  const store = new DefaultStateStore(options)
  return store
}
