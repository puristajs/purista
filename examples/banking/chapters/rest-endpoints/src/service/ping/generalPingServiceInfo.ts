import type { ServiceInfoType } from '@purista/core'

export const generalPingServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> =
{
	serviceName: 'Ping',
	serviceDescription: 'Simple health and connectivity service',
}