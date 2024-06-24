import type { ServiceInfoType } from '@purista/core'

export const generalTheServiceServiceInfo = {
	serviceName: 'TheService',
	serviceDescription: 'a example service',
} as const satisfies Omit<ServiceInfoType, 'serviceVersion'>
