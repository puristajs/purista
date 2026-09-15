import type { DaprClientConfig } from '../../DaprClient/types/DaprClientConfig.js'

/**
 * Configuration for {@link DaprStateStore}.
 */
export type DaprStateStoreConfig = {
	/**
	 * Dapr state component name.
	 */
	stateStoreName?: string

	/**
	 * Dapr sidecar client settings.
	 */
	clientConfig?: Partial<DaprClientConfig>
}
