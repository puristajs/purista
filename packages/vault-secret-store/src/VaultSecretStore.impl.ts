import vault from 'node-vault'
import {
  type ObjectWithKeysFromStringArray,
  SecretStoreBaseClass,
  StatusCode,
  type StoreBaseConfig,
  UnhandledError,
} from '@purista/core'

import type { VaultSecretStoreConfig } from './types.js'

/**
 * The secret store adapter for HashiCorp Vault.
 * It will store, retrieve, update or remove secrets in HashiCorp Vault.
 */
export class VaultSecretStore extends SecretStoreBaseClass<VaultSecretStoreConfig> {
  client: ReturnType<typeof vault>

  constructor(config: StoreBaseConfig<VaultSecretStoreConfig>) {
    super('VaultSecretStore', { enableCache: true, ...config })
    const mount = this.config.mount ?? 'secret'
    this.config.mount = mount.replace(/^\/+|\/+$/g, '')
    this.client = vault({ endpoint: this.config.endpoint, token: this.config.token })
  }

  protected async getSecretImpl<SecretNames extends string[]>(
    ...secretNames: SecretNames
  ): Promise<ObjectWithKeysFromStringArray<SecretNames, string | undefined>> {
    const result: Record<string, string | undefined> = {}

    for (const name of secretNames) {
      try {
        const res = await this.client.read(`${this.config.mount}/${name}`)
        result[name] = res?.data?.value
      } catch (err: any) {
        if (err?.response?.statusCode === 404) {
          result[name] = undefined
          continue
        }
        throw UnhandledError.fromError(err, StatusCode.InternalServerError)
      }
    }

    return result as ObjectWithKeysFromStringArray<SecretNames, string | undefined>
  }

  protected async removeSecretImpl(secretName: string) {
    await this.client.delete(`${this.config.mount}/${secretName}`)
  }

  protected async setSecretImpl(secretName: string, secretValue: string) {
    await this.client.write(`${this.config.mount}/${secretName}`, { value: secretValue })
  }
}
