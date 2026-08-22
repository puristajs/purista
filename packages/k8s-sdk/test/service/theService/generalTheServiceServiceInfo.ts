import type { ServiceInfoType } from '@purista/core/adapter'

export const generalTheServiceServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> = {
	serviceName: 'TheService',
	serviceDescription: 'a example service',
}
