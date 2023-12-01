import type { DaprClientConfig } from '../../DaprClient'

/**
 * Dapr state store configuration
 */
export type DaprStateStoreConfig = {
  /**
   * The name of the state store
   */
  stateStoreName?: string

  /**
   * The Dapr client config to interact with Dapr sidecar
   */
  clientConfig?: DaprClientConfig
}
