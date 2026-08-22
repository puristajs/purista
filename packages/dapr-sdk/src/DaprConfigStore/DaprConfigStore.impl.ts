import { join } from 'node:path'

import type { ObjectWithKeysFromStringArray, StoreBaseConfig } from '@purista/core'
import { ConfigStoreBaseClass, HttpClient, StatusCode, UnhandledError } from '@purista/core'

import { getDefaultClientConfig } from '../DaprClient/getDefaultClientConfig.impl.js'
import type { DaprClientConfig } from '../DaprClient/types/DaprClientConfig.js'
import { puristaVersion } from '../version.js'
import type { DaprConfigStoreConfig } from './types/DaprConfigStoreConfig.js'

const DAPR_API_VERSION = 'v1.0-alpha1'

/**
 * Config store adapter backed by Dapr configuration components.
 *
 * Reads values through the local Dapr sidecar. Dapr's configuration API is read
 * here; mutation methods throw `NotImplemented`.
 *
 * @example
 * ```ts
 * const configStore = new DaprConfigStore({
 *   configStoreName: 'application-config',
 *   clientConfig: { daprHost: 'http://127.0.0.1', daprPort: '3500' },
 * })
 * const { featureEnabled } = await configStore.getConfig('featureEnabled')
 * ```
 */
export class DaprConfigStore extends ConfigStoreBaseClass<DaprConfigStoreConfig> {
	private client: HttpClient<DaprClientConfig>

	/**
	 * Creates a Dapr-backed config store.
	 *
	 * @param config - Store name, logger and Dapr sidecar client settings.
	 */
	constructor(config?: StoreBaseConfig<DaprConfigStoreConfig>) {
		super(config?.configStoreName ?? 'DaprConfigStore', { ...config })
		const logger = this.logger
		const conf = {
			configStoreName: 'configStore',
			logger,
			...config,
			clientConfig: {
				...getDefaultClientConfig(),
				...config?.clientConfig,
			},
		}

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
	 * Reads one or more configuration values from the configured Dapr component.
	 */
	async getConfigImpl<ConfigNames extends string[]>(
		...configNames: ConfigNames
	): Promise<ObjectWithKeysFromStringArray<ConfigNames>> {
		const fetchConfigFromStore = async (configName: string) => {
			const path = join(
				this.config.clientConfig?.daprApiVersion ?? DAPR_API_VERSION,
				'configuration',
				this.config.configStoreName as string,
			)

			return this.client.get<{ key: string; value: unknown }[]>(path, { query: { key: configName } })
		}

		const returnValue: Record<string, unknown> = {}

		for (const configName of configNames) {
			const response = await fetchConfigFromStore(configName)
			const value = response.find(entry => entry.key === configName)?.value
			returnValue[configName] = value
		}

		return returnValue as ObjectWithKeysFromStringArray<ConfigNames>
	}

	/**
	 * Dapr configuration mutation is not implemented by this adapter.
	 */
	async setConfigImpl(_configName: string, _configValue: unknown) {
		throw new UnhandledError(StatusCode.NotImplemented, 'setting or changing of configs is not available')
	}

	/**
	 * Dapr configuration removal is not implemented by this adapter.
	 */
	async removeConfigImpl(_configName: string) {
		throw new UnhandledError(StatusCode.NotImplemented, 'removing of configs is not available')
	}
}
