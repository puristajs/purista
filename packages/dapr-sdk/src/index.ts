/* eslint-disable simple-import-sort/exports */
/**
 *
 * SDK and helper to run PURISTA services with Dapr.
 *
 * This package provides the Dapr event bridge and adapters for secret, state and config stores provided by Dapr.
 *
 * Here is a compact example of wiring a PURISTA service to the Dapr sidecar.
 *
 * @example
 * ```typescript
 * import { DaprConfigStore, DaprEventBridge, DaprSecretStore, DaprStateStore } from '@purista/dapr-sdk'
 * const eventBridge = new DaprEventBridge({
 *    spanProcessor,
 *    logger,
 *    serve,
 *  })
 *
 * const secretStore = new DaprSecretStore({ logger, secretStoreName: 'local-secret-store' })
 * const stateStore = new DaprStateStore({ logger, stateStoreName: 'local-state-store' })
 * const configStore = new DaprConfigStore({ logger, configStoreName: 'local-config-store' })
 *
 * // start the services ...
 *
 * await eventBridge.start()
 *```
 *
 * @module
 */

export type { DaprClientConfig } from './DaprClient/types/DaprClientConfig.js'
export { DaprConfigStore } from './DaprConfigStore/DaprConfigStore.impl.js'
export type { DaprConfigStoreConfig } from './DaprConfigStore/types/DaprConfigStoreConfig.js'
export { DaprEventBridge } from './DaprEventBridge/DaprEventBridge.impl.js'
export type { DaprEventBridgeConfig } from './DaprEventBridge/types/DaprEventBridgeConfig.js'
export { DaprSecretStore } from './DaprSecretStore/DaprSecretStore.impl.js'
export type { DaprSecretStoreConfig } from './DaprSecretStore/types/DaprSecretStoreConfig.js'
export { DaprStateStore } from './DaprStateStore/DaprStateStore.impl.js'
export type { DaprStateStoreConfig } from './DaprStateStore/types/DaprStateStoreConfig.js'
