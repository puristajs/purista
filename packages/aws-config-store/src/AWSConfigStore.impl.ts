import {
  DeleteParameterCommand,
  GetParameterCommand,
  ParameterNotFound,
  ParameterType,
  PutParameterCommand,
  SSMClient,
} from '@aws-sdk/client-ssm'
import { ConfigStoreBaseClass, StatusCode, type StoreBaseConfig, UnhandledError } from '@purista/core'

import type { AWSConfigStoreConfig } from './types'

/**
 * The config store adapter for AWS System Manager.
 * It will store, retrive, update or remove configs in AWS System Manager.
 *
 * For performance reasons, and to reduce costs, the config values are cached in memory after first fetch.
 *
 * You can disable the whole caching via config by setting enableCache to false.
 * If the cache is enabled, you can set the ttl for cached config values via config cacheTtl (in ms).
 *
 * This will return the cached config if available and if ttl is not exceeded.
 * If a config value exceeds the ttl, it does not automatically get removed from cache.
 * It will be removed/overwritten on next get request.
 */
export class AWSConfigStore extends ConfigStoreBaseClass<AWSConfigStoreConfig> {
  client: SSMClient

  constructor(config: StoreBaseConfig<AWSConfigStoreConfig>) {
    super('AWSConfigStore', { enableCache: true, ...config })
    this.client = new SSMClient(this.config.client)
  }

  async getConfig(...configNames: string[]): Promise<Record<string, string | undefined>> {
    if (!this.config.enableGet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'get config from store is disabled by config')
    }

    const result: Record<string, string | undefined> = {}

    for (const name of configNames) {
      let value: string | undefined
      if (this.config.enableCache) {
        const cachedValue = this.cache.get(name)
        if (cachedValue) {
          if (this.config.cacheTtl !== undefined) {
            value = cachedValue.createdAt + this.config.cacheTtl >= Date.now() ? cachedValue.value : undefined
          } else {
            value = cachedValue.value
          }
        }
      }

      if (!value) {
        try {
          const command = new GetParameterCommand({
            Name: name,
          })
          const res = await this.client.send(command)
          value = res.Parameter?.Value
        } catch (err) {
          if (!(err instanceof ParameterNotFound)) {
            this.logger.error({ err })
          }
        }
      }

      result[name] = value
    }

    return result
  }

  async removeConfig(configName: string) {
    if (!this.config.enableRemove) {
      throw new UnhandledError(StatusCode.Unauthorized, 'remove config from store is disabled by config')
    }

    this.cache.delete(configName)

    const command = new DeleteParameterCommand({
      Name: configName,
    })

    await this.client.send(command)
  }

  async setConfig(configName: string, configValue: string) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set config at store is disabled by config')
    }

    const command = new PutParameterCommand({
      Name: configName,
      Value: configValue,
      Type: ParameterType.STRING,
      Overwrite: true,
    })

    await this.client.send(command)

    if (this.config.enableCache) {
      this.cache.set(configName, { value: configValue, createdAt: Date.now() })
    }
  }
}
