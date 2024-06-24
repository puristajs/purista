import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'

import { generalDelayServiceInfo } from '../generalDelayServiceInfo.js'
import { delayServiceV1ConfigSchema } from './delayServiceConfig.js'

export const delayServiceInfo: ServiceInfoType = {
	serviceVersion: '1',
	...generalDelayServiceInfo,
}

// create a service builder instance and assign service config schema and default config.

export const delayV1ServiceBuilder = new ServiceBuilder(delayServiceInfo)
	.setConfigSchema(delayServiceV1ConfigSchema)
	.setDefaultConfig({})
