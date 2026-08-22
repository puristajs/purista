import { DefaultAzureCredential } from '@azure/identity'
import { SecretClient } from '@azure/keyvault-secrets'
import {
	type ObjectWithKeysFromStringArray,
	SecretStoreBaseClass,
	StatusCode,
	type StoreBaseConfig,
	UnhandledError,
} from '@purista/core/adapter'

import type { AzureSecretStoreConfig } from './types.js'

/**
 * Secret store backed by Azure Key Vault.
 *
 * Secret values are cached in memory after the first read to reduce Key Vault
 * calls. Set `enableCache` to `false` to always read from Azure, or set
 * `cacheTtl` in milliseconds to bound cache reuse. Expired entries are refreshed
 * on the next read.
 *
 * The store uses `DefaultAzureCredential`, so credentials should come from
 * managed identity, workload identity, Azure CLI login, or environment variables
 * supported by `@azure/identity`.
 *
 * Use Key Vault-compatible names that encode tenant and environment, for example
 * `acme-prod-payments-api-token`. Never log returned secret values.
 *
 * @example
 * ```typescript
 * const store = new AzureSecretStore({
 *   vaultUrl: 'https://example-vault.vault.azure.net',
 *   cacheTtl: 30_000,
 * })
 *
 * await store.setSecret('acme-prod-payments-api-token', 'placeholder-secret')
 * const secret = await store.getSecret('acme-prod-payments-api-token')
 * ```
 */
export class AzureSecretStore extends SecretStoreBaseClass<AzureSecretStoreConfig> {
	/**
	 * Azure Key Vault client used for secret operations.
	 *
	 * Applications normally configure this through the constructor. Tests may
	 * replace it with a compatible client.
	 */
	client: SecretClient

	/**
	 * Creates an Azure Key Vault-backed secret store.
	 *
	 * @param config Store options and Azure Key Vault connection settings.
	 */
	constructor(config: StoreBaseConfig<AzureSecretStoreConfig>) {
		super('AzureSecretStore', { enableCache: true, ...config })

		const credential = new DefaultAzureCredential()
		const allowInsecureConnection = this.config.allowInsecureConnection ?? this.config.options?.allowInsecureConnection

		this.client = new SecretClient(this.config.vaultUrl, credential, {
			...this.config.options,
			allowInsecureConnection,
		})
	}

	private isNotFoundError(err: unknown): err is { statusCode: number } {
		return (
			typeof err === 'object' &&
			err !== null &&
			'statusCode' in err &&
			typeof err.statusCode === 'number' &&
			err.statusCode === 404
		)
	}

	protected async getSecretImpl<SecretNames extends string[]>(
		...secretNames: SecretNames
	): Promise<ObjectWithKeysFromStringArray<SecretNames, string | undefined>> {
		const result: Record<string, string | undefined> = {}

		for (const name of secretNames) {
			try {
				const response = await this.client.getSecret(name)
				result[name] = response?.value
			} catch (err) {
				if (this.isNotFoundError(err)) {
					result[name] = undefined
					continue
				}
				result[name] = undefined
				this.logger.error({ err })
				throw UnhandledError.fromError(err, StatusCode.InternalServerError)
			}
		}

		return result as ObjectWithKeysFromStringArray<SecretNames, string | undefined>
	}

	protected async removeSecretImpl(secretName: string) {
		await this.client.beginDeleteSecret(secretName)
	}

	protected async setSecretImpl(secretName: string, secretValue: string) {
		await this.client.setSecret(secretName, secretValue)
	}
}
