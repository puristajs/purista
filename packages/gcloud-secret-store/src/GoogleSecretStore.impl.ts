import { join } from 'node:path/posix'

import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { SecretStoreBaseClass, StatusCode, type StoreBaseConfig, UnhandledError } from '@purista/core'

import type { GoogleSecretStoreConfig } from './types'

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

  async getSecret(...secretNames: string[]): Promise<Record<string, string | undefined>> {
    if (!this.config.enableGet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'get secret from store is disabled by config')
    }

    const result: Record<string, string | undefined> = {}

    for (const name of secretNames) {
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
          const res = await this.client.accessSecretVersion({
            name: join(this.config.project, 'secrets', name, 'versions', 'latest'),
          })
          value = res[0].payload?.data?.toString()
        } catch (err) {
          this.logger.error({ err })
        }
      }

      result[name] = value
    }

    return result
  }

  async removeSecret(secretName: string) {
    if (!this.config.enableRemove) {
      throw new UnhandledError(StatusCode.Unauthorized, 'remove secret from store is disabled by config')
    }

    this.cache.delete(secretName)

    await this.client.deleteSecret({ name: join(this.config.project, 'secrets', secretName) })
  }

  async setSecret(secretName: string, secretValue: string) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set secret at store is disabled by config')
    }

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

    if (this.config.enableCache) {
      this.cache.set(secretName, { value: secretValue, createdAt: Date.now() })
    }
  }
}
