import {
	CreateSecretCommand,
	DeleteSecretCommand,
	GetSecretValueCommand,
	ResourceNotFoundException,
	SecretsManagerClient,
	UpdateSecretCommand,
} from '@aws-sdk/client-secrets-manager'
import {
	type ObjectWithKeysFromStringArray,
	SecretStoreBaseClass,
	StatusCode,
	type StoreBaseConfig,
	UnhandledError,
} from '@purista/core/adapter'

import type { AWSSecretStoreConfig } from './types.js'

/**
 * Secret store backed by AWS Secrets Manager.
 *
 * Secret values are cached in memory after the first read to reduce network
 * calls and AWS charges. Set `enableCache` to `false` for every read to hit AWS,
 * or set `cacheTtl` in milliseconds to bound cache reuse. Expired cache entries
 * are refreshed on the next read.
 *
 * Use stable, tenant-aware names such as
 * `tenants/acme/prod/payments/stripe-api-key`. Never log values returned by this
 * store and avoid putting real secrets in examples, tests, or traces.
 *
 * AWS credentials and region are resolved by the AWS SDK from `client` options,
 * environment variables, shared config files, or the runtime role.
 *
 * @example
 * ```typescript
 * const store = new AWSSecretStore({
 *   client: { region: 'eu-central-1' },
 *   cacheTtl: 30_000,
 * })
 *
 * await store.setSecret('tenants/acme/prod/payments/api-token', 'placeholder-secret')
 * const secret = await store.getSecret('tenants/acme/prod/payments/api-token')
 * ```
 */
export class AWSSecretStore extends SecretStoreBaseClass<AWSSecretStoreConfig> {
	/**
	 * AWS SDK client used for Secrets Manager requests.
	 *
	 * Applications normally configure this through the constructor. Tests may
	 * replace it with a compatible client.
	 */
	client: SecretsManagerClient

	/**
	 * Creates an AWS Secrets Manager-backed secret store.
	 *
	 * @param config Store options plus AWS SDK client configuration.
	 */
	constructor(config: StoreBaseConfig<AWSSecretStoreConfig>) {
		super('AWSSecretStore', { enableCache: true, ...config })
		this.client = new SecretsManagerClient(this.config.client)
	}

	protected async getSecretImpl<SecretNames extends string[]>(
		...secretNames: SecretNames
	): Promise<ObjectWithKeysFromStringArray<SecretNames, string | undefined>> {
		const result: Record<string, string | undefined> = {}

		for (const name of secretNames) {
			try {
				const command = new GetSecretValueCommand({
					SecretId: name,
				})
				const res = await this.client.send(command)
				result[name] = res.SecretString
			} catch (err) {
				if (!(err instanceof ResourceNotFoundException)) {
					throw UnhandledError.fromError(err, StatusCode.InternalServerError)
				}
				result[name] = undefined
			}
		}

		return result as ObjectWithKeysFromStringArray<SecretNames, string | undefined>
	}

	protected async removeSecretImpl(secretName: string) {
		const command = new DeleteSecretCommand({
			SecretId: secretName,
			ForceDeleteWithoutRecovery: true,
		})

		await this.client.send(command)
	}

	protected async setSecretImpl(secretName: string, secretValue: string) {
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
				return
			}

			throw UnhandledError.fromError(err, StatusCode.InternalServerError)
		}
	}
}
