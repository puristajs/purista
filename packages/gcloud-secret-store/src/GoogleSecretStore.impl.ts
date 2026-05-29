import { join } from 'node:path/posix'

import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import {
	type ObjectWithKeysFromStringArray,
	SecretStoreBaseClass,
	StatusCode,
	type StoreBaseConfig,
	UnhandledError,
} from '@purista/core'

import type { GoogleSecretStoreConfig } from './types.js'

/**
 * Secret store backed by Google Secret Manager.
 *
 * Secret values are cached in memory after the first read to reduce Google Cloud
 * API calls. Set `enableCache` to `false` to always read from Google Secret
 * Manager, or set `cacheTtl` in milliseconds to bound cache reuse. Expired
 * entries are refreshed on the next read.
 *
 * Credentials are resolved by the Google Cloud client from `client` options,
 * Application Default Credentials, workload identity, or the runtime service
 * account. Do not embed service account keys in source code.
 *
 * Use Google Secret Manager-compatible secret ids that encode tenant and
 * environment, for example `acme-prod-payments-api-token`. Never log returned
 * secret values.
 *
 * @example
 * ```typescript
 * const store = new GoogleSecretStore({
 *   project: 'projects/example-project',
 *   cacheTtl: 30_000,
 * })
 *
 * await store.setSecret('acme-prod-payments-api-token', 'placeholder-secret')
 * const secret = await store.getSecret('acme-prod-payments-api-token')
 * ```
 */
export class GoogleSecretStore extends SecretStoreBaseClass<GoogleSecretStoreConfig> {
	/**
	 * Google Secret Manager client used for secret operations.
	 *
	 * Applications normally configure this through the constructor. Tests may
	 * replace it with a compatible client.
	 */
	client: SecretManagerServiceClient

	/**
	 * Creates a Google Secret Manager-backed secret store.
	 *
	 * @param config Store options and Google Cloud client configuration.
	 */
	constructor(config: StoreBaseConfig<GoogleSecretStoreConfig>) {
		super('GoogleSecretStore', { enableCache: true, ...config })
		this.client = new SecretManagerServiceClient(this.config.client)
	}

	private isNotFoundError(err: unknown): err is { code?: number; statusCode?: number } {
		return (
			typeof err === 'object' &&
			err !== null &&
			(('code' in err && typeof err.code === 'number' && err.code === 5) ||
				('statusCode' in err && typeof err.statusCode === 'number' && err.statusCode === 404))
		)
	}

	protected async getSecretImpl<SecretNames extends string[]>(
		...secretNames: SecretNames
	): Promise<ObjectWithKeysFromStringArray<SecretNames, string | undefined>> {
		const result: Record<string, string | undefined> = {}

		for (const name of secretNames) {
			result[name] = undefined
			try {
				const res = await this.client.accessSecretVersion({
					name: join(this.config.project, 'secrets', name, 'versions', 'latest'),
				})
				result[name] = res[0].payload?.data?.toString()
			} catch (err) {
				if (this.isNotFoundError(err)) {
					result[name] = undefined
					continue
				}
				this.logger.error({ err })
				throw UnhandledError.fromError(err, StatusCode.InternalServerError)
			}
		}

		return result as ObjectWithKeysFromStringArray<SecretNames, string | undefined>
	}

	/**
	 * Removes a secret resource from Google Secret Manager.
	 *
	 * Prefer calling `removeSecret` so inherited store guards and cache handling
	 * are applied.
	 */
	async removeSecretImpl(secretName: string) {
		await this.client.deleteSecret({ name: join(this.config.project, 'secrets', secretName) })
	}

	/**
	 * Adds a new secret version, creating the secret resource first when needed.
	 *
	 * Prefer calling `setSecret` so inherited store guards and cache handling are
	 * applied.
	 */
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
