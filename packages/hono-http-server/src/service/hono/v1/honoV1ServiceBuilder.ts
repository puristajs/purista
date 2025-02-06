import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'

import { generalHonoServiceInfo } from '../generalHonoServiceInfo.js'
import { HonoServiceClass } from './HonoServiceClass.js'
import { honoServiceV1ConfigSchema } from './honoServiceConfig.js'

export const honoServiceInfo: ServiceInfoType = {
	serviceVersion: '1',
	...generalHonoServiceInfo,
}

// create a service builder instance and assign service config schema and default config.

export const honoV1ServiceBuilder = new ServiceBuilder(honoServiceInfo)
	.setConfigSchema(honoServiceV1ConfigSchema)
	.setCustomClass(HonoServiceClass)
