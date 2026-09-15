import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'

import { generalPingServiceInfo } from '../generalPingServiceInfo.js'
import { pingServiceV1ConfigSchema } from './pingServiceConfig.js'

export const pingServiceInfo ={
	serviceVersion: '1',
	...generalPingServiceInfo
} as const satisfies ServiceInfoType

const pingV1ServiceBuilderInstance = new ServiceBuilder(pingServiceInfo)
pingV1ServiceBuilderInstance.setConfigSchema(pingServiceV1ConfigSchema)

export const pingV1ServiceBuilder = pingV1ServiceBuilderInstance
