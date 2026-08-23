import type { ObjectWithKeysFromStringArray, StoreBaseConfig } from '@purista/core/adapter'
import { SecretStoreBaseClass, StatusCode, UnhandledError } from '@purista/core/adapter'

import { InfisicalClient } from './InfisicalClient/InfisicalClient.impl.js'
import type { InfisicalSecretConfig } from './types.js'

/**
 * Secret store backed by Infisical.
 *
 * Secret values are cached in memory after the first read to reduce Infisical
 * API calls. Set `enableCache` to `false` to always read from Infisical, or set
 * `cacheTtl` in milliseconds to bound cache reuse. Expired entries are refreshed
 * on the next read.
 *
 * The underlying client uses an Infisical service token. Keep the bearer token
 * in runtime secret management and never log token data, project keys, or secret
 * values. Secret names should match your Infisical path strategy and include
 * tenant/environment context when a project is shared, for example
 * `ACME_PROD_PAYMENTS_API_TOKEN`.
 *
 * @example
 * ```typescript
 * const store = new InfisicalSecretStore({
 *   bearerToken: process.env.INFISICAL_TOKEN ?? '',
 *   baseUrl: 'https://app.infisical.com',
 *   cacheTtl: 30_000,
 * })
 *
 * await store.setSecret('ACME_PROD_PAYMENTS_API_TOKEN', 'placeholder-secret')
 * const secret = await store.getSecret('ACME_PROD_PAYMENTS_API_TOKEN')
 * ```
 */
export class InfisicalSecretStore extends SecretStoreBaseClass<InfisicalSecretConfig> {
	/**
	 * Infisical HTTP client used by this store.
	 *
	 * Applications normally configure this through the constructor. Tests may
	 * replace it with a compatible client.
	 */
	public client: InfisicalClient

	/**
	 * Creates an Infisical-backed secret store.
	 *
	 * @param config Store options plus Infisical client configuration.
	 */
	constructor(config: StoreBaseConfig<InfisicalSecretConfig>) {
		super('InfisicalSecretStore', { enableCache: true, ...config })

		this.client = new InfisicalClient({
			name: 'InfisicalClient',
			...config,
		})
	}

	protected async getSecretImpl<SecretNames extends string[]>(
		...secretNames: SecretNames
	): Promise<ObjectWithKeysFromStringArray<SecretNames, string | undefined>> {
		const result: Record<string, string | undefined> = {}
		for (const name of secretNames) {
			try {
				result[name] = await this.client.getSecret(name)
			} catch (err) {
				const msg = `error in secret store getting value ${name}`
				this.logger.error({ err }, msg)
				throw new UnhandledError(StatusCode.InternalServerError, msg)
			}
		}
		return result as ObjectWithKeysFromStringArray<SecretNames, string | undefined>
	}

	protected async removeSecretImpl(secretName: string) {
		try {
			await this.client.removeSecret(secretName)
		} catch (err) {
			const msg = `error in secret store removing value ${secretName}`
			this.logger.error({ err }, msg)
			throw new UnhandledError(StatusCode.InternalServerError, msg)
		}
	}

	protected async setSecretImpl(secretName: string, secretValue: string) {
		try {
			await this.client.setSecret(secretName, secretValue)
		} catch (err) {
			const msg = `error in secret store setting value ${secretName}`
			this.logger.error({ err }, msg)
			throw new UnhandledError(StatusCode.InternalServerError, msg)
		}
	}
}
