import { ActorRuntimeOptions } from './ActorRuntimeOptions'

export type DaprEventBridgeConfig = {
  /**
   * Host of the server.
   */
  serverHost?: string
  /**
   * Port of the server.
   */
  serverPort?: string

  /**
   * Host location of the Dapr sidecar.
   * Default is 127.0.0.1.
   */
  daprHost?: string
  /**
   * Port of the Dapr sidecar.
   * Default is 3500.
   */
  daprPort?: string

  /**
   * If set to false, the HTTP client will not reuse the same connection for multiple requests.
   * Default is true.
   */
  isKeepAlive?: boolean

  /**
   * Options related to actors.
   */
  actor?: ActorRuntimeOptions

  /**
   * API token to authenticate with Dapr.
   * See https://docs.dapr.io/operations/security/api-token/.
   */
  daprApiToken?: string

  /**
   * the prefix to be used for exposing commands in Dapr
   */
  pathPrefix?: string
}
