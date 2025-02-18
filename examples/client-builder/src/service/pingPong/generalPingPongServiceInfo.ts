import type { ServiceInfoType } from '@purista/core'

export const generalPingPongServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> = {
	serviceName: 'PingPong',
	serviceDescription: 'an example service',
}
