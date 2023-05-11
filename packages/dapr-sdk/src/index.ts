/* eslint-disable simple-import-sort/exports */
/**
 *
 * SDK and helper to run PURISTA services in Kubernetes.
 *
 * This package provides the Dapr event bridge and adapters for secret, state and config stores provided by Dapr.
 *
 * Here is a full example, how the index file might look like, if you want to deploy a service to Kubernetes.
 *
 * @example ```typescript
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
export * from './types'
export * from './DaprClient'
export * from './DaprEventBridge'
export * from './DaprSecretStore'
export * from './DaprConfigStore'
export * from './DaprStateStore'
