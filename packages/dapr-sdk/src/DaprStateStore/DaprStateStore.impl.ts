import { join } from 'node:path'

import { HttpClient, StateStoreBaseClass, StatusCode, StoreBaseConfig, UnhandledError } from '@purista/core'

import { DaprClientConfig, getDefaultClientConfig } from '../DaprClient'
import { DAPR_API_VERSION } from '../types'
import { puristaVersion } from '../version'
import { DaprStateStoreConfig } from './types'

/**
 * DaprStateStore is an adapter which connects to the state store provided by the underlaying Dapr infrastructure
 */
export class DaprStateStore extends StateStoreBaseClass<DaprStateStoreConfig> {
  private client: HttpClient<DaprClientConfig>

  constructor(config?: StoreBaseConfig<DaprStateStoreConfig>) {
    super('DaprStateStore', config)
    const logger = this.logger
    const conf = {
      stateStoreName: 'stateStore',
      logger,
      clientConfig: {
        ...getDefaultClientConfig(),
        ...config?.config?.clientConfig,
      },
      ...config,
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

  async getState(...stateNames: string[]) {
    if (!this.config.enableGet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'get state from store is disabled by config')
    }

    const fetchSecretFromStore = async (stateName: string) => {
      const path = join(
        this.config.config?.clientConfig?.daprApiToken || DAPR_API_VERSION,
        'state',
        this.config.config?.stateStoreName as string,
        stateName,
      )

      const query: Record<string, string> = {
        'metadata.contentType': 'application/json',
      }

      return this.client.get<string>(path, { query })
    }

    const result = await Promise.all(stateNames.map((stateName) => fetchSecretFromStore(stateName)))

    const returnValue: Record<string, string> = {}

    stateNames.forEach((value, index) => {
      returnValue[value] = result[index]
    })

    return returnValue
  }

  async setState(stateName: string, stateValue: unknown) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set state at store is disabled by config')
    }

    const path = join(
      this.config.config?.clientConfig?.daprApiToken || DAPR_API_VERSION,
      'state',
      this.config.config?.stateStoreName as string,
    )

    const payload = [
      {
        key: stateName,
        value: stateValue,
      },
    ]

    await this.client.post(path, payload)
  }

  async removeState(stateName: string) {
    if (!this.config.enableRemove) {
      throw new UnhandledError(StatusCode.Unauthorized, 'remove state from store is disabled by config')
    }

    const path = join(
      this.config.config?.clientConfig?.daprApiToken || DAPR_API_VERSION,
      'state',
      this.config.config?.stateStoreName as string,
      stateName,
    )

    await this.client.delete(path)
  }
}
