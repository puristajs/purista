import { HttpServerConfig } from '../types'
import { OPENAPI_DEFAULT_INFO, OPENAPI_DEFAULT_MOUNT_PATH } from './defaults.config'

export const getDefaultConfig = (): HttpServerConfig => {
  const defaultConfig: HttpServerConfig = {
    fastify: {
      requestIdHeader: 'x-trace-id',
      requestIdLogLabel: 'traceId',
      ignoreTrailingSlash: true,
    },
    port: 9090,
    domain: 'localhost',
    logLevel: 'warn',
    apiMountPath: '/api',
    openApi: {
      path: OPENAPI_DEFAULT_MOUNT_PATH,
      info: OPENAPI_DEFAULT_INFO,
    },
  }
  return defaultConfig
}
