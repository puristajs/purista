import { join } from 'node:path'

import { ConfigStoreBaseClass, HttpClient, StatusCode, StoreBaseConfig, UnhandledError } from '@purista/core'

import { DaprClientConfig, getDefaultClientConfig } from '../DaprClient'
import { puristaVersion } from '../version'
import { DaprConfigStoreConfig } from './types'

const DAPR_API_VERSION = 'v1.0-alpha1'

/**
 * DaprConfigStore is an adapter which connects to the config store provided by the underlaying Dapr infrastructure
 */
export class DaprConfigStore extends ConfigStoreBaseClass<DaprConfigStoreConfig> {
  private client: HttpClient<DaprClientConfig>

  constructor(config?: StoreBaseConfig<DaprConfigStoreConfig>) {
    super(config?.configStoreName || 'DaprConfigStore', { ...config })
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

  async getConfig(...configNames: string[]) {
    if (!this.config.enableGet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'get config from store is disabled by config')
    }

    const fetchConfigFromStore = async (configName: string) => {
      const path = join(
        this.config.clientConfig?.daprApiToken || DAPR_API_VERSION,
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

    return returnValue
  }

  async setConfig(_configName: string, _configValue: unknown) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set config at store is disabled by config')
    }

    throw new UnhandledError(StatusCode.NotImplemented, 'setting or changing of configs is not available')
  }

  async removeConfig(_configName: string) {
    if (!this.config.enableRemove) {
      throw new UnhandledError(StatusCode.Unauthorized, 'remove config from store is disabled by config')
    }

    throw new UnhandledError(StatusCode.NotImplemented, 'removing of configs is not available')
  }
}
