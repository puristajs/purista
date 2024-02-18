import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'

import { generalAccountServiceInfo } from '../generalAccountServiceInfo.js'
import { accountServiceV1ConfigSchema } from './accountServiceConfig.js'

export const accountServiceInfo = {
  serviceVersion: '1',
  ...generalAccountServiceInfo,
} as const satisfies ServiceInfoType

// create a service builder instance and assign service config schema and default config.

export const accountV1ServiceBuilder = new ServiceBuilder(accountServiceInfo)
  .setConfigSchema(accountServiceV1ConfigSchema)
  .setDefaultConfig({})
