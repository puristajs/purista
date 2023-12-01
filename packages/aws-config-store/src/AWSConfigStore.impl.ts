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

  async getConfigImpl(...configNames: string[]): Promise<Record<string, string | undefined>> {
    const result: Record<string, string | undefined> = {}

    for (const name of configNames) {
      try {
        const command = new GetParameterCommand({
          Name: name,
        })
        const res = await this.client.send(command)
        result[name] = res.Parameter?.Value
      } catch (err) {
        if (!(err instanceof ParameterNotFound)) {
          throw UnhandledError.fromError(err, StatusCode.InternalServerError)
        }
        result[name] = undefined
      }
    }

    return result
  }

  async removeConfigImpl(configName: string) {
    const command = new DeleteParameterCommand({
      Name: configName,
    })

    await this.client.send(command)
  }

  async setConfigImpl(configName: string, configValue: string) {
    const command = new PutParameterCommand({
      Name: configName,
      Value: configValue,
      Type: ParameterType.STRING,
      Overwrite: true,
    })

    await this.client.send(command)
  }
}
