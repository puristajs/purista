import { join } from 'node:path'

import type { ObjectWithKeysFromStringArray, StoreBaseConfig } from '@purista/core'
import { HttpClient, SecretStoreBaseClass, StatusCode, UnhandledError } from '@purista/core'

import { getDefaultClientConfig } from '../DaprClient/getDefaultClientConfig.impl.js'
import type { DaprClientConfig } from '../DaprClient/types/DaprClientConfig.js'
import { DAPR_API_VERSION } from '../types/constants.js'
import { puristaVersion } from '../version.js'
import type { DaprSecretStoreConfig } from './types/DaprSecretStoreConfig.js'

/**
 * Secret store adapter backed by a Dapr secret component.
 *
 * The adapter fetches secrets through the local sidecar. Creating, changing and
 * removing secrets is not supported by this implementation.
 */
export class DaprSecretStore extends SecretStoreBaseClass<DaprSecretStoreConfig> {
	private client: HttpClient<DaprClientConfig>

	/**
	 * Creates a Dapr-backed secret store.
	 *
	 * @param config - Store name, namespace metadata and Dapr sidecar client settings.
	 */
	constructor(config?: StoreBaseConfig<DaprSecretStoreConfig>) {
		const conf = {
			secretStoreName: 'secretStore',
			...config,
			clientConfig: {
				...getDefaultClientConfig(),
				...config?.clientConfig,
			},
		}

		super(conf.secretStoreName, conf)
		const logger = this.logger

		let baseUrl = `${conf.clientConfig.daprHost}:${conf.clientConfig.daprPort}`
		if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
			baseUrl = `http://${baseUrl}`
		}

		const defaultHeaders: Record<string, string> = {
			'content-type': 'application/json; charset=utf-8',
		}

		if (conf.clientConfig.daprApiToken) {
			defaultHeaders['dapr-api-token'] = conf.clientConfig.daprApiToken
			defaultHeaders['user-agent'] = `purista-dapr-client/v${puristaVersion} http/1`
		}

		this.client = new HttpClient<DaprClientConfig>({
			logger,
			baseUrl,
			defaultHeaders,
			...conf.clientConfig,
		})
	}

	/**
	 * Reads one or more secrets from the configured Dapr component.
	 *
	 * Never log secret values or include them in traces, metrics, examples or error messages.
	 */
	protected async getSecretImpl<SecretNames extends string[]>(
		...secretNames: SecretNames
	): Promise<ObjectWithKeysFromStringArray<SecretNames, string | undefined>> {
		const fetchSecretFromStore = async (secretName: string) => {
			const path = join(
				this.config.clientConfig?.daprApiVersion ?? DAPR_API_VERSION,
				'secrets',
				this.config.secretStoreName as string,
				secretName,
			)

			const query: Record<string, string> = {}

			if (this.config.metadata?.namespace) {
				query['metadata.namespace'] = this.config.metadata?.namespace
			}

			return this.client.get<Record<string, string>>(path, { query })
		}

		const returnValue: Record<string, string | undefined> = {}
		for (const secretName of secretNames) {
			const response = await fetchSecretFromStore(secretName)
			returnValue[secretName] = response[secretName]
		}

		return returnValue as ObjectWithKeysFromStringArray<SecretNames, string | undefined>
	}

	/**
	 * Dapr secret mutation is not implemented by this adapter.
	 */
	protected async setSecretImpl(secretName: string) {
		void secretName
		throw new UnhandledError(StatusCode.NotImplemented, 'setting or changing of secrets is not available')
	}

	/**
	 * Dapr secret removal is not implemented by this adapter.
	 */
	protected async removeSecretImpl(secretName: string) {
		void secretName
		throw new UnhandledError(StatusCode.NotImplemented, 'removing of secrets is not available')
	}
}
