import type { ServiceInfoType } from '@purista/core'

export const generalSupportServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> = {
	serviceName: 'Support',
	serviceDescription: 'Multi-agent incident response with core PURISTA agents',
}
