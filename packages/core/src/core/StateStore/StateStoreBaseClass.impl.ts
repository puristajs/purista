import { initLogger } from '../../DefaultLogger/index.js'
import type { ObjectWithKeysFromStringArray } from '../../helper/index.js'
import { UnhandledError } from '../Error/index.js'
import type { Logger, StoreBaseConfig } from '../types/index.js'
import { StatusCode } from '../types/index.js'
import type { StateStore } from './types/index.js'

/**
 * Base class for config store implementations
 * The actual store implementation must overwrite the protected methods:
 *
 * - `getStateImpl`
 * - `setStateImpl`
 * - `removeStateImpl`
 *
 * __DO NOT OVERWRITE__: the regular methods getState, setState or removeState
 * @group Store
 */
export class StateStoreBaseClass<StateStoreConfigType extends Record<string, unknown> = {}> implements StateStore {
  logger: Logger
  config: StoreBaseConfig<StateStoreConfigType>

  name: string

  constructor(name: string, config: StoreBaseConfig<StateStoreConfigType>) {
    const logger = config?.logger || initLogger(config?.logLevel)
    this.logger = logger.getChildLogger({ name })

    this.name = name

    this.config = {
      enableGet: true,
      enableSet: true,
      enableRemove: true,
      ...config,
    }
  }

  protected async getStateImpl<StateNames extends string[]>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ...stateNames: StateNames
  ): Promise<ObjectWithKeysFromStringArray<StateNames>> {
    const err = new UnhandledError(StatusCode.NotImplemented, 'getState is not implemented in state store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async getState<StateNames extends string[]>(
    ...stateNames: StateNames
  ): Promise<ObjectWithKeysFromStringArray<StateNames>> {
    if (!this.config.enableGet) {
      const err = new UnhandledError(StatusCode.Unauthorized, 'get state from store is disabled by config')
      this.logger.error({ err }, err.message)
      throw err
    }

    return this.getStateImpl(...stateNames)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async removeStateImpl(stateName: string) {
    const err = new UnhandledError(StatusCode.NotImplemented, 'removeState is not implemented in state store')
    this.logger.error({ err }, err.message)
    throw err
  }

  async removeState(stateName: string) {
    if (!this.config.enableRemove) {
      const err = new UnhandledError(StatusCode.Unauthorized, 'remove state from store is disabled by config')
      this.logger.error({ err }, err.message)
      throw err
    }

    return this.removeStateImpl(stateName)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async setStateImpl(stateName: string, stateValue: unknown) {
    const err = new UnhandledError(StatusCode.NotImplemented, 'setState is not implemented in state store')
    this.logger.error({ err }, err.message)
    throw err
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async setState(stateName: string, stateValue: unknown) {
    if (!this.config.enableSet) {
      const err = new UnhandledError(StatusCode.Unauthorized, 'set state at store is disabled by config')
      this.logger.error({ err }, err.message)
      throw err
    }

    return this.setStateImpl(stateName, stateValue)
  }

  async destroy() {
    this.logger.info('stopped')
  }
}
