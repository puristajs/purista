import { ServiceBuilder, ServiceInfoType } from '@purista/core'

import { generalTheServiceServiceInfo } from '../generalTheServiceServiceInfo'
import { theServiceServiceV1ConfigSchema } from './theServiceServiceConfig'

export const theServiceServiceInfo: ServiceInfoType = {
  serviceVersion: '1',
  ...generalTheServiceServiceInfo,
}

// create a service builder instance and assign service config schema and default config.

export const theServiceServiceBuilder = new ServiceBuilder(theServiceServiceInfo)
  .setConfigSchema(theServiceServiceV1ConfigSchema)
  .setDefaultConfig({})
