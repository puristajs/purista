import { ServiceBuilder, ServiceInfoType } from '@purista/core'

import { generalEmailServiceInfo } from '../generalEmailServiceInfo'
import { emailServiceV1ConfigSchema } from './emailServiceConfig'

export const emailServiceInfo: ServiceInfoType = {
  serviceVersion: '1',
  ...generalEmailServiceInfo,
}

// create a service builder instance and assign service config schema and default config.

export const emailV1ServiceBuilder = new ServiceBuilder(emailServiceInfo)
  .setConfigSchema(emailServiceV1ConfigSchema)
  .setDefaultConfig({})
