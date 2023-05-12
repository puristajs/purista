import type { ServerOptions } from 'node:http'

import type { Logger, Service } from '@purista/core'

/**
 * The configuration object for creating the k8s http server
 */
export type GetHttpServerConfig = {
  /** a logger instance */
  logger: Logger
  /** node http module server options */
  httpServerOptions?: ServerOptions
  /** health function to be executed on health check */
  healthFn: () => Promise<boolean>
  /** service or array of services which should expose their commands as endpoints if defined */
  services?: Service | Service[]
  /** disables adding of all  endpoints for commands which are marked to be exposed as http endpoints */
  disableEndpointExposing?: boolean
  /** the api mount path @default /api */
  apiMountPath?: string
}
