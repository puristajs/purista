import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'

import { generalTheServiceServiceInfo } from '../generalTheServiceServiceInfo.js'
import { theServiceServiceV1ConfigSchema } from './theServiceServiceConfig.js'

export const theServiceServiceInfo = {
  serviceVersion: '1',
  ...generalTheServiceServiceInfo,
} as const satisfies ServiceInfoType

// create a service builder instance and assign service config schema and default config.

export const theServiceServiceBuilder = new ServiceBuilder(theServiceServiceInfo)
  .setConfigSchema(theServiceServiceV1ConfigSchema)
  .setDefaultConfig({})
