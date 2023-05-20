import { ServiceBuilder, ServiceInfoType } from '@purista/core'

import { generalUserServiceInfo } from '../generalUserServiceInfo'
import { userServiceV1ConfigSchema } from './userServiceConfig'

export const userServiceInfo: ServiceInfoType = {
  serviceVersion: '1',
  ...generalUserServiceInfo,
}

// create a service builder instance and assign service config schema and default config.

export const userV1ServiceBuilder = new ServiceBuilder(userServiceInfo)
  .setConfigSchema(userServiceV1ConfigSchema)
  .setDefaultConfig({})
