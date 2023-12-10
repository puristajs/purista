import type { StoreBaseConfig } from '@purista/core'
import { ConfigStoreBaseClass, StatusCode, UnhandledError } from '@purista/core'
import type { RedisClientType, RedisFunctions, RedisModules, RedisScripts } from '@redis/client'
import { createClient } from '@redis/client'

import type { RedisStoreConfig } from './types.js'

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
 * console.log(value) // outputs: { configKey: { myConfig: 'value' } }
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

  protected async getClient() {
    if (this.client.isOpen) {
      return this.client
    }
    return this.client.connect()
  }

  async getConfigImpl(...configNames: string[]): Promise<Record<string, unknown>> {
    const client = await this.getClient()

    const result: Record<string, unknown> = {}
    for await (const name of configNames) {
      try {
        const value = await client.get(name)
        result[name] = value ? JSON.parse(value) : undefined
      } catch (err) {
        const msg = `error in config store getting value ${name}`
        this.logger.error({ err }, msg)
        throw new UnhandledError(StatusCode.InternalServerError, msg)
      }
    }
    return result
  }

  async removeConfigImpl(configName: string) {
    const client = await this.getClient()

    try {
      await client.del(configName)
    } catch (err) {
      const msg = `error in config store removing value ${configName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }

  async setConfigImpl(configName: string, configValue: unknown) {
    const client = await this.getClient()
    try {
      await client.set(configName, JSON.stringify(configValue))
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
