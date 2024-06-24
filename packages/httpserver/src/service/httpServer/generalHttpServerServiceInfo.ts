import type { ServiceInfoType } from '@purista/core'

export const generalHttpServerServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> = {
	serviceName: 'HttpServer',
	serviceDescription: 'provides a http web server for PURISTA',
}
