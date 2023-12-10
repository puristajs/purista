import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'

import { generalEmailServiceInfo } from '../generalEmailServiceInfo.js'
import { emailServiceV1ConfigSchema } from './emailServiceConfig.js'

export const emailServiceInfo: ServiceInfoType = {
  serviceVersion: '1',
  ...generalEmailServiceInfo,
}

// create a service builder instance and assign service config schema and default config.

export const emailV1ServiceBuilder = new ServiceBuilder(emailServiceInfo)
  .setConfigSchema(emailServiceV1ConfigSchema)
  .setDefaultConfig({})
