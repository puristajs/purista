import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'

import { generalHttpServerServiceInfo } from '../generalHttpServerServiceInfo.js'
import { HttpServerClass } from './HttpServerClass.impl.js'
import {
  httpServerServiceV1ConfigSchema,
  OPENAPI_DEFAULT_INFO,
  OPENAPI_DEFAULT_MOUNT_PATH,
} from './httpServerServiceConfig.js'

export const httpServerServiceInfo: ServiceInfoType = {
  serviceVersion: '1',
  ...generalHttpServerServiceInfo,
}

// create a service builder instance and assign service config schema and default config.

export const httpServerV1ServiceBuilder = new ServiceBuilder(httpServerServiceInfo)
  .setConfigSchema(httpServerServiceV1ConfigSchema)
  .setDefaultConfig({
    fastify: {
      ignoreTrailingSlash: true,
    },
    logLevel: 'warn',
    port: 9090,
    host: '0.0.0.0',
    domain: 'localhost',
    uploadDir: undefined,
    cookieSecret: undefined,
    apiMountPath: '/api',
    enableHelmet: true,
    enableCompress: true,
    enableHealthz: true,
    healthzFunction: undefined,
    enableCors: false,
    helmetOptions: undefined,
    compressOptions: undefined,
    corsOptions: undefined,
    traceHeaderField: 'x-trace-id',
    openApi: {
      enabled: true,
      path: OPENAPI_DEFAULT_MOUNT_PATH,
      info: OPENAPI_DEFAULT_INFO,
      paths: undefined,
    },
  })
  .setCustomClass(HttpServerClass)
