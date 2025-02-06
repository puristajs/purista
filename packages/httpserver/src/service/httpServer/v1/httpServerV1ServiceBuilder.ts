import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'

import { generalHttpServerServiceInfo } from '../generalHttpServerServiceInfo.js'
import { HttpServerClass } from './HttpServerClass.impl.js'
import { httpServerServiceV1ConfigSchema } from './httpServerServiceConfig.js'

export const httpServerServiceInfo: ServiceInfoType = {
	serviceVersion: '1',
	...generalHttpServerServiceInfo,
}

// create a service builder instance and assign service config schema and default config.

export const httpServerV1ServiceBuilder = new ServiceBuilder(httpServerServiceInfo)
	.setConfigSchema(httpServerServiceV1ConfigSchema)
	.setCustomClass(HttpServerClass)
