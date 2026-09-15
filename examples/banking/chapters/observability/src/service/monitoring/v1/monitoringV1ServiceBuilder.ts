import { ServiceBuilder, type ServiceInfoType } from '@purista/core'
import { generalMonitoringServiceInfo } from '../generalMonitoringServiceInfo.js'
import {
	largeDebitSignalMetricDefinition,
	largeDebitSignalMetricName,
} from './monitoringMetrics.js'
import { monitoringServiceV1ConfigSchema } from './monitoringServiceConfig.js'

export const monitoringServiceInfo = {
	serviceVersion: '1',
	...generalMonitoringServiceInfo,
} as const satisfies ServiceInfoType

export const monitoringV1ServiceBuilder = new ServiceBuilder(monitoringServiceInfo)
	.setConfigSchema(monitoringServiceV1ConfigSchema)
	.defineMetric(largeDebitSignalMetricName, largeDebitSignalMetricDefinition)
