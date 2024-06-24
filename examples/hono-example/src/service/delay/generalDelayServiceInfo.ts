import type { ServiceInfoType } from '@purista/core'

export const generalDelayServiceInfo = {
	serviceName: 'Delay',
	serviceDescription: 'Example to show a service which starts after webserver and registers commands',
} as const satisfies Omit<ServiceInfoType, 'serviceVersion'>
