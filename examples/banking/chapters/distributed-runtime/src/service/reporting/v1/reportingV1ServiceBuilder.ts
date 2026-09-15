import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'

import { generalReportingServiceInfo } from '../generalReportingServiceInfo.js'
import { reportingServiceV1ConfigSchema } from './reportingServiceConfig.js'

export const reportingServiceInfo ={
	serviceVersion: '1',
	...generalReportingServiceInfo
} as const satisfies ServiceInfoType

const reportingV1ServiceBuilderInstance = new ServiceBuilder(reportingServiceInfo)
reportingV1ServiceBuilderInstance.setConfigSchema(reportingServiceV1ConfigSchema)

export const reportingV1ServiceBuilder = reportingV1ServiceBuilderInstance
