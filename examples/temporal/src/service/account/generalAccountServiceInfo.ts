import type { ServiceInfoType } from '@purista/core'

export const generalAccountServiceInfo = {
	serviceName: 'Account',
	serviceDescription: 'bank account domain',
} as const satisfies Omit<ServiceInfoType, 'serviceVersion'>
