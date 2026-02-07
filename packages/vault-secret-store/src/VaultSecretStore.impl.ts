import {
	type ObjectWithKeysFromStringArray,
	SecretStoreBaseClass,
	StatusCode,
	type StoreBaseConfig,
	UnhandledError,
} from '@purista/core'
import vault from 'node-vault'

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

	private isNotFoundError(err: unknown): err is { response?: { statusCode?: number } } {
		return (
			typeof err === 'object' &&
			err !== null &&
			'response' in err &&
			typeof err.response === 'object' &&
			err.response !== null &&
			'statusCode' in err.response &&
			err.response.statusCode === 404
		)
	}

	protected async getSecretImpl<SecretNames extends string[]>(
		...secretNames: SecretNames
	): Promise<ObjectWithKeysFromStringArray<SecretNames, string | undefined>> {
		const result: Record<string, string | undefined> = {}

		for (const name of secretNames) {
			result[name] = undefined
			try {
				const res = await this.client.read(`${this.config.mount}/data/${name}`)
				result[name] = res?.data?.data?.value
			} catch (err) {
				if (this.isNotFoundError(err)) {
					result[name] = undefined
					continue
				}
				throw UnhandledError.fromError(err, StatusCode.InternalServerError)
			}
		}

		return result as ObjectWithKeysFromStringArray<SecretNames, string | undefined>
	}

	protected async removeSecretImpl(secretName: string) {
		try {
			await this.client.delete(`${this.config.mount}/metadata/${secretName}`)
		} catch (err) {
			if (this.isNotFoundError(err)) {
				return
			}
			throw UnhandledError.fromError(err, StatusCode.InternalServerError)
		}
	}

	protected async setSecretImpl(secretName: string, secretValue: string) {
		try {
			await this.client.write(`${this.config.mount}/data/${secretName}`, { data: { value: secretValue } })
		} catch (err) {
			throw UnhandledError.fromError(err, StatusCode.InternalServerError)
		}
	}
}
