import type { DaprClientConfig } from '../../DaprClient'

/**
 * Dapr secret store configuration
 */
export type DaprSecretStoreConfig = {
  /**
   * The name of the secret store
   */
  secretStoreName?: string

  /**
   * The Dapr client config to interact with Dapr sidecar
   */
  clientConfig?: DaprClientConfig

  /**
   * Dapr secret store metadata
   */
  metadata?: {
    /**
     * In case of deploying into namespace other than default, the namespace (e.g. production) must be set
     */
    namespace?: string
  }
}
