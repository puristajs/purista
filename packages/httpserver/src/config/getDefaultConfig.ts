import { HttpServerConfig } from '../types'
import { OPENAPI_DEFAULT_INFO, OPENAPI_DEFAULT_MOUNT_PATH } from './defaults.config'

export const getDefaultConfig = (): HttpServerConfig => {
  const defaultConfig: HttpServerConfig = {
    fastify: {
      ignoreTrailingSlash: true,
    },
    port: 9090,
    domain: 'localhost',
    enableHelmet: true,
    enableCompress: true,
    enableHealthz: true,
    enableCors: false,
    host: '',
    logLevel: 'warn',
    apiMountPath: '/api',
    openApi: {
      enabled: true,
      path: OPENAPI_DEFAULT_MOUNT_PATH,
      info: OPENAPI_DEFAULT_INFO,
    },
  }
  return defaultConfig
}
