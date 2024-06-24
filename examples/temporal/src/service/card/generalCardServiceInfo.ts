import type { ServiceInfoType } from '@purista/core'

export const generalCardServiceInfo = {
	serviceName: 'Card',
	serviceDescription: 'the credit card domain',
} as const satisfies Omit<ServiceInfoType, 'serviceVersion'>
