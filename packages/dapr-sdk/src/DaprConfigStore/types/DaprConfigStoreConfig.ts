import type { DaprClientConfig } from '../../DaprClient'

/**
 * Dapr config store configuration
 */
export type DaprConfigStoreConfig = {
  /**
   * The name of the config store
   */
  configStoreName?: string
  /**
   * The Dapr client config to interact with Dapr sidecar
   */
  clientConfig?: DaprClientConfig
}
