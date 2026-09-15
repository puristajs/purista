import type { ServiceInfoType } from '@purista/core'

export const generalIdentityServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> =
{
	serviceName: 'Identity',
	serviceDescription: 'Authenticate local users and own sessions',
}