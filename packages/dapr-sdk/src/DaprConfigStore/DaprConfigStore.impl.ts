import { join } from 'node:path'

import type { ObjectWithKeysFromStringArray, StoreBaseConfig } from '@purista/core'
import { ConfigStoreBaseClass, HttpClient, StatusCode, UnhandledError } from '@purista/core'

import type { DaprClientConfig } from '../DaprClient/index.js'
import { getDefaultClientConfig } from '../DaprClient/index.js'
import { puristaVersion } from '../version.js'
import type { DaprConfigStoreConfig } from './types/index.js'

const DAPR_API_VERSION = 'v1.0-alpha1'

/**
 * DaprConfigStore is an adapter which connects to the config store provided by the underlaying Dapr infrastructure
 */
export class DaprConfigStore extends ConfigStoreBaseClass<DaprConfigStoreConfig> {
  private client: HttpClient<DaprClientConfig>

  constructor(config?: StoreBaseConfig<DaprConfigStoreConfig>) {
    super(config?.configStoreName ?? 'DaprConfigStore', { ...config })
    const logger = this.logger
    const conf = {
      configStoreName: 'configStore',
      logger,
      ...config,
      clientConfig: {
        ...getDefaultClientConfig(),
        ...config?.clientConfig,
      },
    }

    let baseUrl = `${conf.clientConfig.daprHost}:${conf.clientConfig.daprPort}`
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `http://${baseUrl}`
    }

    const defaultHeaders: Record<string, string> = {
      'content-type': 'application/json; charset=utf-8',
    }

    if (conf.clientConfig.daprApiToken) {
      defaultHeaders['dapr-api-token'] = conf.clientConfig.daprApiToken
      defaultHeaders['user-agent'] = `purista-dapr-client/v${puristaVersion} http/1`
    }

    this.client = new HttpClient<DaprClientConfig>({
      logger,
      baseUrl,
      defaultHeaders,
      ...conf.clientConfig,
    })
  }

  async getConfigImpl<ConfigNames extends string[]>(
    ...configNames: ConfigNames
  ): Promise<ObjectWithKeysFromStringArray<ConfigNames>> {
    const fetchConfigFromStore = async (configName: string) => {
      const path = join(
        this.config.clientConfig?.daprApiToken ?? DAPR_API_VERSION,
        'configuration',
        this.config.configStoreName as string,
      )

      return this.client.get<{ key: string; value: unknown }[]>(path, { query: { key: configName } })
    }

    const result = await Promise.all(configNames.map((configName) => fetchConfigFromStore(configName)))

    const returnValue: Record<string, unknown> = {}

    result.forEach((response) => {
      response.forEach((entry) => {
        returnValue[entry.key] = entry.value
      })
    })

    return returnValue as ObjectWithKeysFromStringArray<ConfigNames>
  }

  async setConfigImpl(_configName: string, _configValue: unknown) {
    throw new UnhandledError(StatusCode.NotImplemented, 'setting or changing of configs is not available')
  }

  async removeConfigImpl(_configName: string) {
    throw new UnhandledError(StatusCode.NotImplemented, 'removing of configs is not available')
  }
}
