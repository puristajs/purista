import { join } from 'node:path/posix'

import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { SecretStoreBaseClass, StatusCode, type StoreBaseConfig, UnhandledError } from '@purista/core'

import type { GoogleSecretStoreConfig } from './types.js'

/**
 * The secret store adapter for Google Secret Manager.
 * It will store, retrive, update or remove secrets in Google Secret Manager.
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
export class GoogleSecretStore extends SecretStoreBaseClass<GoogleSecretStoreConfig> {
  client: SecretManagerServiceClient

  constructor(config: StoreBaseConfig<GoogleSecretStoreConfig>) {
    super('GoogleSecretStore', { enableCache: true, ...config })
    this.client = new SecretManagerServiceClient(this.config.client)
  }

  async getSecretImpl(...secretNames: string[]): Promise<Record<string, string | undefined>> {
    const result: Record<string, string | undefined> = {}

    for (const name of secretNames) {
      result[name] = undefined
      try {
        const res = await this.client.accessSecretVersion({
          name: join(this.config.project, 'secrets', name, 'versions', 'latest'),
        })
        result[name] = res[0].payload?.data?.toString()
      } catch (err) {
        this.logger.error({ err })
        throw UnhandledError.fromError(err, StatusCode.InternalServerError)
      }
    }

    return result
  }

  async removeSecretImpl(secretName: string) {
    await this.client.deleteSecret({ name: join(this.config.project, 'secrets', secretName) })
  }

  async setSecretImpl(secretName: string, secretValue: string) {
    const existingValue = await this.getSecret(secretName)

    if (!existingValue[secretName]) {
      await this.client.createSecret({
        parent: this.config.project,
        secretId: secretName,
        secret: {
          replication: {
            automatic: {},
          },
        },
      })
    }

    await this.client.addSecretVersion({
      parent: join(this.config.project, 'secrets', secretName),
      payload: {
        data: Buffer.from(secretValue, 'utf8'),
      },
    })
  }
}
