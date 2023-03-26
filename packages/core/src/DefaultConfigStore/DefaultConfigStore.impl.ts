import { ConfigStoreBaseClass, StoreBaseConfig } from '../core'
import { DefaultConfigStoreConfig } from './types'

/**
 * The DefaultConfigStore is a placeholder which offers all needed methods.
 * There is no actual implementation of storing or fetching configs.
 * Getters and setters will throw a UnhandledError with status `Not implemented`
 *
 * @group Store
 */
export class DefaultConfigStore extends ConfigStoreBaseClass<DefaultConfigStoreConfig> {
  constructor(config?: StoreBaseConfig<never>) {
    super('DefaultConfigStore', {
      enableRemove: false,
      enableSet: false,
      enableGet: true,
      ...config,
    })
  }
}
