import { SpanProcessor } from '@opentelemetry/sdk-trace-node'

import { Logger, StateStore } from '../types'
import { StateStoreBaseClass } from './StateStoreBaseClass.impl'
import { DefaultStateStoreConfig } from './types'

/**
 * The DefaultStateStore is a placeholder which offers all needed methods.
 * There is no actual implementation of storing or fetching secrets.
 * Getters and setters will throw a UnhandledError with status `Not implemented`
 */
export class DefaultStateStore extends StateStoreBaseClass<DefaultStateStoreConfig> implements StateStore {
  private states = new Map<string, unknown>()
  constructor(options?: { logger?: Logger; spanProcessor?: SpanProcessor }) {
    super('DefaultStateStore', {}, options)
    this.healthy = true
    this.started = true
  }

  async start() {
    this.healthy = true
    this.started = true
    this.logger.info(`Statestore ${this.name} started`)
    this.logger.warn(`DefaultStateStore stores values in memory and also only per instance!`)
  }

  async destroy() {
    this.healthy = false
    this.started = false
    this.logger.info(`Statestore ${this.name} destroyed`)
  }

  async getState<T = unknown>(stateName: string): Promise<T> {
    return this.states.get(stateName) as T
  }

  async setState(stateName: string, stateValue: unknown) {
    this.states.set(stateName, stateValue)
  }
}
