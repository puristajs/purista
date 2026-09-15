import type { ServiceInfoType } from '@purista/core'

export const generalMonitoringServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> =
{
	serviceName: 'Monitoring',
	serviceDescription: 'Derive small operational signals from business events',
}