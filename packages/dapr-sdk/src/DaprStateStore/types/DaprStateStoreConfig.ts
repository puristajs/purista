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
	 * Declare that the deployed Dapr state component enforces per-entry
	 * `metadata.ttlInSeconds`. Dapr ignores this metadata for unsupported
	 * components, so this opt-in is required before Core accepts finite state
	 * retention through this adapter.
	 */
	supportsTtl?: boolean

	/**
	 * Dapr sidecar client settings.
	 */
	clientConfig?: DaprClientConfig
}
