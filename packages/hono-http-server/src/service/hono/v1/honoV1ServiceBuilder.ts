import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'

import { generalHonoServiceInfo } from '../generalHonoServiceInfo.js'
import { HonoServiceClass } from './HonoServiceClass.js'
import { DEFAULT_API_MOUNT_PATH, honoServiceV1ConfigSchema, OPENAPI_DEFAULT_INFO } from './honoServiceConfig.js'

export const honoServiceInfo: ServiceInfoType = {
  serviceVersion: '1',
  ...generalHonoServiceInfo,
}

// create a service builder instance and assign service config schema and default config.

export const honoV1ServiceBuilder = new ServiceBuilder(honoServiceInfo)
  .setConfigSchema(honoServiceV1ConfigSchema)
  .setDefaultConfig({
    logLevel: 'warn',
    apiMountPath: DEFAULT_API_MOUNT_PATH,
    enableHealth: true,
    healthPath: '/healthz',
    healthFunction: function () {},
    protectHandler: function () {},
    services: [],
    traceHeaderField: 'x-trace-id',
    openApi: {
      openapi: '3.1.0',
      enabled: true,
      info: OPENAPI_DEFAULT_INFO,
      paths: undefined,
    },
  })
  .setCustomClass(HonoServiceClass)
