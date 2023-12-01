import { join } from 'node:path'

import type { StoreBaseConfig } from '@purista/core'
import { HttpClient, SecretStoreBaseClass, StatusCode, UnhandledError } from '@purista/core'

import type { DaprClientConfig } from '../DaprClient'
import { getDefaultClientConfig } from '../DaprClient/getDefaultClientConfig.impl'
import { DAPR_API_VERSION } from '../types'
import { puristaVersion } from '../version'
import type { DaprSecretStoreConfig } from './types'

/**
 * DaprSecretStore is an adapter which connects to the secret store provided by the underlaying Dapr infrastructure.
 *
 * Dapr currently provides only the possibility to fetch a secret. Creating a new secret, changing an existing secret or removal of secrets is not supported.
 */
export class DaprSecretStore extends SecretStoreBaseClass<DaprSecretStoreConfig> {
  private client: HttpClient<DaprClientConfig>

  constructor(config?: StoreBaseConfig<DaprSecretStoreConfig>) {
    super(config?.secretStoreName || 'DaprSecretStore', { ...config })
    const logger = this.logger
    const conf = {
      secretStoreName: 'secretStore',
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

  async getSecret(...secretNames: string[]) {
    if (!this.config.enableGet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'get secret from store is disabled by config')
    }

    const fetchSecretFromStore = async (secretName: string) => {
      const path = join(
        this.config.clientConfig?.daprApiToken || DAPR_API_VERSION,
        'secrets',
        this.config.secretStoreName as string,
        secretName,
      )

      const query: Record<string, string> = {}

      if (this.config.metadata?.namespace) {
        query['metadata.namespace'] = this.config.metadata?.namespace
      }

      return this.client.get<Record<string, string>>(path, { query })
    }

    const result = await Promise.all(secretNames.map((secretName) => fetchSecretFromStore(secretName)))

    let returnValue: Record<string, string> = {}

    secretNames.forEach((value, index) => {
      returnValue = {
        ...result[index],
        ...returnValue,
      }
    })

    return returnValue
  }

  async setSecret(_secretName: string) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set secret at store is disabled by config')
    }

    throw new UnhandledError(StatusCode.NotImplemented, 'setting or changing of secrets is not available')
  }

  async removeSecret(_secretName: string) {
    if (!this.config.enableRemove) {
      throw new UnhandledError(StatusCode.Unauthorized, 'remove secret from store is disabled by config')
    }

    throw new UnhandledError(StatusCode.NotImplemented, 'removing of secrets is not available')
  }
}
