import type { DaprClientConfig } from '../../DaprClient/types/DaprClientConfig.js'

/**
 * Configuration for {@link DaprConfigStore}.
 */
export type DaprConfigStoreConfig = {
	/**
	 * Dapr configuration component name.
	 */
	configStoreName?: string
	/**
	 * Dapr sidecar client settings.
	 */
	clientConfig?: Partial<DaprClientConfig>
}
