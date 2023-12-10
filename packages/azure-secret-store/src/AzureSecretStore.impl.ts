import { DefaultAzureCredential } from '@azure/identity'
import { SecretClient } from '@azure/keyvault-secrets'
import { SecretStoreBaseClass, StatusCode, type StoreBaseConfig, UnhandledError } from '@purista/core'

import type { AzureSecretStoreConfig } from './types.js'

/**
 * The secret store adapter for Azure Secrets Manager.
 * It will store, retrive, update or remove secrets in Azure Secrets Manager.
 *
 * For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.
 *
 * You can disable the whole caching via config by setting enableCache to false.
 * If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).
 *
 * This will return the cached secret if available and if ttl is not exceeded.
 * If a secret value exceeds the ttl, it does not automatically get removed from cache.
 * It will be removed/overwritten on next get request.
 */
export class AzureSecretStore extends SecretStoreBaseClass<AzureSecretStoreConfig> {
  client: SecretClient

  constructor(config: StoreBaseConfig<AzureSecretStoreConfig>) {
    super('AzureSecretStore', { enableCache: true, ...config })

    const credential = new DefaultAzureCredential()

    this.client = new SecretClient(this.config.vaultUrl, credential, this.config.options)
  }

  async getSecretImpl(...secretNames: string[]): Promise<Record<string, string | undefined>> {
    const result: Record<string, string | undefined> = {}

    for (const name of secretNames) {
      try {
        const response = await this.client.getSecret(name)
        result[name] = response?.value
      } catch (err) {
        result[name] = undefined
        this.logger.error({ err })
        throw UnhandledError.fromError(err, StatusCode.InternalServerError)
      }
    }

    return result
  }

  async removeSecretImpl(secretName: string) {
    await this.client.beginDeleteSecret(secretName)
  }

  async setSecretImpl(secretName: string, secretValue: string) {
    await this.client.setSecret(secretName, secretValue)
  }
}
