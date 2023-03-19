import { Logger, StateStoreBaseClass, StatusCode, UnhandledError } from '@purista/core'
import {
  createClient,
  RedisClientOptions,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from '@redis/client'

/**
 * A state store for using redis as storage.
 * State values are stored as stringified JSON.
 *
 * @example ```typescript
 * const config = {
 *    url: 'redis://alice:foobared@awesome.redis.server:6380'
 *  }
 *
 * const store = new RedisStateStore(config)
 * ```
 *
 * See documentation of underlaying redis lib package for detailed configuration options.
 *
 * @@see[NODE-REDIS(https://redis.js.org)
 *
 */
export class RedisStateStore<
  M extends RedisModules = RedisModules,
  F extends RedisFunctions = RedisFunctions,
  S extends RedisScripts = RedisScripts,
> extends StateStoreBaseClass<RedisClientOptions<M, F, S>> {
  public client: RedisClientType<M, F, S>

  constructor(config?: RedisClientOptions<M, F, S>, options?: { logger?: Logger }) {
    super('RedisStateStore', config, options)
    this.client = createClient(this.config)
  }

  async getState(...stateNames: string[]): Promise<Record<string, unknown>> {
    const result: Record<string, unknown> = {}
    for await (const name of stateNames) {
      try {
        const value = await this.client.get(name)
        result[name] = value ? JSON.parse(value) : undefined
      } catch (err) {
        const msg = `error in state store getting value ${name}`
        this.logger.error({ err }, msg)
        throw new UnhandledError(StatusCode.InternalServerError, msg)
      }
    }
    return result
  }

  async removeState(stateName: string) {
    try {
      await this.client.del(stateName)
    } catch (err) {
      const msg = `error in state store removing value ${stateName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }

  async setState(stateName: string, stateValue: unknown) {
    try {
      await this.client.set(stateName, JSON.stringify(stateValue))
    } catch (err) {
      const msg = `error in state store setting value ${stateName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }

  async destroy() {
    await this.client.disconnect()
  }
}
