import { Logger } from '../types'
import { ConfigStoreBaseClass } from './ConfigStoreBaseClass.impl'
import { DefaultConfigStoreConfig } from './types'

/**
 * The DefaultConfigStore is a placeholder which offers all needed methods.
 * There is no actual implementation of storing or fetching configs.
 * Getters and setters will throw a UnhandledError with status `Not implemented`
 */
export class DefaultConfigStore extends ConfigStoreBaseClass<DefaultConfigStoreConfig> {
  constructor(options?: { logger?: Logger }) {
    super('DefaultConfigStore', {}, options)
  }
}
