import type { ServiceInfoType } from '@purista/core'

export const generalEmailServiceInfo = {
	serviceName: 'Email',
	serviceDescription: 'sends emails to customers',
} as const satisfies Omit<ServiceInfoType, 'serviceVersion'>
