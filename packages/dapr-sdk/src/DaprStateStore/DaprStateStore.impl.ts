import { join } from 'node:path'

import type { ObjectWithKeysFromStringArray, StoreBaseConfig } from '@purista/core'
import { HttpClient, StateStoreBaseClass } from '@purista/core'

import { getDefaultClientConfig } from '../DaprClient/getDefaultClientConfig.impl.js'
import type { DaprClientConfig } from '../DaprClient/types/DaprClientConfig.js'
import { DAPR_API_VERSION } from '../types/constants.js'
import { puristaVersion } from '../version.js'
import type { DaprStateStoreConfig } from './types/DaprStateStoreConfig.js'

/**
 * State store adapter backed by a Dapr state component.
 *
 * Reads, writes and removes JSON state values through the local Dapr sidecar.
 */
export class DaprStateStore extends StateStoreBaseClass<DaprStateStoreConfig> {
	private client: HttpClient<DaprClientConfig>

	/**
	 * Creates a Dapr-backed state store.
	 *
	 * @param config - Store name, logger and Dapr sidecar client settings.
	 */
	constructor(config?: StoreBaseConfig<DaprStateStoreConfig>) {
		super(config?.stateStoreName ?? 'DaprStateStore', { ...config })
		const logger = this.logger
		const conf = {
			stateStoreName: 'stateStore',
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
	 * Reads one or more state values from the configured Dapr component.
	 */
	protected async getStateImpl<StateNames extends string[]>(
		...stateNames: StateNames
	): Promise<ObjectWithKeysFromStringArray<StateNames>> {
		const fetchStatesFromStore = async (stateName: string) => {
			const path = join(
				this.config.clientConfig?.daprApiVersion ?? DAPR_API_VERSION,
				'state',
				this.config.stateStoreName as string,
				stateName,
			)

			const query: Record<string, string> = {
				'metadata.contentType': 'application/json',
			}

			return this.client.get<unknown>(path, { query })
		}

		const result = await Promise.all(stateNames.map(stateName => fetchStatesFromStore(stateName)))

		const returnValue: Record<string, unknown> = {}

		stateNames.forEach((value, index) => {
			returnValue[value] = result[index]
		})

		return returnValue as ObjectWithKeysFromStringArray<StateNames>
	}

	/**
	 * Writes a state value to the configured Dapr component.
	 */
	protected async setStateImpl(stateName: string, stateValue: unknown) {
		const path = join(
			this.config.clientConfig?.daprApiVersion ?? DAPR_API_VERSION,
			'state',
			this.config.stateStoreName as string,
		)

		const payload = [
			{
				key: stateName,
				value: stateValue,
			},
		]

		await this.client.post(path, payload)
	}

	/**
	 * Removes a state value from the configured Dapr component.
	 */
	protected async removeStateImpl(stateName: string) {
		const path = join(
			this.config.clientConfig?.daprApiVersion ?? DAPR_API_VERSION,
			'state',
			this.config.stateStoreName as string,
			stateName,
		)

		await this.client.delete(path)
	}
}
