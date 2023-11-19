import {
  CreateSecretCommand,
  DeleteSecretCommand,
  GetSecretValueCommand,
  ResourceNotFoundException,
  SecretsManagerClient,
  UpdateSecretCommand,
} from '@aws-sdk/client-secrets-manager'
import { SecretStoreBaseClass, StatusCode, type StoreBaseConfig, UnhandledError } from '@purista/core'

import { AWSSecretStoreConfig } from './types'

/**
 * The secret store adapter for AWS Secrets Manager.
 * It will store, retrive, update or remove secrets in AWS Secrets Manager.
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
export class AWSSecretStore extends SecretStoreBaseClass<AWSSecretStoreConfig> {
  client: SecretsManagerClient

  constructor(config: StoreBaseConfig<AWSSecretStoreConfig>) {
    super('AWSSecretStore', { enableCache: true, ...config })
    this.client = new SecretsManagerClient(this.config.client)
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
          const command = new GetSecretValueCommand({
            SecretId: name,
          })
          const res = await this.client.send(command)
          value = res.SecretString
        } catch (err) {
          if (!(err instanceof ResourceNotFoundException)) {
            this.logger.error({ err })
          }
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

    const command = new DeleteSecretCommand({
      SecretId: secretName,
    })

    await this.client.send(command)
  }

  async setSecret(secretName: string, secretValue: string) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set secret at store is disabled by config')
    }

    try {
      const command = new UpdateSecretCommand({
        SecretId: secretName,
        SecretString: secretValue,
      })

      await this.client.send(command)
    } catch (err) {
      if (err instanceof ResourceNotFoundException) {
        const createCommand = new CreateSecretCommand({
          Name: secretName,
          SecretString: secretValue,
        })

        await this.client.send(createCommand)

        const command = new UpdateSecretCommand({
          SecretId: secretName,
          SecretString: secretValue,
        })

        await this.client.send(command)
      }
    }

    if (this.config.enableCache) {
      this.cache.set(secretName, { value: secretValue, createdAt: Date.now() })
    }
  }
}
