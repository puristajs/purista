import { HttpServerConfig } from '../types'
import { OPENAPI_DEFAULT_INFO, OPENAPI_DEFAULT_MOUNT_PATH } from './defaults.config'

export const getDefaultConfig = (): HttpServerConfig => {
  const defaultConfig: HttpServerConfig = {
    port: 9090,
    logLevel: 'warn',
    options: {
      ca: 'certs/ca.crt',
      key: 'certs/server.key',
      cert: 'certs/server.crt',
    },
    apiMountPath: '/api',
    openApi: {
      path: OPENAPI_DEFAULT_MOUNT_PATH,
      info: OPENAPI_DEFAULT_INFO,
    },
  }
  return defaultConfig
}
