import { join } from 'node:path'

import type { ObjectWithKeysFromStringArray, StoreBaseConfig } from '@purista/core'
import { HttpClient, SecretStoreBaseClass, StatusCode, UnhandledError } from '@purista/core'

import { getDefaultClientConfig } from '../DaprClient/getDefaultClientConfig.impl.js'
import type { DaprClientConfig } from '../DaprClient/index.js'
import { DAPR_API_VERSION } from '../types/index.js'
import { puristaVersion } from '../version.js'
import type { DaprSecretStoreConfig } from './types/index.js'

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

  protected async getSecretImpl<SecretNames extends string[]>(
    ...secretNames: SecretNames
  ): Promise<ObjectWithKeysFromStringArray<SecretNames, string | undefined>> {
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

    return returnValue as ObjectWithKeysFromStringArray<SecretNames, string | undefined>
  }

  protected async setSecretImpl(_secretName: string) {
    throw new UnhandledError(StatusCode.NotImplemented, 'setting or changing of secrets is not available')
  }

  protected async removeSecretImpl(_secretName: string) {
    throw new UnhandledError(StatusCode.NotImplemented, 'removing of secrets is not available')
  }
}
