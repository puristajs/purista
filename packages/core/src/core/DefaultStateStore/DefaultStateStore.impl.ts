import { Logger, StateStore } from '../types'
import { StateStoreBaseClass } from './StateStoreBaseClass.impl'
import { DefaultStateStoreConfig } from './types'

/**
 * The DefaultStateStore is a placeholder which offers all needed methods.
 * There is no actual implementation of storing or fetching secrets.
 * Getters and setters will throw a UnhandledError with status `Not implemented`
 */
export class DefaultStateStore extends StateStoreBaseClass<DefaultStateStoreConfig> implements StateStore {
  constructor(options?: { logger?: Logger }) {
    super('DefaultStateStore', {}, options)
  }
}
