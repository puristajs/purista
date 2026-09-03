import type { ServiceInfoType } from '@purista/core'

export const generalSupportServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> = {
	serviceName: 'Support',
	serviceDescription: 'Classify and route customer support requests',
}
