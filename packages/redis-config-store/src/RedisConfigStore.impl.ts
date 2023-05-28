import { ConfigStoreBaseClass, StatusCode, StoreBaseConfig, UnhandledError } from '@purista/core'
import { createClient, RedisClientType, RedisFunctions, RedisModules, RedisScripts } from '@redis/client'

import { RedisStoreConfig } from './types'

/**
 * A config store for using redis as storage.
 * Config values are stored as stringified JSON.
 *
 * Per default, setting/changing and removal of values are enabled.
 *
 * @example ```typescript
 * const config = {
 *  enableGet: true, // optional, default is true
 *  enableRemove: true, // optional, default is true
 *  enableSet: true, // optional, default is true
 *  url: 'redis://alice:foobared@awesome.redis.server:6379'
 * }
 *
 * const store = new RedisConfigStore({ config })
 *
 * await store.setConfig('configKey',{ myConfig: 'value' })
 *
 * let value = await store.getConfig('configKey')
 * console.log(value) // outputs: { myConfig: 'value' }
 *
 * await store.removeConfig('configKey')
 *
 * value = await store.getConfig('configKey')
 * console.log(value) // outputs: undefined
 * ```
 *
 * See documentation of underlaying redis lib package for detailed configuration options.
 *
 * @see [NODE-REDIS](https://redis.js.org)
 *
 */
export class RedisConfigStore<
  M extends RedisModules = RedisModules,
  F extends RedisFunctions = RedisFunctions,
  S extends RedisScripts = RedisScripts,
> extends ConfigStoreBaseClass<RedisStoreConfig<M, F, S>> {
  public client: RedisClientType<M, F, S>

  constructor(config?: StoreBaseConfig<RedisStoreConfig<M, F, S>>) {
    super('RedisConfigStore', { ...config })
    this.client = createClient(this.config.config)
    this.client.on('error', (err) => this.logger.error({ err }, 'Redis Client Error'))
  }

  async getConfig(...configNames: string[]): Promise<Record<string, unknown>> {
    if (!this.config.enableGet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'get config from store is disabled by config')
    }

    if (!this.client.isOpen) {
      await this.client.connect()
    }

    const result: Record<string, unknown> = {}
    for await (const name of configNames) {
      try {
        const value = await this.client.get(name)
        result[name] = value ? JSON.parse(value) : undefined
      } catch (err) {
        const msg = `error in config store getting value ${name}`
        this.logger.error({ err }, msg)
        throw new UnhandledError(StatusCode.InternalServerError, msg)
      }
    }
    return result
  }

  async removeConfig(configName: string) {
    if (!this.config.enableRemove) {
      throw new UnhandledError(StatusCode.Unauthorized, 'remove config from store is disabled by config')
    }

    if (!this.client.isOpen) {
      await this.client.connect()
    }

    try {
      await this.client.del(configName)
    } catch (err) {
      const msg = `error in config store removing value ${configName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }

  async setConfig(configName: string, configValue: unknown) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set config at store is disabled by config')
    }

    if (!this.client.isOpen) {
      await this.client.connect()
    }
    try {
      await this.client.set(configName, JSON.stringify(configValue))
    } catch (err) {
      const msg = `error in config store setting value ${configName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }

  async destroy() {
    if (this.client.isOpen) {
      await this.client.disconnect()
    }
  }
}
