import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'

import { generalMonitoringServiceInfo } from '../generalMonitoringServiceInfo.js'
import { monitoringServiceV1ConfigSchema } from './monitoringServiceConfig.js'

export const monitoringServiceInfo ={
	serviceVersion: '1',
	...generalMonitoringServiceInfo
} as const satisfies ServiceInfoType

const monitoringV1ServiceBuilderInstance = new ServiceBuilder(monitoringServiceInfo)
monitoringV1ServiceBuilderInstance.setConfigSchema(monitoringServiceV1ConfigSchema)

export const monitoringV1ServiceBuilder = monitoringV1ServiceBuilderInstance
