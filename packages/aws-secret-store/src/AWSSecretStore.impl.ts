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
} from '@purista/core'

import type { AWSSecretStoreConfig } from './types.js'

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
			}
		}
	}
}
