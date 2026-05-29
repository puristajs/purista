import type { DaprClientConfig } from '../../DaprClient/types/DaprClientConfig.js'

/**
 * Configuration for {@link DaprSecretStore}.
 */
export type DaprSecretStoreConfig = {
	/**
	 * Dapr secret component name.
	 */
	secretStoreName?: string

	/**
	 * Dapr sidecar client settings.
	 */
	clientConfig?: DaprClientConfig

	/**
	 * Dapr secret store request metadata.
	 */
	metadata?: {
		/**
		 * Kubernetes namespace for secret stores deployed outside the default namespace.
		 */
		namespace?: string
	}
}
