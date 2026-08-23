import {
	DeleteParameterCommand,
	GetParameterCommand,
	ParameterNotFound,
	ParameterType,
	PutParameterCommand,
	SSMClient,
} from '@aws-sdk/client-ssm'
import type { ObjectWithKeysFromStringArray, StoreBaseConfig } from '@purista/core/adapter'
import { ConfigStoreBaseClass, StatusCode, UnhandledError } from '@purista/core/adapter'

import type { AWSConfigStoreConfig } from './types.js'

/**
 * Config store backed by AWS Systems Manager Parameter Store.
 *
 * Values are read and written as string parameters. The inherited store cache is
 * enabled by default to reduce AWS calls; set `enableCache` to `false` to always
 * read from SSM, or set `cacheTtl` in milliseconds to limit how long cached
 * entries are reused. Expired cache entries are refreshed on the next read.
 *
 * Use tenant-aware and environment-aware parameter names, for example
 * `/tenants/acme/prod/payments/public-api-url`. Do not store secrets here; use a
 * secret store for passwords, tokens, and credentials.
 *
 * AWS credentials and region are resolved by the AWS SDK from `client` options,
 * environment variables, shared config files, or the runtime role.
 *
 * @example
 * ```typescript
 * const store = new AWSConfigStore({
 *   client: { region: 'eu-central-1' },
 *   cacheTtl: 60_000,
 * })
 *
 * await store.setConfig('/tenants/acme/prod/app/theme', 'dark')
 * const config = await store.getConfig('/tenants/acme/prod/app/theme')
 * ```
 */
export class AWSConfigStore extends ConfigStoreBaseClass<AWSConfigStoreConfig> {
	/**
	 * AWS SDK client used for SSM requests.
	 *
	 * Applications normally configure this through the constructor. Tests may
	 * replace it with a compatible client.
	 */
	client: SSMClient

	/**
	 * Creates an AWS Systems Manager config store.
	 *
	 * @param config Store options plus AWS SDK client configuration.
	 */
	constructor(config: StoreBaseConfig<AWSConfigStoreConfig>) {
		super('AWSConfigStore', { enableCache: true, ...config })
		this.client = new SSMClient(this.config.client)
	}

	protected async getConfigImpl<ConfigNames extends string[]>(
		...configNames: ConfigNames
	): Promise<ObjectWithKeysFromStringArray<ConfigNames>> {
		const result: Record<string, string | undefined> = {}

		for (const name of configNames) {
			try {
				const command = new GetParameterCommand({
					Name: name,
				})
				const res = await this.client.send(command)
				result[name] = res.Parameter?.Value
			} catch (err) {
				if (!(err instanceof ParameterNotFound)) {
					throw UnhandledError.fromError(err, StatusCode.InternalServerError)
				}
				result[name] = undefined
			}
		}

		return result as ObjectWithKeysFromStringArray<ConfigNames>
	}

	protected async removeConfigImpl(configName: string) {
		try {
			const command = new DeleteParameterCommand({
				Name: configName,
			})

			await this.client.send(command)
		} catch (err) {
			throw UnhandledError.fromError(err, StatusCode.InternalServerError)
		}
	}

	protected async setConfigImpl(configName: string, configValue: string) {
		try {
			const command = new PutParameterCommand({
				Name: configName,
				Value: configValue,
				Type: ParameterType.STRING,
				Overwrite: true,
			})

			await this.client.send(command)
		} catch (err) {
			throw UnhandledError.fromError(err, StatusCode.InternalServerError)
		}
	}
}
